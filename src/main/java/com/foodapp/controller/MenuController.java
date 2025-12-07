package com.foodapp.controller;

import com.foodapp.model.FoodItem;
import com.foodapp.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "*")
public class MenuController {

    @Autowired
    private MenuService menuService;

    /**
     * Seller User Story 2: Add Food Item
     * Endpoint: POST /api/menu/add
     */
    @PostMapping("/add")
    public FoodItem addFoodItem(@RequestBody FoodRequest request) {
        try {
            // FIXED: Now passing 5 arguments (including imageUrl)
            return menuService.addFoodItem(
                    request.sellerId,
                    request.name,
                    request.price,
                    request.description,
                    request.imageUrl // <--- Added this line
            );
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    /**
     * Seller User Story 5: Toggle Availability (Sold Out Switch)
     */
    @PostMapping("/{foodId}/toggle-availability")
    public FoodItem toggleAvailability(@PathVariable Long foodId) {
        try {
            return menuService.toggleAvailability(foodId);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    /**
     * User Story 2: View a Seller's Menu
     */
    @GetMapping("/seller/{sellerId}")
    public List<FoodItem> getMenu(@PathVariable Long sellerId) {
        return menuService.getMenuBySeller(sellerId);
    }

    /**
     * Seller User Story 3: Update a Food Item
     */
    @PutMapping("/{foodId}")
    public FoodItem updateFoodItem(@PathVariable Long foodId, @RequestBody UpdateRequest request) {
        try {
            return menuService.updateFoodItem(foodId, request.name, request.price, request.description);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    /**
     * Seller: Delete a Food Item
     */
    @DeleteMapping("/{foodId}")
    public void deleteFoodItem(@PathVariable Long foodId) {
        menuService.removeFoodItem(foodId);
    }

    // --- Helper DTOs ---

    public static class FoodRequest {
        public Long sellerId;
        public String name;
        public Double price;
        public String description;
        // FIXED: Added this field so the Controller can receive the image URL
        public String imageUrl;
    }

    public static class UpdateRequest {
        public String name;
        public Double price;
        public String description;
    }
}