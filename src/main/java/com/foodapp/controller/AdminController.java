package com.foodapp.controller;

import com.foodapp.model.SellerProfile;
import com.foodapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserService userService;

    @GetMapping("/stats")
    public Map<String, Long> getDashboardStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("pendingCount", userService.countPendingSellers());
        stats.put("activeSellersCount", userService.countActiveSellers());
        return stats;
    }

    @GetMapping("/pending-sellers")
    public List<SellerProfile> getPendingSellers() {
        return userService.getPendingSellers();
    }

    @PostMapping("/approve/{sellerId}")
    public String approveSeller(@PathVariable Long sellerId) {
        try {
            userService.approveSeller(sellerId);
            return "Approved";
        } catch (Exception e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/reject/{sellerId}")
    public String rejectSeller(@PathVariable Long sellerId) {
        try {
            userService.rejectSeller(sellerId);
            return "Rejected";
        } catch (Exception e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    @GetMapping("/activities")
    public List<com.foodapp.model.ActivityLog> getRecentActivities() {
        return userService.getRecentActivities();
    }

    @GetMapping("/approved-sellers")
    public List<SellerProfile> getApprovedSellers() {
        return userService.getApprovedSellers();
    }

    @GetMapping("/all-sellers")
    public List<SellerProfile> getAllSellers() {
        return userService.getAllSellers();
    }
}