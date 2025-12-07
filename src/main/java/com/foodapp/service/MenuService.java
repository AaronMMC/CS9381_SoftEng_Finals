package com.foodapp.service;

import com.foodapp.model.FoodItem;
import com.foodapp.model.SellerProfile;
import com.foodapp.repository.FoodItemRepository;
import com.foodapp.repository.SellerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuService {

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Autowired
    private SellerRepository sellerRepository;
    // Updated to accept 'imageUrl'
    public FoodItem addFoodItem(Long sellerId, String name, Double price, String description, String imageUrl) throws Exception {
        SellerProfile seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new Exception("Seller not found"));

        FoodItem newItem = new FoodItem();
        newItem.setName(name);
        newItem.setPrice(price);
        newItem.setDescription(description);

        // --- ADD THIS LINE ---
        newItem.setImageUrl(imageUrl);

        newItem.setAvailable(true);
        newItem.setSeller(seller);

        return foodItemRepository.save(newItem);
    }

    /**
     * Logic for "Seller User Story 3 & 4": Update menu & price.
     */
    public FoodItem updateFoodItem(Long foodId, String newName, Double newPrice, String newDesc) throws Exception {
        FoodItem item = foodItemRepository.findById(foodId)
                .orElseThrow(() -> new Exception("Food Item not found"));

        if (newName != null) item.setName(newName);
        if (newPrice != null) item.setPrice(newPrice);
        if (newDesc != null) item.setDescription(newDesc);

        return foodItemRepository.save(item);
    }

    /**
     * Logic for "Seller User Story 5": Toggle Availability.
     * This is the "Sold Out" switch.
     * If toggled to False, OrderService will block users from buying it.
     */
    public FoodItem toggleAvailability(Long foodId) throws Exception {
        FoodItem item = foodItemRepository.findById(foodId)
                .orElseThrow(() -> new Exception("Food Item not found"));

        // Flip the boolean (True -> False, or False -> True)
        item.setAvailable(!item.isAvailable());

        return foodItemRepository.save(item);
    }

    /**
     * Helper to view a specific Canteen's Menu.
     */
    public List<FoodItem> getMenuBySeller(Long sellerId) {
        return foodItemRepository.findBySellerId(sellerId);
    }

    /**
     * Delete an item (e.g. if they stop selling it entirely).
     */
    public void removeFoodItem(Long foodId) {
        foodItemRepository.deleteById(foodId);
    }
}