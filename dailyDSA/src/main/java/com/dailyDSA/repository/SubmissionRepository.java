package com.dailyDSA.repository;

import com.dailyDSA.model.Problem;
import com.dailyDSA.model.Submission;
import com.dailyDSA.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByUserOrderBySubmittedAtDesc(User user);
    List<Submission> findByUserAndProblemOrderBySubmittedAtDesc(User user, Problem problem);
    int countByUserAndProblemIdAndStatus(User user, Long problemId, com.dailyDSA.model.SubmissionStatus status);
}
