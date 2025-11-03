package com.medexjob.controller;

import com.medexjob.entity.Employer;
import com.medexjob.entity.User;
import com.medexjob.repository.EmployerRepository;
import com.medexjob.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.Optional;

@RestController
@RequestMapping("/api/employers")
@CrossOrigin(origins = "http://localhost:3000")
public class EmployerController {

    private final EmployerRepository employerRepository;
    private final UserRepository userRepository;
    private final Path uploadPath = Paths.get("uploads/verification");
    
    @PersistenceContext
    private EntityManager entityManager;

    public EmployerController(EmployerRepository employerRepository, UserRepository userRepository) {
        this.employerRepository = employerRepository;
        this.userRepository = userRepository;
        try {
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create verification upload directory", e);
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getEmployers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String verificationStatus,
            @RequestParam(required = false) String search
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Employer> employerPage;
        if (verificationStatus != null) {
            Employer.VerificationStatus status = Employer.VerificationStatus.valueOf(verificationStatus.toUpperCase());
            employerPage = employerRepository.findAllWithUserByVerificationStatus(status, pageable);
        } else {
            employerPage = employerRepository.findAllWithUser(pageable);
        }

        List<Map<String, Object>> employers = employerPage.getContent().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("employers", employers);
        response.put("totalElements", employerPage.getTotalElements());
        response.put("totalPages", employerPage.getTotalPages());
        response.put("currentPage", page);
        response.put("size", size);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployer(@PathVariable UUID id) {
        return employerRepository.findById(id)
                .map(employer -> ResponseEntity.ok(toResponse(employer)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/verification-requests")
    public ResponseEntity<Map<String, Object>> getVerificationRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        try {
            System.out.println("Fetching verification requests...");
            
            // Get all employers for now to see what we have
            List<Employer> allEmployers = employerRepository.findAll();
            System.out.println("Total employers found: " + allEmployers.size());
            
            // Filter for pending verification or those with KYC data
            List<Employer> pendingEmployers = allEmployers.stream()
                .filter(emp -> {
                    try {
                        return emp.getVerificationStatus() == Employer.VerificationStatus.PENDING || 
                               (emp.getAadhaarNumber() != null && emp.getPanNumber() != null);
                    } catch (Exception e) {
                        System.err.println("Error filtering employer: " + e.getMessage());
                        return false;
                    }
                })
                .collect(Collectors.toList());

            System.out.println("Pending employers found: " + pendingEmployers.size());

            List<Map<String, Object>> requests = pendingEmployers.stream()
                    .map(emp -> {
                        try {
                            return toVerificationRequestResponse(emp);
                        } catch (Exception e) {
                            System.err.println("Error converting employer to response: " + e.getMessage());
                            e.printStackTrace();
                            return null;
                        }
                    })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("requests", requests);
            response.put("totalElements", (long) requests.size());
            response.put("totalPages", 1);
            response.put("currentPage", page);
            response.put("size", size);

            System.out.println("Returning " + requests.size() + " verification requests");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error in getVerificationRequests: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch verification requests: " + e.getMessage());
            errorResponse.put("requests", new ArrayList<>());
            errorResponse.put("totalElements", 0L);
            errorResponse.put("totalPages", 0);
            errorResponse.put("currentPage", page);
            errorResponse.put("size", size);
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/verification-requests/pending-count")
    public ResponseEntity<Map<String, Object>> getPendingVerificationCount() {
        // Count employers with pending verification or KYC data
        List<Employer> allEmployers = employerRepository.findAll();
        long count = allEmployers.stream()
            .filter(emp -> emp.getVerificationStatus() == Employer.VerificationStatus.PENDING || 
                          (emp.getAadhaarNumber() != null && emp.getPanNumber() != null))
            .count();
        
        Map<String, Object> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/verification")
    @Transactional
    public ResponseEntity<?> updateVerificationStatus(
            @PathVariable UUID id,
            @RequestParam String status,
            @RequestParam(required = false) String notes
    ) {
        try {
            // Fetch employer with user eagerly loaded using JOIN FETCH
            Employer employer = entityManager.createQuery(
                "SELECT e FROM Employer e LEFT JOIN FETCH e.user WHERE e.id = :id", 
                Employer.class
            ).setParameter("id", id).getSingleResult();
            
            if (employer == null) {
                return ResponseEntity.notFound().build();
            }
            
            try {
                Employer.VerificationStatus verificationStatus = Employer.VerificationStatus.valueOf(status.toUpperCase());
                employer.setVerificationStatus(verificationStatus);

                if (verificationStatus == Employer.VerificationStatus.APPROVED) {
                    employer.setIsVerified(true);
                    employer.setVerifiedAt(LocalDateTime.now());
                    
                    // Also update the associated User record if it exists
                    try {
                        // Access user within transaction to avoid lazy loading issues
                        User user = employer.getUser();
                        if (user != null) {
                            user.setIsVerified(true);
                            user.setIsActive(true);
                            userRepository.save(user);
                        } else {
                            // Try to find user by email from verification notes
                            String email = extractEmailFromNotes(employer.getVerificationNotes());
                            if (email != null) {
                                userRepository.findByEmail(email).ifPresent(u -> {
                                    u.setIsVerified(true);
                                    u.setIsActive(true);
                                    userRepository.save(u);
                                });
                            }
                        }
                    } catch (Exception e) {
                        System.err.println("Warning: Could not update User record: " + e.getMessage());
                        e.printStackTrace();
                    }
                } else if (verificationStatus == Employer.VerificationStatus.REJECTED) {
                    employer.setIsVerified(false);
                    
                    // Also update the associated User record if it exists
                    try {
                        User user = employer.getUser();
                        if (user != null) {
                            user.setIsVerified(false);
                            user.setIsActive(false);
                            userRepository.save(user);
                        } else {
                            // Try to find user by email from verification notes
                            String email = extractEmailFromNotes(employer.getVerificationNotes());
                            if (email != null) {
                                userRepository.findByEmail(email).ifPresent(u -> {
                                    u.setIsVerified(false);
                                    u.setIsActive(false);
                                    userRepository.save(u);
                                });
                            }
                        }
                    } catch (Exception e) {
                        System.err.println("Warning: Could not update User record: " + e.getMessage());
                        e.printStackTrace();
                    }
                }

                if (notes != null) {
                    employer.setVerificationNotes(notes);
                }

                Employer saved = employerRepository.save(employer);
                return ResponseEntity.ok(toResponse(saved));
            } catch (Exception e) {
                System.err.println("Error updating employer: " + e.getMessage());
                e.printStackTrace();
                return ResponseEntity.status(500).body("Error updating employer: " + e.getMessage());
            }
        } catch (jakarta.persistence.NoResultException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Error in updateVerificationStatus: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error in updateVerificationStatus: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/kyc")
    public ResponseEntity<Map<String, Object>> submitEmployerKYC(
            @PathVariable UUID id,
            @RequestBody Map<String, String> kycData
    ) {
        return employerRepository.findById(id)
                .map(employer -> {
                    // Store KYC data in employer entity
                    employer.setAadhaarNumber(kycData.get("aadhaarNumber"));
                    employer.setPanNumber(kycData.get("panNumber"));
                    employer.setVerificationStatus(Employer.VerificationStatus.PENDING);
                    employer.setIsVerified(false);
                    
                    Employer saved = employerRepository.save(employer);
                    
                    Map<String, Object> response = new HashMap<>();
                    response.put("message", "KYC submitted successfully");
                    response.put("employerId", saved.getId().toString());
                    response.put("status", "pending");
                    return ResponseEntity.ok(response);
                })
                .orElse(buildNotFoundResponseForMap());
    }

    @PostMapping("/kyc-submission")
    public ResponseEntity<Map<String, Object>> submitKYCWithoutAuth(
            @RequestBody Map<String, String> kycData
    ) {
        try {
            // Extract KYC data
            String email = kycData.get("email");
            String name = kycData.get("name");
            String companyName = kycData.get("companyName");
            String aadhaarNumber = kycData.get("aadhaarNumber");
            String panNumber = kycData.get("panNumber");
            
            if (email == null || aadhaarNumber == null || panNumber == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Email, Aadhaar number, and PAN number are required");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Create a simple employer record with REAL DATA - NO USER RELATIONSHIP TO AVOID LAZY LOADING
            Employer employer = new Employer();
            employer.setCompanyName(companyName != null ? companyName : "Pending Verification - " + email);
            employer.setCompanyType(Employer.CompanyType.HR);
            employer.setAadhaarNumber(aadhaarNumber);
            employer.setPanNumber(panNumber);
            employer.setVerificationStatus(Employer.VerificationStatus.PENDING);
            employer.setIsVerified(false);
            employer.setVerificationNotes("Submitted by: " + email + (name != null ? " (" + name + ")" : ""));
            
            Employer saved = employerRepository.save(employer);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "KYC details submitted successfully! Admin will verify within 24 hours.");
            response.put("employerId", saved.getId().toString());
            response.put("status", "pending");
            response.put("employerEmail", email);
            response.put("submittedAt", java.time.LocalDateTime.now().toString());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to submit KYC: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @PostMapping("/{id}/documents")
    public ResponseEntity<Map<String, Object>> uploadVerificationDocument(
            @PathVariable UUID id,
            @RequestParam("document") MultipartFile document,
            @RequestParam("type") String type
    ) {
        return employerRepository.findById(id)
                .map(employer -> {
                    try {
                        // Create type-specific filename
                        String fileName = id + "_" + type + "_" + System.currentTimeMillis() + "_" + document.getOriginalFilename();
                        Path filePath = uploadPath.resolve(fileName);
                        Files.copy(document.getInputStream(), filePath);

                        // Store document URL in employer entity
                        String documentUrl = "/api/employers/documents/" + fileName;
                        if ("aadhaar".equals(type)) {
                            employer.setAadhaarDocumentUrl(documentUrl);
                        } else if ("pan".equals(type)) {
                            employer.setPanDocumentUrl(documentUrl);
                        }
                        employerRepository.save(employer);

                        Map<String, Object> response = new HashMap<>();
                        response.put("message", "Document uploaded successfully");
                        response.put("fileName", fileName);
                        response.put("documentUrl", documentUrl);
                        response.put("type", type);
                        return ResponseEntity.ok(response);
                    } catch (IOException e) {
                        Map<String, Object> errorResponse = new HashMap<>();
                        errorResponse.put("error", "File upload failed");
                        errorResponse.put("details", e.getMessage());
                        return ResponseEntity.internalServerError().body(errorResponse);
                    }
                })
                .orElse(buildNotFoundResponseForMap());
    }

    @GetMapping("/documents/{fileName}")
    public ResponseEntity<Resource> getDocument(@PathVariable String fileName) {
        try {
            Path filePath = uploadPath.resolve(fileName);
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    private Map<String, Object> toResponse(Employer employer) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", employer.getId().toString());
        
        if (employer.getUser() != null) {
            m.put("userId", employer.getUser().getId().toString());
            m.put("userName", employer.getUser().getName());
            m.put("userEmail", employer.getUser().getEmail());
        } else {
            m.put("userId", null);
            m.put("userName", "KYC Submitter");
            m.put("userEmail", "Unknown");
        }
        m.put("companyName", employer.getCompanyName());
        m.put("companyType", employer.getCompanyType().name().toLowerCase());
        m.put("companyDescription", employer.getCompanyDescription());
        m.put("website", employer.getWebsite());
        m.put("address", employer.getAddress());
        m.put("city", employer.getCity());
        m.put("state", employer.getState());
        m.put("pincode", employer.getPincode());
        m.put("aadhaarNumber", employer.getAadhaarNumber());
        m.put("panNumber", employer.getPanNumber());
        m.put("aadhaarDocumentUrl", employer.getAadhaarDocumentUrl());
        m.put("panDocumentUrl", employer.getPanDocumentUrl());
        m.put("isVerified", employer.getIsVerified());
        m.put("verificationStatus", employer.getVerificationStatus().name().toLowerCase());
        m.put("verificationNotes", employer.getVerificationNotes());
        m.put("verifiedAt", employer.getVerifiedAt() != null ? employer.getVerifiedAt().toString() : null);
        m.put("createdAt", employer.getCreatedAt() != null ? employer.getCreatedAt().toString() : null);
        m.put("updatedAt", employer.getUpdatedAt() != null ? employer.getUpdatedAt().toString() : null);
        return m;
    }

    private Map<String, Object> toVerificationRequestResponse(Employer employer) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", employer.getId().toString());
        m.put("employerId", employer.getId().toString());
        
        // Handle case where user might be null (for KYC submissions without user relationship)
        if (employer.getUser() != null) {
            m.put("employerName", employer.getUser().getName());
            m.put("email", employer.getUser().getEmail());
        } else {
            // For KYC submissions without user, extract real data from verification notes
            String email = "Unknown";
            String name = "KYC Submitter";
            
            if (employer.getVerificationNotes() != null && employer.getVerificationNotes().startsWith("Submitted by: ")) {
                String notes = employer.getVerificationNotes();
                email = notes.substring("Submitted by: ".length());
                
                // Extract name from notes if available (format: "Submitted by: email (name)")
                if (notes.contains(" (")) {
                    int start = notes.indexOf(" (") + 2;
                    int end = notes.lastIndexOf(")");
                    if (end > start) {
                        name = notes.substring(start, end);
                    }
                }
            }
            
            m.put("employerName", name);
            m.put("email", email);
        }
        
        m.put("companyName", employer.getCompanyName());
        m.put("aadhaarNumber", employer.getAadhaarNumber());
        m.put("panNumber", employer.getPanNumber());
        m.put("submittedAt", employer.getCreatedAt() != null ? employer.getCreatedAt().toString() : null);
        m.put("status", employer.getVerificationStatus().name().toLowerCase());
        
        // Include actual document URLs
        Map<String, String> documents = new HashMap<>();
        if (employer.getAadhaarDocumentUrl() != null) {
            documents.put("aadhaarUrl", employer.getAadhaarDocumentUrl());
        }
        if (employer.getPanDocumentUrl() != null) {
            documents.put("panUrl", employer.getPanDocumentUrl());
        }
        m.put("documents", documents);
        return m;
    }
    
    /**
     * Helper method to return a 404 NOT FOUND response with the required Map<String, Object> body type.
     */
    private ResponseEntity<Map<String, Object>> buildNotFoundResponseForMap() {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Employer not found");
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }
    
    private String extractEmailFromNotes(String notes) {
        if (notes == null) return null;
        if (notes.startsWith("Submitted by: ")) {
            String email = notes.substring("Submitted by: ".length());
            if (email.contains(" (")) {
                email = email.substring(0, email.indexOf(" ("));
            }
            return email;
        }
        return null;
    }
}