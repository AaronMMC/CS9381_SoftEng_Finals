package com.foodapp.repository;

import com.foodapp.model.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {

    // Seller User Story 3: "I can see all my menu items." [cite: 147]
    // Finds all food items belonging to a specific canteen
    List<FoodItem> findBySeller_Id(Long sellerId);
}