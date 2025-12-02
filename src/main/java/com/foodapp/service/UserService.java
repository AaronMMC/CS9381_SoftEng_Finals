package com.foodapp.service;

import com.foodapp.enums.UserRole;
import com.foodapp.model.SellerProfile;
import com.foodapp.model.User;
import com.foodapp.repository.SellerRepository;
import com.foodapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SellerRepository sellerRepository;

    /**
     * Logic for "User Story 7": User Registration.
     * Customers are active immediately.
     */
    public User registerCustomer(String username, String password, String phoneNumber, String campus) {
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(password); // In a real app, hash this password!
        newUser.setRole(UserRole.CUSTOMER);

        newUser.setPhoneNumber(phoneNumber);
        newUser.setCampus(campus);

        return userRepository.save(newUser);
    }

    /**
     * Logic for "Seller User Story 1": Seller Registration.
     * MUST create a SellerProfile and set isApproved = false.
     */
    public User registerSeller(String username, String password, String canteenName, String phoneNumber, String campus) { // Updated arguments
        // 1. Create the User account
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(password);
        newUser.setRole(UserRole.SELLER);

        // Save Contact Info for Sellers too
        newUser.setPhoneNumber(phoneNumber);
        newUser.setCampus(campus);

        // 2. Create the Profile (The "Application Form")
        SellerProfile profile = new SellerProfile();
        profile.setCanteenName(canteenName);
        profile.setApproved(false);
        profile.setUser(newUser);

        newUser.setSellerProfile(profile);

        return userRepository.save(newUser);
    }

    /**
     * Logic for Login.
     * Enforces "System Constraint 3": Sellers cannot log in if pending.
     */
    public User login(String username, String password) throws Exception {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new Exception("User not found"));

        if (!user.getPassword().equals(password)) {
            throw new Exception("Invalid password");
        }

        // CRITICAL CHECK: If it's a seller, are they approved?
        if (user.getRole() == UserRole.SELLER) {
            if (!user.getSellerProfile().isApproved()) {
                throw new Exception("Account is Pending Approval from Admin.");
            }
        }

        return user;
    }

    /**
     * Logic for "Admin User Story 2": Approve a seller.
     */
    public void approveSeller(Long sellerProfileId) throws Exception {
        SellerProfile profile = sellerRepository.findById(sellerProfileId)
                .orElseThrow(() -> new Exception("Seller Profile not found"));

        profile.setApproved(true); // Flip the switch
        sellerRepository.save(profile);
    }

    // Helper for Admin Dashboard to see the list
    public List<SellerProfile> getPendingSellers() {
        return sellerRepository.findByIsApprovedFalse();
    }

    public User updateUserProfile(Long userId, String newPhone, String newCampus) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPhoneNumber(newPhone);
        user.setCampus(newCampus);

        return userRepository.save(user);
    }
}