package com.foodapp.repository;

import com.foodapp.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // Find orders for a specific customer
    List<Order> findByCustomerId(Long customerId);

    // Find orders for a specific seller
    List<Order> findBySellerId(Long sellerId);

    // --- SALES OVERVIEW QUERY ---
    // Fixed: Changed 'totalAmount' to 'totalPrice' to match your Order.java file
    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o WHERE o.seller.id = :sellerId AND o.status = 'COMPLETED'")
    Double calculateTotalRevenue(@Param("sellerId") Long sellerId);

    // Count total orders
    Long countBySellerId(Long sellerId);
}