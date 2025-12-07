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
    public FoodItem addFoodItem(@RequestBody FoodRequest request) throws Exception {
        return menuService.addFoodItem(
                request.sellerId,
                request.name,
                request.price,
                request.description,
                request.imageUrl
        );
    }

    /**
     * Seller User Story 5: Toggle Availability (Sold Out Switch)
     */
    @PostMapping("/{foodId}/toggle-availability")
    public FoodItem toggleAvailability(@PathVariable Long foodId) throws Exception {
        return menuService.toggleAvailability(foodId);
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
    public FoodItem updateFoodItem(@PathVariable Long foodId, @RequestBody UpdateRequest request) throws Exception {
        return menuService.updateFoodItem(
                foodId,
                request.name,
                request.price,
                request.description,
                request.imageUrl
        );
    }
    /**
     * Seller: Delete a Food Item
     */
    @DeleteMapping("/{foodId}")
    public void deleteFoodItem(@PathVariable Long foodId) {
        menuService.removeFoodItem(foodId);
    }

    /**
     * Endpoint to fetch a single item's details for the Edit form.
     */
    @GetMapping("/{foodId}")
    public FoodItem getFoodItem(@PathVariable Long foodId) throws Exception {
        return menuService.getFoodItem(foodId);
    }

    // --- Helper DTOs ---

    public static class FoodRequest {
        public Long sellerId;
        public String name;
        public Double price;
        public String description;
        public String imageUrl;
    }

    public static class UpdateRequest {
        public String name;
        public Double price;
        public String description;
        public String imageUrl;
    }
}