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
     */
    @PostMapping("/create")
    public Order placeOrder(@RequestBody OrderRequest request) throws Exception {
        return orderService.placeOrder(
                request.customerId,
                request.sellerId,
                request.items,
                request.deliveryLocation // <--- Passing location to service
        );
    }

    /**
     * User Story 4: Cancel Order
     */
    @PostMapping("/{orderId}/cancel")
    public Map<String, String> cancelOrder(@PathVariable Long orderId) throws Exception {
        orderService.cancelOrder(orderId);
        return Map.of("message", "Order cancelled successfully.");
    }

    /**
     * Seller User Story 6: Update Order Status
     */
    @PostMapping("/{orderId}/status")
    public Map<String, String> updateStatus(@PathVariable Long orderId, @RequestParam OrderStatus newStatus) throws Exception {
        orderService.updateStatus(orderId, newStatus);
        return Map.of("message", "Status updated to " + newStatus);
    }

    @GetMapping("/customer/{customerId}")
    public List<Order> getCustomerOrders(@PathVariable Long customerId) {
        return orderRepository.findByCustomer_Id(customerId);
    }

    @GetMapping("/seller/{sellerId}")
    public List<Order> getSellerOrders(@PathVariable Long sellerId) {
        return orderRepository.findBySeller_Id(sellerId);
    }

    @GetMapping("/sales-overview/{sellerId}")
    public Map<String, Object> getSalesOverview(@PathVariable Long sellerId) {
        Double totalRevenue = orderRepository.calculateTotalRevenue(sellerId);
        Long totalOrders = orderRepository.countBySeller_Id(sellerId);
        Map<String, Object> response = new HashMap<>();
        response.put("revenue", totalRevenue != null ? totalRevenue : 0.0);
        response.put("orders", totalOrders != null ? totalOrders : 0);
        return response;
    }

    // --- Helper DTO Class ---
    public static class OrderRequest {
        public Long customerId;
        public Long sellerId;
        public Map<Long, Integer> items;
        public String deliveryLocation; // <--- Added field
    }
}