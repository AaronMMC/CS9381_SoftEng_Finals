package com.foodapp.controller;

import com.foodapp.model.SellerProfile;
import com.foodapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    /**
     * Admin User Story 2: View Pending Sellers
     * Endpoint: GET /api/admin/pending-sellers
     * Returns a list of sellers where isApproved = false
     */
    @GetMapping("/pending-sellers")
    public List<SellerProfile> viewPendingSellers() {
        return userService.getPendingSellers();
    }

    /**
     * Admin User Story 2: Approve Seller
     * Endpoint: POST /api/admin/approve-seller/{sellerProfileId}
     * Action: Sets isApproved = true
     */
    @PostMapping("/approve-seller/{sellerProfileId}")
    public String approveSeller(@PathVariable Long sellerProfileId) {
        try {
            userService.approveSeller(sellerProfileId);
            return "Seller approved successfully. They can now log in.";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
}