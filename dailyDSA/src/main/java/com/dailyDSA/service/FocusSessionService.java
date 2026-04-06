package com.dailyDSA.service;

import com.dailyDSA.dto.request.FocusSessionRequest;
import com.dailyDSA.model.FocusSession;
import com.dailyDSA.model.User;
import com.dailyDSA.repository.FocusSessionRepository;
import com.dailyDSA.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FocusSessionService {

    @Autowired
    FocusSessionRepository focusSessionRepository;

    @Autowired
    UserRepository userRepository;

    public FocusSession startSession(String username, FocusSessionRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        FocusSession session = FocusSession.builder()
                .user(user)
                .startTime(LocalDateTime.now())
                .durationMinutes(request.getDurationMinutes())
                .completed(false)
                .build();

        return focusSessionRepository.save(session);
    }

    public FocusSession endSession(Long sessionId, String username) {
        FocusSession session = focusSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        session.setEndTime(LocalDateTime.now());
        session.setCompleted(true);
        return focusSessionRepository.save(session);
    }

    public List<FocusSession> getUserSessions(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return focusSessionRepository.findByUserOrderByStartTimeDesc(user);
    }
}
