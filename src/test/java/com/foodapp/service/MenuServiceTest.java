package com.foodapp.service;

import com.foodapp.model.FoodItem;
import com.foodapp.model.SellerProfile;
import com.foodapp.repository.FoodItemRepository;
import com.foodapp.repository.SellerRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MenuServiceTest {

    @Mock private FoodItemRepository foodItemRepository;
    @Mock private SellerRepository sellerRepository;

    @InjectMocks
    private MenuService menuService;

    @Test
    void addFoodItem_ShouldBeAvailableByDefault() throws Exception {
        // ARRANGE
        SellerProfile seller = new SellerProfile();
        seller.setId(1L);
        when(sellerRepository.findById(1L)).thenReturn(Optional.of(seller));
        when(foodItemRepository.save(any(FoodItem.class))).thenAnswer(i -> i.getArguments()[0]);

        // ACT
        FoodItem result = menuService.addFoodItem(1L, "Sisig", 100.00, "Spicy", "sisig.jpg");

        // ASSERT
        assertTrue(result.isAvailable(), "New items should be Available by default");
        assertEquals("Sisig", result.getName());
    }

    @Test
    void toggleAvailability_ShouldFlipTrueToFalse() throws Exception {
        // ARRANGE: Create an item that is currently AVAILABLE
        FoodItem item = new FoodItem();
        item.setId(50L);
        item.setAvailable(true);

        when(foodItemRepository.findById(50L)).thenReturn(Optional.of(item));
        when(foodItemRepository.save(any(FoodItem.class))).thenAnswer(i -> i.getArguments()[0]);

        // ACT: Seller clicks "Mark as Sold Out"
        FoodItem result = menuService.toggleAvailability(50L);

        // ASSERT: It should now be FALSE
        assertFalse(result.isAvailable());
    }

    @Test
    void toggleAvailability_ShouldFlipFalseToTrue() throws Exception {
        // ARRANGE: Create an item that is currently SOLD OUT
        FoodItem item = new FoodItem();
        item.setId(50L);
        item.setAvailable(false);

        when(foodItemRepository.findById(50L)).thenReturn(Optional.of(item));
        when(foodItemRepository.save(any(FoodItem.class))).thenAnswer(i -> i.getArguments()[0]);

        // ACT: Seller clicks "Mark as Available"
        FoodItem result = menuService.toggleAvailability(50L);

        // ASSERT: It should now be TRUE
        assertTrue(result.isAvailable());
    }
}