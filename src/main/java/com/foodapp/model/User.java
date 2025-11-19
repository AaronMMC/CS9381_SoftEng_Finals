package com.foodapp.model;

import com.foodapp.enums.UserRole;
import jakarta.persistence.*;

@Entity
@Table(name = "users") // Renaming table to 'users' (SQL doesn't like 'user')
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username; // Acts as Email/Username

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING) // Stores "SELLER" as text, not a number
    private UserRole role;

    // Connection to Seller Profile (One User has One Seller Profile)
    // "mappedBy" means the other file owns the relationship
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private SellerProfile sellerProfile;

    // --- Getters and Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

    public SellerProfile getSellerProfile() { return sellerProfile; }
    public void setSellerProfile(SellerProfile sellerProfile) { this.sellerProfile = sellerProfile; }
}