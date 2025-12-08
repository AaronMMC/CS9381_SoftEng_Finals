package com.foodapp.controller;

import com.foodapp.model.User;
import com.foodapp.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    /**
     * User Story 7: Register Customer
     * Endpoint: POST /api/auth/register/customer
     */
    @PostMapping("/register/customer")
    public User registerCustomer(@RequestBody AuthRequest request) {
        return userService.registerCustomer(request.username, request.password, request.phoneNumber, request.campus);
    }

    /**
     * Seller User Story 1: Register Seller
     * Endpoint: POST /api/auth/register/seller
     * Note: This user will NOT be able to login until approved by Admin.
     */
    @PostMapping("/register/seller")
    public User registerSeller(@RequestBody SellerAuthRequest request) {
        return userService.registerSeller(
                request.username,
                request.password,
                request.canteenName,
                request.phoneNumber,
                request.campus
        );
    }

    /**
     * Login (For everyone)
     * Endpoint: POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) throws Exception {
        // GlobalExceptionHandler will catch "Invalid password" or "User not found"
        User user = userService.login(request.username, request.password);
        return ResponseEntity.ok(user);
    }

    // Helper DTOs
    public static class AuthRequest {
        public String username;
        public String password;
        public String phoneNumber;
        public String campus;
    }

    public static class SellerAuthRequest extends AuthRequest {
        public String canteenName;
    }
}