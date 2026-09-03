package com.khiancarasicas.sunset.repository;

import com.khiancarasicas.sunset.model.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterviewRepository extends JpaRepository<Interview, Long> {

    List<Interview> findByJobApplicationId(Long jobApplicationId);
}
