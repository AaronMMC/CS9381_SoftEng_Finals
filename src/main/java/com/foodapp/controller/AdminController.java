package com.foodapp.controller;

import com.foodapp.model.ActivityLog;
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

    // --- DASHBOARD STATS ---
    @GetMapping("/stats")
    public Map<String, Long> getDashboardStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("pendingCount", userService.countPendingSellers());
        stats.put("activeSellersCount", userService.countActiveSellers());
        return stats;
    }

    // --- ACTIVITY LOGS ---
    @GetMapping("/activities")
    public List<ActivityLog> getRecentActivities() {
        return userService.getRecentActivities();
    }

    // --- LISTS FOR TABS ---
    @GetMapping("/pending-sellers")
    public List<SellerProfile> getPendingSellers() {
        return userService.getPendingSellers();
    }

    @GetMapping("/approved-sellers")
    public List<SellerProfile> getApprovedSellers() {
        return userService.getApprovedSellers();
    }

    @GetMapping("/all-sellers")
    public List<SellerProfile> getAllSellers() {
        return userService.getAllSellers();
    }

    // --- ACTIONS ---

    @PostMapping("/approve/{sellerId}")
    public String approveSeller(@PathVariable("sellerId") Long sellerId) {
        try {
            userService.approveSeller(sellerId);
            return "Approved";
        } catch (Exception e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/reject/{sellerId}")
    public String rejectSeller(@PathVariable("sellerId") Long sellerId) {
        try {
            userService.rejectSeller(sellerId);
            return "Rejected";
        } catch (Exception e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    @PostMapping("/suspend/{sellerId}")
    public String suspendSeller(@PathVariable("sellerId") Long sellerId) {
        try {
            userService.suspendSeller(sellerId);
            return "Suspended";
        } catch (Exception e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    @PostMapping("/reactivate/{sellerId}")
    public String reactivateSeller(@PathVariable("sellerId") Long sellerId) {
        try {
            userService.reactivateSeller(sellerId);
            return "Reactivated";
        } catch (Exception e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }
}