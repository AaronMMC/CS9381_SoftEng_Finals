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

    @Transactional
    public Order placeOrder(Long customerId, Long sellerId, Map<Long, Integer> itemsMap, String deliveryLocation) throws Exception {

        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new Exception("Customer not found"));

        SellerProfile seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new Exception("Seller not found"));

        Order order = new Order();
        order.setCustomer(customer);
        order.setSeller(seller);
        order.setStatus(OrderStatus.PENDING);
        order.setDeliveryLocation(deliveryLocation); // <--- Saving location

        List<OrderItem> orderItems = new ArrayList<>();
        double calculatedTotal = 0.0;

        for (Map.Entry<Long, Integer> entry : itemsMap.entrySet()) {
            Long foodId = entry.getKey();
            Integer quantity = entry.getValue();

            if (quantity <= 0) {
                throw new Exception("Quantity must be at least 1");
            }

            FoodItem foodItem = foodItemRepository.findById(foodId)
                    .orElseThrow(() -> new Exception("Food item not found"));

            if (!foodItem.isAvailable()) {
                throw new Exception("Item " + foodItem.getName() + " is currently Sold Out.");
            }

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setFoodItem(foodItem);
            item.setQuantity(quantity);
            orderItems.add(item);

            calculatedTotal += (foodItem.getPrice() * quantity);
        }

        order.setOrderItems(orderItems);
        order.setTotalPrice(calculatedTotal);

        return orderRepository.save(order);
    }

    public void cancelOrder(Long orderId) throws Exception {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new Exception("Order not found"));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new Exception("Cannot cancel order. The seller is already preparing it.");
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    public void updateStatus(Long orderId, OrderStatus newStatus) throws Exception {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new Exception("Order not found"));
        order.setStatus(newStatus);
        orderRepository.save(order);
    }
}