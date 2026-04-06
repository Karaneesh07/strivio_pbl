package com.dailyDSA.service;

import com.dailyDSA.dto.request.SubmissionRequest;
import com.dailyDSA.model.Problem;
import com.dailyDSA.model.Submission;
import com.dailyDSA.model.SubmissionStatus;
import com.dailyDSA.model.User;
import com.dailyDSA.repository.ProblemRepository;
import com.dailyDSA.repository.SubmissionRepository;
import com.dailyDSA.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;

@Service
public class SubmissionService {

    @Autowired
    SubmissionRepository submissionRepository;

    @Autowired
    ProblemRepository problemRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    StreakService streakService;

    public Submission submitCode(String username, SubmissionRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        // Simulate code evaluation: 80% pass rate
        boolean isAccepted = new Random().nextInt(100) < 80;
        SubmissionStatus status = isAccepted ? SubmissionStatus.ACCEPTED : SubmissionStatus.REJECTED;

        Submission submission = Submission.builder()
                .user(user)
                .problem(problem)
                .code(request.getCode())
                .language(request.getLanguage())
                .timeTakenSeconds(request.getTimeTakenSeconds())
                .status(status)
                .build();

        Submission savedSubmission = submissionRepository.save(submission);

        if (status == SubmissionStatus.ACCEPTED) {
            streakService.updateStreakOnSolve(user);
        }

        return savedSubmission;
    }

    public List<Submission> getUserSubmissions(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return submissionRepository.findByUserOrderBySubmittedAtDesc(user);
    }
}
