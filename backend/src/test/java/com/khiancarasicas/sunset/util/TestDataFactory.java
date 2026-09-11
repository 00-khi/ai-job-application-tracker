package com.khiancarasicas.sunset.util;

import com.khiancarasicas.sunset.model.dto.BulletGenerationRequest;
import com.khiancarasicas.sunset.model.dto.InterviewRequest;
import com.khiancarasicas.sunset.model.dto.JobApplicationRequest;
import com.khiancarasicas.sunset.model.entity.Interview;
import com.khiancarasicas.sunset.model.entity.JobApplication;
import com.khiancarasicas.sunset.model.enums.*;

import java.time.LocalDate;
import java.util.List;

public final class TestDataFactory {

    private TestDataFactory() {
    }

    public static final String DEFAULT_USER_ID = "user-123";
    public static final String OTHER_USER_ID = "user-456";

    public static JobApplicationRequest createJobApplicationRequest() {
        JobApplicationRequest request = new JobApplicationRequest();
        request.setCompany("Acme Corp");
        request.setTitle("Software Engineer");
        request.setLocation("San Francisco, CA");
        request.setWorkMode(WorkMode.HYBRID);
        request.setJobType(JobType.FULL_TIME);
        request.setSalaryMin(120000);
        request.setSalaryMax(180000);
        request.setCurrency("USD");
        request.setStatus(ApplicationStatus.APPLIED);
        request.setDateApplied(LocalDate.of(2025, 1, 15));
        request.setSource("LinkedIn");
        request.setContactName("Jane Doe");
        request.setContactEmail("jane@acme.com");
        request.setJobUrl("https://acme.com/jobs/123");
        request.setNotes("Great opportunity");
        request.setTags(List.of("java", "spring", "remote-friendly"));
        return request;
    }

    public static JobApplicationRequest createMinimalJobApplicationRequest() {
        JobApplicationRequest request = new JobApplicationRequest();
        request.setCompany("Tech Startup");
        request.setTitle("Backend Developer");
        return request;
    }

    public static InterviewRequest createInterviewRequest() {
        InterviewRequest request = new InterviewRequest();
        request.setType(InterviewType.TECHNICAL);
        request.setDate(LocalDate.of(2025, 2, 1));
        request.setTime("10:00 AM");
        request.setInterviewer("John Smith");
        request.setStatus(InterviewStatus.SCHEDULED);
        request.setOutcome(InterviewOutcome.PENDING);
        request.setNotes("Technical interview round");
        return request;
    }

    public static InterviewRequest createMinimalInterviewRequest() {
        InterviewRequest request = new InterviewRequest();
        request.setType(InterviewType.PHONE_SCREEN);
        request.setDate(LocalDate.of(2025, 2, 1));
        request.setStatus(InterviewStatus.SCHEDULED);
        return request;
    }

    public static JobApplication createJobApplicationEntity(String userId) {
        JobApplication app = new JobApplication();
        app.setUserId(userId);
        app.setCompany("Acme Corp");
        app.setTitle("Software Engineer");
        app.setLocation("San Francisco, CA");
        app.setWorkMode(WorkMode.HYBRID);
        app.setJobType(JobType.FULL_TIME);
        app.setSalaryMin(120000);
        app.setSalaryMax(180000);
        app.setCurrency("USD");
        app.setStatus(ApplicationStatus.APPLIED);
        app.setDateApplied(LocalDate.of(2025, 1, 15));
        app.setSource("LinkedIn");
        app.setContactName("Jane Doe");
        app.setContactEmail("jane@acme.com");
        app.setJobUrl("https://acme.com/jobs/123");
        app.setNotes("Great opportunity");
        app.setTags("java,spring,remote-friendly");
        return app;
    }

    public static Interview createInterviewEntity(JobApplication jobApplication) {
        Interview interview = new Interview();
        interview.setJobApplication(jobApplication);
        interview.setType(InterviewType.TECHNICAL);
        interview.setDate(LocalDate.of(2025, 2, 1));
        interview.setTime("10:00 AM");
        interview.setInterviewer("John Smith");
        interview.setStatus(InterviewStatus.SCHEDULED);
        interview.setOutcome(InterviewOutcome.PENDING);
        interview.setNotes("Technical interview round");
        return interview;
    }

    public static BulletGenerationRequest createBulletGenerationRequest() {
        return new BulletGenerationRequest(
                "Software Engineer",
                Seniority.SENIOR,
                List.of("Java", "Spring Boot", "PostgreSQL"),
                "Built a caching layer that reduced API latency by 40%, designed job queue processing 10K daily tasks",
                null,
                BulletTone.IMPACT
        );
    }
}
