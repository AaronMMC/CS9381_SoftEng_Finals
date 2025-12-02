package com.foodapp.service;

import com.foodapp.enums.UserRole;
import com.foodapp.model.ActivityLog;
import com.foodapp.model.SellerProfile;
import com.foodapp.model.User;
import com.foodapp.repository.ActivityLogRepository;
import com.foodapp.repository.SellerRepository;
import com.foodapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private ActivityLogRepository activityLogRepository; // NEW: For Dashboard History

    private void logActivity(String message, String type) {
        activityLogRepository.save(new ActivityLog(message, type));
    }

    public User registerCustomer(String username, String password, String phoneNumber, String campus) {
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(password);
        newUser.setRole(UserRole.CUSTOMER);
        newUser.setPhoneNumber(phoneNumber);
        newUser.setCampus(campus);
        return userRepository.save(newUser);
    }

    public User registerSeller(String username, String password, String canteenName, String phoneNumber, String campus) {
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(password);
        newUser.setRole(UserRole.SELLER);
        newUser.setPhoneNumber(phoneNumber);
        newUser.setCampus(campus);

        SellerProfile profile = new SellerProfile();
        profile.setCanteenName(canteenName);
        profile.setApproved(false);
        profile.setUser(newUser);

        newUser.setSellerProfile(profile);

        User savedUser = userRepository.save(newUser);

        logActivity("New application received: " + canteenName, "INFO");

        return savedUser;
    }

    public User login(String username, String password) throws Exception {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new Exception("User not found"));

        if (!user.getPassword().equals(password)) {
            throw new Exception("Invalid password");
        }

        if (user.getRole() == UserRole.SELLER) {
            if (!user.getSellerProfile().isApproved()) {
                throw new Exception("Account is Pending Approval from Admin.");
            }
        }
        return user;
    }

    public User updateUserProfile(Long userId, String newPhone, String newCampus) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPhoneNumber(newPhone);
        user.setCampus(newCampus);
        return userRepository.save(user);
    }

    public void approveSeller(Long sellerProfileId) throws Exception {
        SellerProfile profile = sellerRepository.findById(sellerProfileId)
                .orElseThrow(() -> new Exception("Seller Profile not found"));

        profile.setApproved(true);
        sellerRepository.save(profile);

        logActivity("Approved seller: " + profile.getCanteenName(), "SUCCESS");
    }

    public void rejectSeller(Long sellerProfileId) throws Exception {
        SellerProfile profile = sellerRepository.findById(sellerProfileId)
                .orElseThrow(() -> new Exception("Profile not found"));

        String canteenName = profile.getCanteenName();

        userRepository.delete(profile.getUser());

        logActivity("Rejected application: " + canteenName, "DANGER");
    }

    public List<SellerProfile> getPendingSellers() {
        return sellerRepository.findByIsApprovedFalse();
    }

    public long countPendingSellers() {
        return sellerRepository.findByIsApprovedFalse().size();
    }

    public long countActiveSellers() {
        long total = sellerRepository.count();
        return total - countPendingSellers();
    }

    public List<ActivityLog> getRecentActivities() {
        return activityLogRepository.findTop10ByOrderByTimestampDesc();
    }

    public List<SellerProfile> getApprovedSellers() {
        return sellerRepository.findByIsApprovedTrue();
    }

    public List<SellerProfile> getAllSellers() {
        return sellerRepository.findAll();
    }
}