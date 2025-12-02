package com.foodapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ActivityLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;
    private String type; // "SUCCESS", "DANGER", "INFO"
    private LocalDateTime timestamp;

    public ActivityLog() {}

    public ActivityLog(String message, String type) {
        this.message = message;
        this.type = type;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public String getMessage() { return message; }
    public String getType() { return type; }
    public LocalDateTime getTimestamp() { return timestamp; }
}