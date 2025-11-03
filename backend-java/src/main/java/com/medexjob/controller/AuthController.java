package com.medexjob.controller;

import com.medexjob.dto.AuthResponse;
import com.medexjob.dto.LoginRequest;
import com.medexjob.dto.AadhaarVerifyRequest;
import com.medexjob.dto.RegisterRequest; // Corrected import order
import com.medexjob.entity.User;
import com.medexjob.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Handles user registration requests.
     * @param registerRequest DTO containing registration details.
     * @return The newly created User object.
     */
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody RegisterRequest registerRequest) {
        User newUser = authService.register(registerRequest);
        return ResponseEntity.ok(newUser);
    }

    /**
     * Handles user login requests.
     * @param loginRequest DTO containing login credentials.
     * @return An AuthResponse containing the JWT and user details.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(@RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = authService.login(loginRequest);
        return ResponseEntity.ok(authResponse);
    }

    /**
     * Fetches the details of the currently authenticated user.
     * @return The User object for the authenticated user.
     */
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(currentUser);
    }

    /**
     * Handles Aadhaar verification requests.
     * @param verifyRequest DTO containing email, aadhaarNumber, and otp.
     * @return A success response.
     */
    @PostMapping("/verify-aadhaar")
    public ResponseEntity<?> verifyAadhaar(@RequestBody AadhaarVerifyRequest verifyRequest) {
        authService.verifyAadhaar(verifyRequest);
        return ResponseEntity.ok(Map.of("message", "Aadhaar verified successfully. Account activated."));
    }

    // You can add other endpoints here for password reset, email verification, etc.
    // For example:
    // @PostMapping("/forgot-password") ...
    // @GetMapping("/verify-email") ...
}