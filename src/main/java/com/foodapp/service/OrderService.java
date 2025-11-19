package com.foodapp.service;

import com.foodapp.enums.OrderStatus;
import com.foodapp.model.*;
import com.foodapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SellerRepository sellerRepository;

    /**
     * Logic for "User Story 3": Place an Order.
     * Calculates total price and strictly checks availability.
     * * @param customerId Who is buying?
     * @param sellerId Who are they buying from?
     * @param itemsMap Map of <FoodItemID, Quantity> (e.g., {1=2, 5=1} -> 2 Burgers, 1 Coke)
     */
    @Transactional // Ensures the Order and Items are saved together or not at all
    public Order placeOrder(Long customerId, Long sellerId, Map<Long, Integer> itemsMap) throws Exception {

        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new Exception("Customer not found"));

        SellerProfile seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new Exception("Seller not found"));

        Order order = new Order();
        order.setCustomer(customer);
        order.setSeller(seller);
        order.setStatus(OrderStatus.PENDING); // Default start state

        List<OrderItem> orderItems = new ArrayList<>();
        double calculatedTotal = 0.0;

        // Loop through the items the user wants
        for (Map.Entry<Long, Integer> entry : itemsMap.entrySet()) {
            Long foodId = entry.getKey();
            Integer quantity = entry.getValue();

            // Constraint 4: Quantity must be positive [cite: 138]
            if (quantity <= 0) {
                throw new Exception("Quantity must be at least 1");
            }

            FoodItem foodItem = foodItemRepository.findById(foodId)
                    .orElseThrow(() -> new Exception("Food item not found"));

            // Constraint 2: Check Availability
            // "An item marked as 'Sold Out' by a seller cannot be added."
            if (!foodItem.isAvailable()) {
                throw new Exception("Item " + foodItem.getName() + " is currently Sold Out.");
            }

            // Create the Line Item
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setFoodItem(foodItem);
            item.setQuantity(quantity);
            orderItems.add(item);

            // Add to Total Price
            calculatedTotal += (foodItem.getPrice() * quantity);
        }

        order.setOrderItems(orderItems);
        order.setTotalPrice(calculatedTotal);

        return orderRepository.save(order);
    }

    /**
     * Logic for "User Story 4": Cancel Order.
     * Enforces "System Constraint 1": Can only cancel if Pending[cite: 131].
     */
    public void cancelOrder(Long orderId) throws Exception {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new Exception("Order not found"));

        // Critical Check: Is it too late?
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new Exception("Cannot cancel order. The seller is already preparing it.");
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    /**
     * Logic for "Seller User Story 6": Update Status.
     * Moves order from PENDING -> IN_PROGRESS -> READY -> COMPLETED
     */
    public void updateStatus(Long orderId, OrderStatus newStatus) throws Exception {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new Exception("Order not found"));

        // In a real app, you might want checks here (e.g., can't go from CANCELLED to READY)
        order.setStatus(newStatus);
        orderRepository.save(order);
    }
}