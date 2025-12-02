package com.foodapp.repository;

import com.foodapp.model.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findTop10ByOrderByTimestampDesc();
}