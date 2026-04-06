package com.dailyDSA.controller;

import com.dailyDSA.model.Problem;
import com.dailyDSA.service.ProblemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/problems")
public class ProblemController {

    @Autowired
    ProblemService problemService;

    @GetMapping("/daily")
    public ResponseEntity<Problem> getDailyProblem() {
        return ResponseEntity.ok(problemService.getDailyProblem());
    }
}
