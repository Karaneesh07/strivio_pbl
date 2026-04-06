package com.dailyDSA.controller;

import com.dailyDSA.dto.request.SubmissionRequest;
import com.dailyDSA.model.Submission;
import com.dailyDSA.service.SubmissionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    @Autowired
    SubmissionService submissionService;

    @PostMapping
    public ResponseEntity<Submission> submitCode(Authentication authentication,
                                                 @Valid @RequestBody SubmissionRequest request) {
        String username = authentication.getName();
        return ResponseEntity.ok(submissionService.submitCode(username, request));
    }

    @GetMapping
    public ResponseEntity<List<Submission>> getUserSubmissions(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(submissionService.getUserSubmissions(username));
    }
}
