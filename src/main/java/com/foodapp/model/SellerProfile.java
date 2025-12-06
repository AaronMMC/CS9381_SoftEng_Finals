package com.foodapp.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "seller_profiles")
public class SellerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String canteenName;

    @Column(nullable = false)
    private boolean isApproved = false;

    // Use 'Boolean' (Wrapper) to safely handle potential database NULLs without crashing
    @Column(nullable = true)
    private Boolean isSuspended = false;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    // FIX: Allows 'username' to be sent to frontend, but blocks password and loops
    @JsonIgnoreProperties({"sellerProfile", "password", "role", "orders"})
    private User user;

    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("seller") // Prevents infinite loop on food items
    private List<FoodItem> menuItems = new ArrayList<>();

    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getCanteenName() {
        return canteenName;
    }
    public void setCanteenName(String canteenName) {
        this.canteenName = canteenName;
    }

    public boolean isApproved() {
        return isApproved;
    }
    public void setApproved(boolean approved) {
        isApproved = approved;
    }

    // --- SAFETY FIX FOR SUSPEND BUTTON ---
    public boolean isSuspended() {
        // If database value is NULL, return false instead of crashing the app
        return isSuspended != null && isSuspended;
    }

    public void setSuspended(boolean suspended) {
        this.isSuspended = suspended;
    }

    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }

    public List<FoodItem> getMenuItems() {
        return menuItems;
    }
    public void setMenuItems(List<FoodItem> menuItems) {
        this.menuItems = menuItems;
    }
}