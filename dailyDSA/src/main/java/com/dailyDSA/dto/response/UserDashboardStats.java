package com.dailyDSA.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDashboardStats {
    private String username;
    private int currentStreak;
    private int longestStreak;
    private long totalProblemsSolved;
    private long accuracyRate;
}
