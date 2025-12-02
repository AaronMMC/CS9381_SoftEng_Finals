package com.foodapp.model;

import jakarta.persistence.*;
import java.util.List; // Import this!
import java.util.ArrayList;

@Entity
@Table(name = "seller_profiles")
public class SellerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String canteenName;

    @Column(nullable = false)
    private boolean isApproved = false;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FoodItem> menuItems = new ArrayList<>();

    // --- Getters and Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCanteenName() { return canteenName; }
    public void setCanteenName(String canteenName) { this.canteenName = canteenName; }

    public boolean isApproved() { return isApproved; }
    public void setApproved(boolean approved) { isApproved = approved; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    // Getter and Setter for the new list
    public List<FoodItem> getMenuItems() { return menuItems; }
    public void setMenuItems(List<FoodItem> menuItems) { this.menuItems = menuItems; }
}