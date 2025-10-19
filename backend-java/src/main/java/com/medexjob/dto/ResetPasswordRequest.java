package com.medexjob.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ResetPasswordRequest {

    @NotBlank(message = "Token is required")
    private String token;

    @NotBlank(message = "New password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String newPassword;

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public String getNewPassword() {
        return newPassword;
    }
}