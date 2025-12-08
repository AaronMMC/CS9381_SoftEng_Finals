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

    @Autowired
    private OrderRepository orderRepository;

    /**
     * User Story 3: Place Order
     * Endpoint: POST /api/orders/create
     * Body: { "customerId": 1, "sellerId": 2, "items": { "101": 2, "102": 1 } }
     */
    @PostMapping("/create")
    public Order placeOrder(@RequestBody OrderRequest request) throws Exception {
        return orderService.placeOrder(request.customerId, request.sellerId, request.items);
    }

    /**
     * User Story 4: Cancel Order
     * Endpoint: POST /api/orders/{orderId}/cancel
     */
    @PostMapping("/{orderId}/cancel")
    public Map<String, String> cancelOrder(@PathVariable Long orderId) throws Exception {
        orderService.cancelOrder(orderId);
        return Map.of("message", "Order cancelled successfully.");
    }

    /**
     * Seller User Story 6: Update Order Status
     * Endpoint: POST /api/orders/{orderId}/status?newStatus=READY_FOR_PICKUP
     */
    @PostMapping("/{orderId}/status")
    public Map<String, String> updateStatus(@PathVariable Long orderId, @RequestParam OrderStatus newStatus) throws Exception {
        orderService.updateStatus(orderId, newStatus);
        return Map.of("message", "Status updated to " + newStatus);
    }

    /**
     * User Story 8 & 9: View My Orders (History & Active)
     * Endpoint: GET /api/orders/customer/{customerId}
     */
    @GetMapping("/customer/{customerId}")
    public List<Order> getCustomerOrders(@PathVariable Long customerId) {
        return orderRepository.findByCustomer_Id(customerId);
    }

    /**
     * Seller User Story 7: View Seller Orders
     * Endpoint: GET /api/orders/seller/{sellerId}
     */
    @GetMapping("/seller/{sellerId}")
    public List<Order> getSellerOrders(@PathVariable Long sellerId) {
        return orderRepository.findBySeller_Id(sellerId);
    }

    // --- Helper DTO Class (Data Transfer Object) ---
    // This defines what the JSON Payload looks like
    public static class OrderRequest {
        public Long customerId;
        public Long sellerId;
        public Map<Long, Integer> items;
    }

    /**
     * Seller User Story: Sales Overview (Total Revenue & Count)
     * Endpoint: GET /api/orders/sales-overview/{sellerId}
     */
    @GetMapping("/sales-overview/{sellerId}")
    public Map<String, Object> getSalesOverview(@PathVariable Long sellerId) {
        Double totalRevenue = orderRepository.calculateTotalRevenue(sellerId);
        Long totalOrders = orderRepository.countBySeller_Id(sellerId);
        Map<String, Object> response = new HashMap<>();
        response.put("revenue", totalRevenue != null ? totalRevenue : 0.0);
        response.put("orders", totalOrders != null ? totalOrders : 0);
        return response;
    }
}