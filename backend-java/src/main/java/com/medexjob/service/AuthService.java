package com.medexjob.service;

import com.medexjob.dto.AadhaarVerifyRequest;
import com.medexjob.dto.LoginRequest;
import com.medexjob.dto.RegisterRequest;
import com.medexjob.dto.AuthResponse;
import com.medexjob.entity.User;
import com.medexjob.entity.Employer;
import com.medexjob.security.AuthException;
import com.medexjob.repository.UserRepository;
import com.medexjob.repository.EmployerRepository;
import com.medexjob.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployerRepository employerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private AuthenticationManager authenticationManager;

    // ---------------- Register ----------------
    public User register(RegisterRequest registerRequest) {
        // Validate role
        if (registerRequest.getRole() == null) {
            throw new AuthException("User role must be specified.");
        }
        // Check if email already exists (case-insensitive)
        if (userRepository.findByEmailIgnoreCase(registerRequest.getEmail()).isPresent()) {
            throw new AuthException("This email is already registered. Please login instead.");
        }
        // Create new user
        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPhone(registerRequest.getPhone());
        user.setRole(registerRequest.getRole());
        user.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));

        // Set user status based on role.
        // Employers must verify, so they start as inactive.
        // Candidates and Admins are activated immediately.
        if (registerRequest.getRole() == User.UserRole.EMPLOYER) {
            user.setIsActive(false);
            user.setIsVerified(false);
        } else {
            user.setIsActive(true);
            user.setIsVerified(true);
        }

        // Optional: keep email verification token for later
        user.setEmailVerificationToken(UUID.randomUUID().toString());

        // Save the user first
        User savedUser = userRepository.save(user);

        // If the user is an EMPLOYER, create a corresponding Employer record
        if (registerRequest.getRole() == User.UserRole.EMPLOYER) {
            Employer employer = new Employer();
            employer.setUser(savedUser);
            employer.setCompanyName(registerRequest.getName() + "'s Company");
            employer.setCompanyType(Employer.CompanyType.HR); // Default company type
            employer.setVerificationStatus(Employer.VerificationStatus.PENDING);
            employer.setIsVerified(false);
            employer.setVerificationNotes("Auto-created during registration");
            employerRepository.save(employer);
        }

        // TODO: Send email verification email (for production)
        return savedUser;
    }

    // ---------------- Login ----------------
    public AuthResponse login(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Find user by email first, then check status for more accurate error messages.
            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new AuthException("Invalid email or password"));

            if (!user.getIsVerified()) {
                // Only require Aadhaar verification for EMPLOYERs
                if (user.getRole() == User.UserRole.EMPLOYER) {
                    throw new AuthException("Please complete your Aadhaar verification before logging in.");
                }
            }
            if (!user.getIsActive()) {
                throw new AuthException("Your account is inactive. Please contact support.");
            }

            String token = jwtTokenProvider.generateToken(user.getEmail());

            return new AuthResponse(token, user);

        } catch (AuthenticationException e) {
            logger.warn("Authentication failed for user {}: {}", loginRequest.getEmail(), e.getMessage());
            throw new AuthException("Invalid email or password");
        }
    }

    // ---------------- Get Current User ----------------
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmailAndIsActiveTrue(email)
                .orElseThrow(() -> new AuthException("User not found"));
    }

    // ---------------- Aadhaar Verification ----------------
    public void verifyAadhaar(AadhaarVerifyRequest verifyRequest) {
        // For development, we'll use a mock OTP. In production, this would involve
        // calling a real Aadhaar verification service.
        final String MOCK_OTP = "4567";

        if (!MOCK_OTP.equals(verifyRequest.otp())) {
            throw new AuthException("Invalid OTP.");
        }

        // Find the user by email.
        User user = userRepository.findByEmail(verifyRequest.email())
                .orElseThrow(() -> new AuthException("User not found with email: " + verifyRequest.email()));

        // Activate the user's account.
        user.setIsVerified(true);
        user.setIsActive(true);
        // user.setAadhaarNumber(verifyRequest.aadhaarNumber()); // TODO: Uncomment this after adding 'aadhaarNumber' field to User entity

        userRepository.save(user);
    }

    // ---------------- Email Verification ----------------
    public boolean verifyEmail(String token) {
        User user = userRepository.findByEmailVerificationToken(token)
                .orElseThrow(() -> new AuthException("Invalid verification token"));

        user.setIsVerified(true);
        user.setEmailVerifiedAt(java.time.LocalDateTime.now());
        user.setEmailVerificationToken(null);

        userRepository.save(user);
        return true;
    }

    // ---------------- Forgot Password ----------------
    public void requestPasswordReset(String email) {
        User user = userRepository.findByEmailAndIsActiveTrue(email)
                .orElseThrow(() -> new AuthException("User not found"));

        String resetToken = UUID.randomUUID().toString();
        user.setPasswordResetToken(resetToken);
        user.setPasswordResetExpires(java.time.LocalDateTime.now().plusHours(1));

        userRepository.save(user);

        // TODO: Send password reset email
    }

    // ---------------- Reset Password ----------------
    public boolean resetPassword(String token, String newPassword) {
        User user = userRepository.findByPasswordResetToken(token)
                .orElseThrow(() -> new AuthException("Invalid reset token"));

        if (user.getPasswordResetExpires().isBefore(java.time.LocalDateTime.now())) {
            throw new AuthException("Reset token has expired");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setPasswordResetToken(null);
        user.setPasswordResetExpires(null);

        userRepository.save(user);
        return true;
    }
}
