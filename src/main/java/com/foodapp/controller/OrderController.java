package com.foodapp.controller;

import com.foodapp.enums.OrderStatus;
import com.foodapp.model.Order;
import com.foodapp.repository.OrderRepository;
import com.foodapp.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // We inject the Repository directly for simple "Read" operations
    // (Service is used for complex "Write" logic)
    @Autowired
    private OrderRepository orderRepository;

    /**
     * User Story 3: Place Order
     * Endpoint: POST /api/orders/create
     * Body: { "customerId": 1, "sellerId": 2, "items": { "101": 2, "102": 1 } }
     */
    @PostMapping("/create")
    public Order placeOrder(@RequestBody OrderRequest request) {
        try {
            return orderService.placeOrder(
                    request.customerId,
                    request.sellerId,
                    request.items
            );
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage()); // Returns 500 Error to user
        }
    }

    /**
     * User Story 4: Cancel Order
     * Endpoint: POST /api/orders/{orderId}/cancel
     */
    @PostMapping("/{orderId}/cancel")
    public String cancelOrder(@PathVariable Long orderId) {
        try {
            orderService.cancelOrder(orderId);
            return "Order cancelled successfully.";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    /**
     * Seller User Story 6: Update Order Status
     * Endpoint: POST /api/orders/{orderId}/status?newStatus=READY_FOR_PICKUP
     */
    @PostMapping("/{orderId}/status")
    public String updateStatus(@PathVariable Long orderId, @RequestParam OrderStatus newStatus) {
        try {
            orderService.updateStatus(orderId, newStatus);
            return "Status updated to " + newStatus;
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    /**
     * User Story 8 & 9: View My Orders (History & Active)
     * Endpoint: GET /api/orders/customer/{customerId}
     */
    @GetMapping("/customer/{customerId}")
    public List<Order> getCustomerOrders(@PathVariable Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    /**
     * Seller User Story 7: View Seller Orders
     * Endpoint: GET /api/orders/seller/{sellerId}
     */
    @GetMapping("/seller/{sellerId}")
    public List<Order> getSellerOrders(@PathVariable Long sellerId) {
        return orderRepository.findBySellerId(sellerId);
    }

    // --- Helper DTO Class (Data Transfer Object) ---
    // This defines what the JSON Payload looks like
    public static class OrderRequest {
        public Long customerId;
        public Long sellerId;
        public Map<Long, Integer> items; // Key: FoodID, Value: Quantity
    }

    /**
     * Seller User Story: Sales Overview (Total Revenue & Count)
     * Endpoint: GET /api/orders/sales-overview/{sellerId}
     */
    @GetMapping("/sales-overview/{sellerId}")
    public Map<String, Object> getSalesOverview(@PathVariable Long sellerId) {
        // 1. Calculate Total Revenue
        // NOTE: Make sure you added 'calculateTotalRevenue' to OrderRepository.java first!
        Double totalRevenue = orderRepository.calculateTotalRevenue(sellerId);

        // 2. Count Total Orders
        // Spring Boot automatically understands this query
        Long totalOrders = orderRepository.countBySellerId(sellerId);

        // 3. Prepare the Response
        Map<String, Object> response = new HashMap<>();
        // If revenue is null (no sales yet), return 0.0
        response.put("revenue", totalRevenue != null ? totalRevenue : 0.0);
        response.put("orders", totalOrders != null ? totalOrders : 0);

        return response;
    }
}