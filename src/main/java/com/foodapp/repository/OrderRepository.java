package com.foodapp.repository;

import com.foodapp.model.Order;
import com.foodapp.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // User Story 8 & 9: View "My Orders" and "Order History" [cite: 145]
    List<Order> findByCustomerId(Long customerId);

    // Seller User Story 7: View "Seller Order History" [cite: 149]
    List<Order> findBySellerId(Long sellerId);

    // Seller User Story 6: View "Active Orders" queue [cite: 149]
    // Example usage: repo.findBySellerIdAndStatus(1L, OrderStatus.PENDING);
    List<Order> findBySellerIdAndStatus(Long sellerId, OrderStatus status);
}