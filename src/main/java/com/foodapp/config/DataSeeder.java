package com.foodapp.config;

import com.foodapp.enums.UserRole;
import com.foodapp.model.FoodItem;
import com.foodapp.model.SellerProfile;
import com.foodapp.model.User;
import com.foodapp.repository.FoodItemRepository;
import com.foodapp.repository.SellerRepository;
import com.foodapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder; // Import this
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            System.out.println("Database already seeded. Skipping...");
            return;
        }

        System.out.println("Seeding database with test data...");

        // 1. Create an Admin
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123")); // HASH THIS
        admin.setRole(UserRole.ADMIN);
        userRepository.save(admin);

        // 2. Create a Customer
        User customer = new User();
        customer.setUsername("student");
        customer.setPassword(passwordEncoder.encode("student123")); // HASH THIS
        customer.setRole(UserRole.CUSTOMER);
        userRepository.save(customer);

        // 3. Create a Seller (Approved)
        User sellerUser = new User();
        sellerUser.setUsername("seller");
        sellerUser.setPassword(passwordEncoder.encode("seller123")); // HASH THIS
        sellerUser.setRole(UserRole.SELLER);

        SellerProfile profile = new SellerProfile();
        profile.setCanteenName("Oval Canteen");
        profile.setApproved(true);
        profile.setUser(sellerUser);
        sellerUser.setSellerProfile(profile);

        userRepository.save(sellerUser);

        // 4. Add Menu Items
        SellerProfile savedProfile = sellerRepository.findByUserId(sellerUser.getId()).get();

        FoodItem item1 = new FoodItem();
        item1.setName("Sisig with Rice");
        item1.setPrice(95.00);
        item1.setDescription("Spicy pork sisig with egg");
        item1.setImageUrl("/user/img/Sisig.webp");
        item1.setAvailable(true);
        item1.setSeller(savedProfile);

        FoodItem item2 = new FoodItem();
        item2.setName("Fried Chicken");
        item2.setPrice(85.00);
        item2.setDescription("Crispy golden chicken");
        item2.setImageUrl("/user/img/Chicken.jpg");
        item2.setAvailable(true);
        item2.setSeller(savedProfile);

        FoodItem item3 = new FoodItem();
        item3.setName("Sold Out Burger");
        item3.setPrice(120.00);
        item3.setDescription("This item is not available");
        item3.setImageUrl("/user/img/placeholder.png");
        item3.setAvailable(false);
        item3.setSeller(savedProfile);

        foodItemRepository.saveAll(Arrays.asList(item1, item2, item3));

        System.out.println("Database Seeding Complete!");
        System.out.println("You can login as: admin/admin123, student/student123, seller/seller123");
    }
}