package com.dailyDSA.service;

import com.dailyDSA.model.Streak;
import com.dailyDSA.model.User;
import com.dailyDSA.repository.StreakRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
public class StreakService {

    @Autowired
    StreakRepository streakRepository;

    public Streak getStreak(User user) {
        return streakRepository.findByUser(user).orElseGet(() -> {
            Streak newStreak = Streak.builder()
                    .user(user)
                    .currentStreak(0)
                    .longestStreak(0)
                    .build();
            return streakRepository.save(newStreak);
        });
    }

    public synchronized void updateStreakOnSolve(User user) {
        Streak streak = getStreak(user);
        LocalDate today = LocalDate.now();

        if (streak.getLastSolvedDate() == null) {
            streak.setCurrentStreak(1);
            streak.setLongestStreak(1);
            streak.setLastSolvedDate(today);
        } else {
            long daysBetween = ChronoUnit.DAYS.between(streak.getLastSolvedDate(), today);

            if (daysBetween == 1) {
                // Consecutive day
                streak.setCurrentStreak(streak.getCurrentStreak() + 1);
                if (streak.getCurrentStreak() > streak.getLongestStreak()) {
                    streak.setLongestStreak(streak.getCurrentStreak());
                }
                streak.setLastSolvedDate(today);
            } else if (daysBetween > 1) {
                // Streak broken
                streak.setCurrentStreak(1);
                streak.setLastSolvedDate(today);
            }
            // If daysBetween == 0, already solved today. Do nothing.
        }

        streakRepository.save(streak);
    }
}
