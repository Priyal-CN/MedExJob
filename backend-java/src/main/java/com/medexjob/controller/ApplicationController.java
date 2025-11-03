package com.medexjob.controller;

import com.medexjob.entity.Application;
import com.medexjob.entity.Job;
import com.medexjob.entity.User;
import com.medexjob.repository.ApplicationRepository;
import com.medexjob.repository.JobRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.medexjob.repository.UserRepository; // Import UserRepository
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/applications")
// @CrossOrigin(origins = "http://localhost:3000") // Removed: Handled globally in WebSecurityConfig
public class ApplicationController {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository; // Inject UserRepository
    private final Path uploadPath = Paths.get("uploads");

    public ApplicationController(ApplicationRepository applicationRepository, JobRepository jobRepository, UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        try {
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    @GetMapping("/my")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> myApplications(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "sort", defaultValue = "appliedDate,desc") String sort
    ) {
        String[] sortParts = sort.split(",");
        Sort.Direction dir = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("asc")) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sortParts[0]));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = (auth != null && auth.isAuthenticated()) ? auth.getName() : null;
        if (email == null || email.isBlank()) {
            return ResponseEntity.status(401).build();
        }

        // Query by candidateEmail field directly with JOIN FETCH
        Page<Application> result = applicationRepository.findByCandidateEmail(email, pageable);

        Map<String, Object> body = new HashMap<>();
        body.put("content", result.getContent().stream().map(this::toResponse).collect(Collectors.toList()));
        body.put("page", result.getNumber());
        body.put("size", result.getSize());
        body.put("totalElements", result.getTotalElements());
        body.put("totalPages", result.getTotalPages());
        return ResponseEntity.ok(body);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> apply(
            @RequestParam("jobId") UUID jobId,
            @RequestParam(value = "candidateId", required = false) UUID candidateId,
            @RequestParam("candidateName") String candidateName,
            @RequestParam("candidateEmail") String candidateEmail,
            @RequestParam("candidatePhone") String candidatePhone,
            @RequestParam(value = "resume", required = false) MultipartFile resume,
            @RequestParam(value = "notes", required = false) String notes
    ) {
        return jobRepository.findById(jobId)
                .map(job -> {
                    // Manually check for candidateId and throw a clear error
                    if (candidateId == null) {
                        throw new IllegalArgumentException("candidateId is a required parameter.");
                    }

                    try {
                        Application application = new Application();
                        // Fetch the User by candidateId and link it
                        User candidate = userRepository.findById(candidateId)
                                .orElseThrow(() -> new RuntimeException("Candidate not found with ID: " + candidateId));
                        application.setCandidate(candidate); // Set the User object
                        application.setJob(job);
                        application.setCandidateName(candidateName);
                        application.setCandidateEmail(candidateEmail);
                        application.setCandidatePhone(candidatePhone);
                        application.setNotes(notes);
                        application.setStatus(Application.ApplicationStatus.APPLIED);

                        // Handle resume upload
                        if (resume != null && !resume.isEmpty()) {
                            String fileName = UUID.randomUUID() + "_" + resume.getOriginalFilename();
                            Path filePath = uploadPath.resolve(fileName);
                            Files.copy(resume.getInputStream(), filePath);
                            application.setResumeUrl("/uploads/" + fileName);
                        }

                        Application saved = applicationRepository.save(application);

                        // Update job applications count
                        job.setApplicationsCount(job.getApplicationsCount() + 1);
                        jobRepository.save(job);

                        Map<String, Object> response = new HashMap<>();
                        response.put("id", saved.getId().toString());
                        response.put("message", "Application submitted successfully!");
                        response.put("status", "success");
                        return ResponseEntity.ok(response);

                    } catch (IOException e) {
                        Map<String, Object> error = new HashMap<>();
                        error.put("message", "Failed to upload resume");
                        error.put("status", "error");
                        return ResponseEntity.internalServerError().body(error);
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> list(
            @RequestParam(value = "jobId", required = false) UUID jobId,
            @RequestParam(value = "candidateId", required = false) UUID candidateId,
            @RequestParam(value = "candidateEmail", required = false) String candidateEmail,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "sort", defaultValue = "appliedDate,desc") String sort
    ) {
        String[] sortParts = sort.split(",");
        Sort.Direction dir = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("asc")) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sortParts[0]));

        Page<Application> result;

        if (jobId != null) {
            if (status != null) {
                Application.ApplicationStatus appStatus = parseStatus(status);
                result = applicationRepository.findByJobIdAndStatusWithDetails(jobId, appStatus, pageable);
            } else {
                result = applicationRepository.findByJobIdWithDetails(jobId, pageable);
            }
        } else if (candidateEmail != null && !candidateEmail.isBlank()) {
            // Query by candidateEmail field directly with JOIN FETCH
            result = applicationRepository.findByCandidateEmail(candidateEmail, pageable);
        } else if (candidateId != null) { // Admin can filter by candidateId
            if (status != null) {
                Application.ApplicationStatus appStatus = parseStatus(status);
                result = applicationRepository.findByCandidateIdAndStatusWithDetails(candidateId, appStatus, pageable);
            } else {
                result = applicationRepository.findByCandidateIdWithDetails(candidateId, pageable);
            }
        } else if (status != null) {
            Application.ApplicationStatus appStatus = parseStatus(status);
            result = applicationRepository.findByStatusWithDetails(appStatus, pageable);
        } else if (search != null && !search.isBlank()) {
            result = applicationRepository.searchApplicationsWithDetails(search.trim(), pageable);
        } else {
            // Use the new method with JOIN FETCH for admin view
            result = applicationRepository.findAllWithDetails(pageable);
        }

        Map<String, Object> body = new HashMap<>();
        body.put("content", result.getContent().stream().map(this::toResponse).collect(Collectors.toList()));
        body.put("page", result.getNumber());
        body.put("size", result.getSize());
        body.put("totalElements", result.getTotalElements());
        body.put("totalPages", result.getTotalPages());
        return ResponseEntity.ok(body);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable("id") UUID id,
            @RequestBody Map<String, Object> request
    ) {
        return applicationRepository.findById(id)
                .map(application -> {
                    String statusStr = (String) request.get("status");
                    String notes = (String) request.get("notes");

                    if (statusStr != null) {
                        Application.ApplicationStatus newStatus = parseStatus(statusStr);
                        application.setStatus(newStatus);
                    }

                    if (notes != null) {
                        application.setNotes(notes);
                    }

                    // Handle interview date for interview status
                    if ("interview".equals(statusStr) && request.containsKey("interviewDate")) {
                        String interviewDateStr = (String) request.get("interviewDate");
                        try {
                            LocalDateTime interviewDate = LocalDateTime.parse(interviewDateStr);
                            application.setInterviewDate(interviewDate);
                        } catch (Exception e) {
                            // Handle parsing error
                        }
                    }

                    Application saved = applicationRepository.save(application);
                    return ResponseEntity.ok(toResponse(saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") UUID id) {
        if (!applicationRepository.existsById(id)) return ResponseEntity.notFound().build();
        applicationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private Application.ApplicationStatus parseStatus(String status) {
        if (status == null) return null;
        try {
            return Application.ApplicationStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            return Application.ApplicationStatus.APPLIED;
        }
    }

    private Map<String, Object> toResponse(Application app) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", app.getId().toString());
        m.put("jobId", app.getJob().getId().toString());
        m.put("jobTitle", app.getJob().getTitle());
        m.put("jobOrganization", app.getJob().getEmployer() != null ? app.getJob().getEmployer().getCompanyName() : "");
        m.put("candidateId", app.getCandidate() != null ? app.getCandidate().getId().toString() : null); // Get ID from User object
        m.put("candidateName", app.getCandidateName());
        m.put("candidateEmail", app.getCandidateEmail());
        m.put("candidatePhone", app.getCandidatePhone());
        m.put("resumeUrl", app.getResumeUrl());
        m.put("status", app.getStatus().name().toLowerCase());
        m.put("notes", app.getNotes());
        m.put("interviewDate", app.getInterviewDate() != null ? app.getInterviewDate().toString() : null);
        m.put("appliedDate", app.getAppliedDate() != null ? app.getAppliedDate().toString() : null);
        return m;
    }
}
