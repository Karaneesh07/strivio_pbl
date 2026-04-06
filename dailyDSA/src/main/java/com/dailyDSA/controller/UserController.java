package com.dailyDSA.controller;

import com.dailyDSA.dto.response.UserDashboardStats;
import com.dailyDSA.model.Streak;
import com.dailyDSA.model.Submission;
import com.dailyDSA.model.SubmissionStatus;
import com.dailyDSA.model.User;
import com.dailyDSA.repository.UserRepository;
import com.dailyDSA.service.StreakService;
import com.dailyDSA.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    StreakService streakService;

    @Autowired
    SubmissionService submissionService;

    @GetMapping("/me/stats")
    public ResponseEntity<UserDashboardStats> getUserDashboardStats(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Streak streak = streakService.getStreak(user);
        List<Submission> submissions = submissionService.getUserSubmissions(username);

        long totalSolved = submissions.stream()
                .filter(s -> s.getStatus() == SubmissionStatus.ACCEPTED)
                .map(s -> s.getProblem().getId())
                .distinct()
                .count();

        long accuracyRate = 0;
        if (!submissions.isEmpty()) {
            long totalAccepted = submissions.stream()
                    .filter(s -> s.getStatus() == SubmissionStatus.ACCEPTED)
                    .count();
            accuracyRate = (totalAccepted * 100) / submissions.size();
        }

        UserDashboardStats stats = UserDashboardStats.builder()
                .username(user.getUsername())
                .currentStreak(streak.getCurrentStreak())
                .longestStreak(streak.getLongestStreak())
                .totalProblemsSolved(totalSolved)
                .accuracyRate(accuracyRate)
                .build();

        return ResponseEntity.ok(stats);
    }
}
