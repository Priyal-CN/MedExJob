package com.medexjob.controller;

import com.medexjob.entity.User;
import com.medexjob.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> list(
            @RequestParam(value = "role", required = false) String role,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "sort", defaultValue = "createdAt,desc") String sort
    ) {
        String[] sortParts = sort.split(",");
        Sort.Direction dir = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("asc")) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sortParts[0]));

        Page<User> result = userRepository.findAll(pageable);
        List<User> filtered = result.getContent();

        if (role != null && !role.equalsIgnoreCase("all")) {
            try {
                User.UserRole r = User.UserRole.valueOf(role.toUpperCase());
                filtered = filtered.stream().filter(u -> u.getRole() == r).collect(Collectors.toList());
            } catch (IllegalArgumentException ignored) {}
        }
        if (status != null && !status.equalsIgnoreCase("all")) {
            if (status.equalsIgnoreCase("active")) {
                filtered = filtered.stream().filter(u -> Boolean.TRUE.equals(u.getIsActive())).collect(Collectors.toList());
            } else if (status.equalsIgnoreCase("suspended") || status.equalsIgnoreCase("inactive")) {
                filtered = filtered.stream().filter(u -> !Boolean.TRUE.equals(u.getIsActive())).collect(Collectors.toList());
            }
        }
        if (search != null && !search.isBlank()) {
            String s = search.trim().toLowerCase();
            filtered = filtered.stream().filter(u ->
                    (u.getName() != null && u.getName().toLowerCase().contains(s)) ||
                    (u.getEmail() != null && u.getEmail().toLowerCase().contains(s))
            ).collect(Collectors.toList());
        }

        Map<String, Object> body = new HashMap<>();
        body.put("content", filtered.stream().map(this::toResponse).collect(Collectors.toList()));
        body.put("page", result.getNumber());
        body.put("size", result.getSize());
        body.put("totalElements", result.getTotalElements());
        body.put("totalPages", result.getTotalPages());
        return ResponseEntity.ok(body);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> detail(@PathVariable("id") UUID id) {
        return userRepository.findById(id)
                .map(u -> ResponseEntity.ok(toResponse(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable("id") UUID id,
            @RequestParam("status") String status
    ) {
        return userRepository.findById(id)
                .map(u -> {
                    boolean active = status.equalsIgnoreCase("active");
                    u.setIsActive(active);
                    User saved = userRepository.save(u);
                    return ResponseEntity.ok(toResponse(saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private Map<String, Object> toResponse(User u) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", u.getId().toString());
        m.put("name", u.getName());
        m.put("email", u.getEmail());
        m.put("phone", u.getPhone());
        m.put("role", u.getRole() != null ? u.getRole().name().toLowerCase() : null);
        m.put("status", Boolean.TRUE.equals(u.getIsActive()) ? "active" : "suspended");
        m.put("createdDate", u.getCreatedAt() != null ? u.getCreatedAt().toLocalDate().toString() : null);
        // No lastLogin field in entity; return null
        m.put("lastLogin", (String) null);
        return m;
    }
}
