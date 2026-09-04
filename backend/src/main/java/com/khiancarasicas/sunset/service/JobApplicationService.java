package com.khiancarasicas.sunset.service;

import com.khiancarasicas.sunset.model.dto.InterviewRequest;
import com.khiancarasicas.sunset.model.dto.InterviewResponse;
import com.khiancarasicas.sunset.model.dto.JobApplicationRequest;
import com.khiancarasicas.sunset.model.dto.JobApplicationResponse;
import com.khiancarasicas.sunset.model.dto.JobApplicationSearchRequest;
import com.khiancarasicas.sunset.model.dto.JobApplicationStatsResponse;
import com.khiancarasicas.sunset.model.dto.PaginatedResponse;
import com.khiancarasicas.sunset.model.entity.Interview;
import com.khiancarasicas.sunset.model.entity.JobApplication;
import com.khiancarasicas.sunset.repository.JobApplicationRepository;
import com.khiancarasicas.sunset.repository.JobApplicationSpecification;
import com.khiancarasicas.sunset.util.TextCleaner;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;

    public List<JobApplicationResponse> listAll(String userId) {
        List<JobApplication> applications =
                jobApplicationRepository.findByUserIdWithInterviews(userId);
        return applications.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public PaginatedResponse<JobApplicationResponse> search(String userId, JobApplicationSearchRequest request) {
        Specification<JobApplication> spec = JobApplicationSpecification.build(
                userId, request.getSearch(), request.getStatus());

        Sort sort = buildSort(request.getSortBy(), request.getSortDirection());
        Pageable pageable = PageRequest.of(request.getSafePage(), request.getSafeSize(), sort);

        Page<JobApplication> page = jobApplicationRepository.findAll(spec, pageable);

        List<JobApplicationResponse> content = page.getContent().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return PaginatedResponse.of(
                content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages());
    }

    public JobApplicationStatsResponse getStats(String userId) {
        List<JobApplication> applications = jobApplicationRepository.findByUserIdWithInterviews(userId);

        long total = applications.size();
        long totalInterviews = applications.stream()
                .mapToLong(app -> app.getInterviews() != null ? app.getInterviews().size() : 0)
                .sum();
        long offers = applications.stream()
                .filter(app -> app.getStatus() == com.khiancarasicas.sunset.model.enums.ApplicationStatus.OFFER)
                .count();
        long rejected = applications.stream()
                .filter(app -> app.getStatus() == com.khiancarasicas.sunset.model.enums.ApplicationStatus.REJECTED)
                .count();

        Map<String, Long> byStatus = applications.stream()
                .collect(Collectors.groupingBy(
                        app -> app.getStatus().name(),
                        LinkedHashMap::new,
                        Collectors.counting()));

        return JobApplicationStatsResponse.builder()
                .total(total)
                .totalInterviews(totalInterviews)
                .offers(offers)
                .rejected(rejected)
                .byStatus(byStatus)
                .build();
    }

    private Sort buildSort(String sortBy, String sortDirection) {
        List<String> allowedSortFields = Arrays.asList(
                "company", "title", "status", "dateApplied",
                "location", "createdAt", "updatedAt");

        String field = allowedSortFields.contains(sortBy) ? sortBy : "createdAt";
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDirection)
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        return Sort.by(direction, field);
    }

    public JobApplicationResponse getById(String userId, Long id) {
        JobApplication application = findOwnedOrThrow(userId, id);
        return toResponse(application);
    }

    @Transactional
    public JobApplicationResponse create(String userId, JobApplicationRequest request) {
        JobApplication application = new JobApplication();
        application.setUserId(userId);
        applyRequest(application, request);
        jobApplicationRepository.save(application);
        return toResponse(application);
    }

    @Transactional
    public JobApplicationResponse update(String userId, Long id, JobApplicationRequest request) {
        JobApplication application = findOwnedOrThrow(userId, id);
        applyRequest(application, request);
        jobApplicationRepository.save(application);
        return toResponse(application);
    }

    @Transactional
    public void delete(String userId, Long id) {
        JobApplication application = findOwnedOrThrow(userId, id);
        jobApplicationRepository.delete(application);
    }

    private JobApplication findOwnedOrThrow(String userId, Long id) {
        JobApplication application = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Job application not found"));
        if (!application.getUserId().equals(userId)) {
            throw new SecurityException("Access denied");
        }
        return application;
    }

    private void applyRequest(JobApplication application, JobApplicationRequest request) {
        application.setCompany(TextCleaner.trimAndCollapse(request.getCompany()));
        application.setTitle(TextCleaner.trimAndCollapse(request.getTitle()));
        application.setLocation(TextCleaner.trimAndCollapse(request.getLocation()));
        application.setWorkMode(request.getWorkMode());
        application.setJobType(request.getJobType());
        application.setSalaryMin(request.getSalaryMin());
        application.setSalaryMax(request.getSalaryMax());
        application.setCurrency(request.getCurrency() != null ? request.getCurrency() : "USD");
        application.setStatus(request.getStatus() != null ? request.getStatus() : com.khiancarasicas.sunset.model.enums.ApplicationStatus.SAVED);
        application.setDateApplied(request.getDateApplied());
        application.setSource(TextCleaner.trimAndCollapse(request.getSource()));
        application.setContactName(TextCleaner.trimAndCollapse(request.getContactName()));
        application.setContactEmail(TextCleaner.trimAndCollapse(request.getContactEmail()));
        application.setJobUrl(TextCleaner.trimAndCollapse(request.getJobUrl()));
        application.setNotes(request.getNotes());
        application.setTags(request.getTags() != null ? String.join(",", TextCleaner.cleanTags(request.getTags())) : null);
    }

    private JobApplicationResponse toResponse(JobApplication entity) {
        JobApplicationResponse response = new JobApplicationResponse();
        response.setId(entity.getId());
        response.setCompany(entity.getCompany());
        response.setTitle(entity.getTitle());
        response.setLocation(entity.getLocation());
        response.setWorkMode(entity.getWorkMode());
        response.setJobType(entity.getJobType());
        response.setSalaryMin(entity.getSalaryMin());
        response.setSalaryMax(entity.getSalaryMax());
        response.setCurrency(entity.getCurrency());
        response.setStatus(entity.getStatus());
        response.setDateApplied(entity.getDateApplied());
        response.setSource(entity.getSource());
        response.setContactName(entity.getContactName());
        response.setContactEmail(entity.getContactEmail());
        response.setJobUrl(entity.getJobUrl());
        response.setNotes(entity.getNotes());
        response.setTags(entity.getTags() != null && !entity.getTags().isEmpty()
                ? List.of(entity.getTags().split(","))
                : Collections.emptyList());
        response.setCreatedAt(entity.getCreatedAt());
        response.setUpdatedAt(entity.getUpdatedAt());

        if (entity.getInterviews() != null) {
            response.setInterviews(entity.getInterviews().stream()
                    .map(this::toInterviewResponse)
                    .collect(Collectors.toList()));
        } else {
            response.setInterviews(Collections.emptyList());
        }

        return response;
    }

    private InterviewResponse toInterviewResponse(Interview entity) {
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
