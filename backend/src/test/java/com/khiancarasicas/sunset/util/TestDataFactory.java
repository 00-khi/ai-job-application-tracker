package com.khiancarasicas.sunset.util;

import com.khiancarasicas.sunset.model.dto.BulletGenerationRequest;
import com.khiancarasicas.sunset.model.dto.InterviewRequest;
import com.khiancarasicas.sunset.model.dto.JobApplicationRequest;
import com.khiancarasicas.sunset.model.dto.JobFitRequest;
import com.khiancarasicas.sunset.model.dto.JobFitResponse;
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

    public static JobFitRequest createJobFitRequest() {
        return new JobFitRequest(
                "Senior frontend developer with 5 years of experience building React and TypeScript applications, "
                        + "led a redesign that improved page load time by 35% and mentored 2 junior developers",
                "We are hiring a Senior Frontend Developer to own our design system, ship accessible React features, "
                        + "and collaborate with product and design on a customer-facing dashboard",
                Strictness.BALANCED
        );
    }

    public static JobFitResponse createJobFitResponse() {
        return new JobFitResponse(
                78,
                "STRONG",
                62,
                "The resume shows solid frontend depth and measurable performance work that maps well to the target role, "
                        + "but design-system ownership and accessibility experience are only lightly evidenced.",
                List.of(new JobFitResponse.ScoreBreakdownItem("Required Qualifications Match", 80,
                                "Meets the core React and TypeScript requirements stated in the job description")),
                List.of(new JobFitResponse.StrengthItem("Performance optimization",
                                "Improved page load time by 35%",
                                "Directly demonstrates measurable impact on user experience")),
                List.of(new JobFitResponse.WeaknessItem("Accessibility",
                                "No WCAG or assistive-technology work mentioned",
                                "The job description requires accessible feature delivery")),
                new JobFitResponse.ScoredAnalysis(82,
                        "Five years of progressive frontend ownership with leadership signals",
                        List.of("Led a redesign affecting page load performance")),
                new JobFitResponse.ScoredAnalysis(75,
                        "Projects show breadth but limited scale evidence",
                        List.of("Redesign project is the strongest portfolio piece")),
                new JobFitResponse.ScoredAnalysis(70,
                        "One quantified metric across the resume",
                        List.of("35% page load improvement is the only number cited")),
                "Frontend specialization with a path toward design-system and platform ownership",
                List.of(new JobFitResponse.RecommendedPosition("Senior Frontend Developer", 84,
                                List.of(new JobFitResponse.PositionDimension("Skills Match", 88),
                                        new JobFitResponse.PositionDimension("Experience", 85),
                                        new JobFitResponse.PositionDimension("Seniority Fit", 80),
                                        new JobFitResponse.PositionDimension("Domain Fit", 82),
                                        new JobFitResponse.PositionDimension("Growth Potential", 86)))),
                List.of(new JobFitResponse.RedFlag("Missing accessibility keywords", "MEDIUM",
                        "The resume never mentions WCAG, ARIA, or screen-reader testing")),
                new JobFitResponse.AtsAnalysis(74, 68,
                        List.of("design system", "WCAG"),
                        List.of("Unusual date formatting in experience section"),
                        "Parseable overall but keyword coverage falls short of the job description"),
                List.of(new JobFitResponse.SectionImprovement("Skills",
                                "No accessibility tooling listed",
                                "Add concrete accessibility skills you actually have",
                                "HIGH")),
                List.of(new JobFitResponse.BulletImprovement(
                                "Responsible for improving website performance",
                                "Improved page load time by 35% by refactoring image loading and code splitting",
                                "Replaces duty-based phrasing with a quantified result")),
                List.of(new JobFitResponse.ActionPlanItem("HIGH",
                                "Add accessibility keywords that match your real experience",
                                "This week",
                                "Higher keyword match percentage in ATS screening"))
        );
    }
}
