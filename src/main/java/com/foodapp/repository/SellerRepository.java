package com.foodapp.repository;

import com.foodapp.model.SellerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SellerRepository extends JpaRepository<SellerProfile, Long> {
    // Admin User Story 2: "I can see a queue of 'Pending Approval' seller applications." [cite: 151]
    // Spring automatically translates "False" to SQL: WHERE is_approved = 0
    List<SellerProfile> findByIsApprovedFalse(); // Pending
    List<SellerProfile> findByIsApprovedTrue();  // Approved

    // Helper to find the seller profile linked to a specific User ID
    Optional<SellerProfile> findByUserId(Long userId);
}