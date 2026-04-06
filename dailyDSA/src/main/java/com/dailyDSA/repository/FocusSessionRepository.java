package com.dailyDSA.repository;

import com.dailyDSA.model.FocusSession;
import com.dailyDSA.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FocusSessionRepository extends JpaRepository<FocusSession, Long> {
    List<FocusSession> findByUserOrderByStartTimeDesc(User user);
}
