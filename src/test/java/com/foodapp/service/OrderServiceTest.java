package com.foodapp.service;

import com.foodapp.enums.OrderStatus;
import com.foodapp.model.*;
import com.foodapp.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) // Tells JUnit to enable Mockito
class OrderServiceTest {

    // @Mock = Create a "Fake" version of this class (doesn't talk to DB)
    @Mock private OrderRepository orderRepository;
    @Mock private FoodItemRepository foodItemRepository;
    @Mock private UserRepository userRepository;
    @Mock private SellerRepository sellerRepository;

    // @InjectMocks = Inject the fake repositories into the real Service
    @InjectMocks
    private OrderService orderService;

    @Test
    void shouldCalculateTotalCorrectly() throws Exception {
        // 1. ARRANGE (Setup the fake data)
        User customer = new User(); customer.setId(1L);
        SellerProfile seller = new SellerProfile(); seller.setId(2L);

        FoodItem burger = new FoodItem();
        burger.setId(101L);
        burger.setName("Burger");
        burger.setPrice(100.00);
        burger.setAvailable(true);

        FoodItem fries = new FoodItem();
        fries.setId(102L);
        fries.setName("Fries");
        fries.setPrice(50.00);
        fries.setAvailable(true);

        // Teach the mocks what to do when called
        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(sellerRepository.findById(2L)).thenReturn(Optional.of(seller));
        when(foodItemRepository.findById(101L)).thenReturn(Optional.of(burger));
        when(foodItemRepository.findById(102L)).thenReturn(Optional.of(fries));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArguments()[0]);

        // 2. ACT (Run the logic)
        // User buys: 2 Burgers (200) + 1 Fries (50) = 250 Total
        Map<Long, Integer> items = Map.of(101L, 2, 102L, 1);
        Order result = orderService.placeOrder(1L, 2L, items);

        // 3. ASSERT (Verify the result)
        assertEquals(250.00, result.getTotalPrice(), "Total price should be 250.00");
        assertEquals(OrderStatus.PENDING, result.getStatus(), "Status should start as PENDING");
    }

    @Test
    void shouldPreventCancellationIfInProgress() {
        // 1. ARRANGE
        Order cookingOrder = new Order();
        cookingOrder.setId(5L);
        cookingOrder.setStatus(OrderStatus.IN_PROGRESS); // Status is NOT Pending

        when(orderRepository.findById(5L)).thenReturn(Optional.of(cookingOrder));

        // 2. ACT & ASSERT
        // We expect an Exception because you can't cancel an "In Progress" order
        Exception exception = assertThrows(Exception.class, () -> {
            orderService.cancelOrder(5L);
        });

        assertEquals("Cannot cancel order. The seller is already preparing it.", exception.getMessage());
    }
}