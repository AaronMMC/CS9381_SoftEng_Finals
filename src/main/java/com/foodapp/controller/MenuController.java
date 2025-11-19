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
     * Body: { "sellerId": 1, "name": "Sisig", "price": 150.0, "description": "Spicy" }
     */
    @PostMapping("/add")
    public FoodItem addFoodItem(@RequestBody FoodRequest request) {
        try {
            return menuService.addFoodItem(
                    request.sellerId,
                    request.name,
                    request.price,
                    request.description
            );
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    /**
     * Seller User Story 5: Toggle Availability (Sold Out Switch)
     * Endpoint: POST /api/menu/{foodId}/toggle-availability
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
     * Endpoint: GET /api/menu/seller/{sellerId}
     */
    @GetMapping("/seller/{sellerId}")
    public List<FoodItem> getMenu(@PathVariable Long sellerId) {
        return menuService.getMenuBySeller(sellerId);
    }

    // Helper DTO for JSON input
    public static class FoodRequest {
        public Long sellerId;
        public String name;
        public Double price;
        public String description;
    }
}