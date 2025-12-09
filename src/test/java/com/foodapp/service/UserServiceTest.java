package com.foodapp.service;

import com.foodapp.enums.UserRole;
import com.foodapp.model.ActivityLog;
import com.foodapp.model.SellerProfile;
import com.foodapp.model.User;
import com.foodapp.repository.ActivityLogRepository;
import com.foodapp.repository.SellerRepository;
import com.foodapp.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private SellerRepository sellerRepository;

    // --- ADDED THESE MISSING MOCKS ---
    @Mock private ActivityLogRepository activityLogRepository;
    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void registerSeller_ShouldSetApprovedToFalse() {
        // ARRANGE
        // Fix: Tell the mock password encoder to return "hashed_pass" when called
        when(passwordEncoder.encode(any())).thenReturn("hashed_pass");

        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        // ACT
        User result = userService.registerSeller("new_canteen", "password123", "Oval Canteen", "", "");

        // ASSERT
        assertEquals(UserRole.SELLER, result.getRole());
        assertNotNull(result.getSellerProfile());
        assertFalse(result.getSellerProfile().isApproved(), "New sellers must be Pending by default");
    }

    @Test
    void login_ShouldBlockPendingSeller() {
        // ARRANGE
        User pendingSeller = new User();
        pendingSeller.setUsername("seller");
        pendingSeller.setPassword("hashed_pass"); // Matches what is in DB
        pendingSeller.setRole(UserRole.SELLER);

        SellerProfile profile = new SellerProfile();
        profile.setApproved(false); // PENDING
        pendingSeller.setSellerProfile(profile);

        when(userRepository.findByUsername("seller")).thenReturn(Optional.of(pendingSeller));

        // Fix: Tell mock encoder that the password matches (return true)
        when(passwordEncoder.matches(any(), any())).thenReturn(true);

        // ACT & ASSERT
        Exception exception = assertThrows(Exception.class, () -> {
            userService.login("seller", "pass");
        });

        assertEquals("Account is Pending Approval from Admin.", exception.getMessage());
    }

    @Test
    void approveSeller_ShouldFlipStatusToTrue() throws Exception {
        // ARRANGE
        SellerProfile profile = new SellerProfile();
        profile.setId(10L);
        profile.setApproved(false);
        profile.setCanteenName("Test Canteen"); // Needed for log message

        when(sellerRepository.findById(10L)).thenReturn(Optional.of(profile));

        // ACT
        userService.approveSeller(10L);

        // ASSERT
        assertTrue(profile.isApproved());
        verify(sellerRepository).save(profile);
        // Verify activity log was saved
        verify(activityLogRepository).save(any(ActivityLog.class));
    }
}