package com.khiancarasicas.sunset.repository;

import com.khiancarasicas.sunset.model.entity.JobApplication;
import com.khiancarasicas.sunset.model.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long>,
        JpaSpecificationExecutor<JobApplication> {

    List<JobApplication> findByUserId(String userId);

    List<JobApplication> findByUserIdAndStatus(String userId, ApplicationStatus status);

    @Query("SELECT ja FROM JobApplication ja LEFT JOIN FETCH ja.interviews WHERE ja.userId = :userId")
    List<JobApplication> findByUserIdWithInterviews(@Param("userId") String userId);

    @Query("SELECT ja FROM JobApplication ja LEFT JOIN FETCH ja.interviews WHERE ja.id = :id")
    JobApplication findByIdWithInterviews(@Param("id") Long id);
}
