package com.khiancarasicas.sunset.controller;

import com.khiancarasicas.sunset.model.dto.InterviewRequest;
import com.khiancarasicas.sunset.model.dto.InterviewResponse;
import com.khiancarasicas.sunset.service.InterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/job-applications/{jobAppId}/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping
    public ResponseEntity<InterviewResponse> create(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long jobAppId,
            @Valid @RequestBody InterviewRequest request) {
        String userId = jwt.getSubject();
        InterviewResponse response = interviewService.createInterview(userId, jobAppId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InterviewResponse> update(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long jobAppId,
            @PathVariable Long id,
            @Valid @RequestBody InterviewRequest request) {
        String userId = jwt.getSubject();
        return ResponseEntity.ok(interviewService.updateInterview(userId, jobAppId, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long jobAppId,
            @PathVariable Long id) {
        String userId = jwt.getSubject();
        interviewService.deleteInterview(userId, jobAppId, id);
        return ResponseEntity.noContent().build();
    }
}
