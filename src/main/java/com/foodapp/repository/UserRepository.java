package com.foodapp.repository;

import com.foodapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Finds a user by their email/username for Login
    Optional<User> findByUsername(String username);
}