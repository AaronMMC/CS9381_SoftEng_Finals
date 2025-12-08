package com.foodapp.repository;

import com.foodapp.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT o FROM Order o JOIN FETCH o.customer JOIN FETCH o.seller WHERE o.customer.id = :customerId")
    List<Order> findByCustomer_Id(@Param("customerId") Long customerId);

    @Query("SELECT o FROM Order o JOIN FETCH o.customer JOIN FETCH o.seller WHERE o.seller.id = :sellerId")
    List<Order> findBySeller_Id(@Param("sellerId") Long sellerId);

    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o WHERE o.seller.id = :sellerId AND o.status = 'COMPLETED'")
    Double calculateTotalRevenue(@Param("sellerId") Long sellerId);

    Long countBySeller_Id(Long sellerId);
}