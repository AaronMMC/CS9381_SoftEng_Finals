package com.foodapp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "seller_profiles")
public class SellerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String canteenName; // e.g., "Oval Canteen", "Jared's Burgers"

    @Column(nullable = false)
    private boolean isApproved = false; // Default is FALSE (Pending)

    // Connects back to the User table
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // --- Getters and Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCanteenName() { return canteenName; }
    public void setCanteenName(String canteenName) { this.canteenName = canteenName; }

    public boolean isApproved() { return isApproved; }
    public void setApproved(boolean approved) { isApproved = approved; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}