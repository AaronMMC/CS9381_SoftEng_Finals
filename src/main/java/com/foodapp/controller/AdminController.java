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
    public Map<String, String> approveSeller(@PathVariable("sellerId") Long sellerId) throws Exception {
        userService.approveSeller(sellerId);
        return Map.of("message", "Approved");
    }

    @DeleteMapping("/reject/{sellerId}")
    public Map<String, String> rejectSeller(@PathVariable("sellerId") Long sellerId) throws Exception {
        userService.rejectSeller(sellerId);
        return Map.of("message", "Rejected");
    }

    @PostMapping("/suspend/{sellerId}")
    public Map<String, String> suspendSeller(@PathVariable("sellerId") Long sellerId) throws Exception {
        userService.suspendSeller(sellerId);
        return Map.of("message", "Suspended");
    }

    @PostMapping("/reactivate/{sellerId}")
    public Map<String, String> reactivateSeller(@PathVariable("sellerId") Long sellerId) throws Exception {
        userService.reactivateSeller(sellerId);
        return Map.of("message", "Reactivated");
    }
}