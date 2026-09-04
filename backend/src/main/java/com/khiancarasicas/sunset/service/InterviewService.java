package com.khiancarasicas.sunset.service;

import com.khiancarasicas.sunset.model.dto.InterviewRequest;
import com.khiancarasicas.sunset.model.dto.InterviewResponse;
import com.khiancarasicas.sunset.model.entity.Interview;
import com.khiancarasicas.sunset.model.entity.JobApplication;
import com.khiancarasicas.sunset.repository.InterviewRepository;
import com.khiancarasicas.sunset.repository.JobApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final JobApplicationRepository jobApplicationRepository;

    @Transactional
    public InterviewResponse createInterview(String userId, Long jobAppId, InterviewRequest request) {
        JobApplication application = findOwnedOrThrow(userId, jobAppId);

        Interview interview = new Interview();
        interview.setJobApplication(application);
        applyRequest(interview, request);
        interviewRepository.save(interview);

        return toResponse(interview);
    }

    @Transactional
    public InterviewResponse updateInterview(String userId, Long jobAppId, Long interviewId, InterviewRequest request) {
        findOwnedOrThrow(userId, jobAppId);

        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new IllegalStateException("Interview not found"));

        if (!interview.getJobApplication().getId().equals(jobAppId)) {
            throw new SecurityException("Interview does not belong to this application");
        }

        applyRequest(interview, request);
        interviewRepository.save(interview);

        return toResponse(interview);
    }

    @Transactional
    public void deleteInterview(String userId, Long jobAppId, Long interviewId) {
        findOwnedOrThrow(userId, jobAppId);

        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new IllegalStateException("Interview not found"));

        if (!interview.getJobApplication().getId().equals(jobAppId)) {
            throw new SecurityException("Interview does not belong to this application");
        }

        interviewRepository.delete(interview);
    }

    private JobApplication findOwnedOrThrow(String userId, Long id) {
        JobApplication application = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Job application not found"));
        if (!application.getUserId().equals(userId)) {
            throw new SecurityException("Access denied");
        }
        return application;
    }

    private void applyRequest(Interview interview, InterviewRequest request) {
        interview.setType(request.getType());
        interview.setDate(request.getDate());
        interview.setTime(request.getTime());
        interview.setInterviewer(request.getInterviewer());
        interview.setStatus(request.getStatus());
        interview.setOutcome(request.getOutcome());
        interview.setNotes(request.getNotes());
    }

    private InterviewResponse toResponse(Interview entity) {
        InterviewResponse response = new InterviewResponse();
        response.setId(entity.getId());
        response.setType(entity.getType());
        response.setDate(entity.getDate());
        response.setTime(entity.getTime());
        response.setInterviewer(entity.getInterviewer());
        response.setStatus(entity.getStatus());
        response.setOutcome(entity.getOutcome());
        response.setNotes(entity.getNotes());
        return response;
    }
}
