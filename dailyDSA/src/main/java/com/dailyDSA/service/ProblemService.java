package com.dailyDSA.service;

import com.dailyDSA.model.Difficulty;
import com.dailyDSA.model.Problem;
import com.dailyDSA.repository.ProblemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class ProblemService {

    @Autowired
    ProblemRepository problemRepository;

    public Problem getDailyProblem() {
        LocalDate today = LocalDate.now();
        Optional<Problem> problemOpt = problemRepository.findByDateAssigned(today);
        if (problemOpt.isPresent()) {
            return problemOpt.get();
        } else {
            // In a real app, this would fetch from an external API or DB pool of problems.
            // For now, we will create a dummy problem for the day if not present.
            Problem newProblem = Problem.builder()
                    .title("Two Sum")
                    .description("Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.")
                    .difficulty(Difficulty.EASY)
                    .dateAssigned(today)
                    .starterCode("function twoSum(nums, target) {\n    // Write your code here\n}")
                    .build();
            return problemRepository.save(newProblem);
        }
    }
}
