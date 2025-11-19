package com.foodapp.service;

import com.foodapp.enums.UserRole;
import com.foodapp.model.SellerProfile;
import com.foodapp.model.User;
import com.foodapp.repository.SellerRepository;
import com.foodapp.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private SellerRepository sellerRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void registerSeller_ShouldSetApprovedToFalse() {
        // ARRANGE: Teach the mock repo to return whatever user is passed to it
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        // ACT: Register a new seller
        User result = userService.registerSeller("new_canteen", "password123", "Oval Canteen");

        // ASSERT: Check System Constraint #3 (Seller Vetting Process)
        assertEquals(UserRole.SELLER, result.getRole());
        assertNotNull(result.getSellerProfile());
        assertFalse(result.getSellerProfile().isApproved(), "New sellers must be Pending by default");
    }

    @Test
    void login_ShouldBlockPendingSeller() {
        // ARRANGE: Create a seller who is NOT approved yet
        User pendingSeller = new User();
        pendingSeller.setUsername("seller");
        pendingSeller.setPassword("pass");
        pendingSeller.setRole(UserRole.SELLER);

        SellerProfile profile = new SellerProfile();
        profile.setApproved(false); // PENDING
        pendingSeller.setSellerProfile(profile);

        when(userRepository.findByUsername("seller")).thenReturn(Optional.of(pendingSeller));

        // ACT & ASSERT: Expect an exception when they try to login
        Exception exception = assertThrows(Exception.class, () -> {
            userService.login("seller", "pass");
        });

        assertEquals("Account is Pending Approval from Admin.", exception.getMessage());
    }

    @Test
    void approveSeller_ShouldFlipStatusToTrue() throws Exception {
        // ARRANGE: An existing pending seller
        SellerProfile profile = new SellerProfile();
        profile.setId(10L);
        profile.setApproved(false);

        when(sellerRepository.findById(10L)).thenReturn(Optional.of(profile));

        // ACT: Admin clicks "Approve"
        userService.approveSeller(10L);

        // ASSERT: Status should now be TRUE
        assertTrue(profile.isApproved());
        verify(sellerRepository).save(profile); // Ensure it was saved to DB
    }
}