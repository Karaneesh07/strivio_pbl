package com.dailyDSA.controller;

import com.dailyDSA.dto.request.FocusSessionRequest;
import com.dailyDSA.model.FocusSession;
import com.dailyDSA.service.FocusSessionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/focus-sessions")
public class FocusSessionController {

    @Autowired
    FocusSessionService focusSessionService;

    @PostMapping("/start")
    public ResponseEntity<FocusSession> startSession(Authentication authentication,
                                                     @Valid @RequestBody FocusSessionRequest request) {
        String username = authentication.getName();
        return ResponseEntity.ok(focusSessionService.startSession(username, request));
    }

    @PostMapping("/{sessionId}/end")
    public ResponseEntity<FocusSession> endSession(@PathVariable Long sessionId,
                                                   Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(focusSessionService.endSession(sessionId, username));
    }

    @GetMapping
    public ResponseEntity<List<FocusSession>> getUserSessions(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(focusSessionService.getUserSessions(username));
    }
}
