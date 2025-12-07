package com.foodapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "food_items")
public class FoodItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double price;

    private String description;

    @Column(columnDefinition = "LONGTEXT")
    private String imageUrl;

    // "Seller User Story 5": Seller can toggle Available / Sold Out
    @Column(nullable = false)
    private boolean isAvailable = true;

    // Link to the Seller who owns this item
    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    @JsonIgnore
    private SellerProfile seller;

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean available) { isAvailable = available; }

    public SellerProfile getSeller() { return seller; }
    public void setSeller(SellerProfile seller) { this.seller = seller; }

    public Long getSellerId() { return seller != null ? seller.getId() : null; }
    public String getSellerName() { return seller != null ? seller.getCanteenName() : null; }
}