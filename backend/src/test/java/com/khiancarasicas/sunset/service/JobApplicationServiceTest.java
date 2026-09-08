package com.khiancarasicas.sunset.service;

import com.khiancarasicas.sunset.model.dto.JobApplicationRequest;
import com.khiancarasicas.sunset.model.dto.JobApplicationResponse;
import com.khiancarasicas.sunset.model.dto.JobApplicationSearchRequest;
import com.khiancarasicas.sunset.model.dto.JobApplicationStatsResponse;
import com.khiancarasicas.sunset.model.dto.PaginatedResponse;
import com.khiancarasicas.sunset.model.entity.Interview;
import com.khiancarasicas.sunset.model.entity.JobApplication;
import com.khiancarasicas.sunset.model.enums.ApplicationStatus;
import com.khiancarasicas.sunset.model.enums.InterviewStatus;
import com.khiancarasicas.sunset.model.enums.InterviewType;
import com.khiancarasicas.sunset.repository.JobApplicationRepository;
import com.khiancarasicas.sunset.util.TestDataFactory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobApplicationServiceTest {

    @Mock
    private JobApplicationRepository jobApplicationRepository;

    @InjectMocks
    private JobApplicationService jobApplicationService;

    @Test
    void create_validRequest_returnsResponse() {
        String userId = TestDataFactory.DEFAULT_USER_ID;
        JobApplicationRequest request = TestDataFactory.createJobApplicationRequest();

        when(jobApplicationRepository.save(any(JobApplication.class))).thenAnswer(inv -> {
            JobApplication app = inv.getArgument(0);
            app.setId(1L);
            return app;
        });

        JobApplicationResponse response = jobApplicationService.create(userId, request);

        assertNotNull(response);
        assertEquals("Acme Corp", response.getCompany());
        assertEquals("Software Engineer", response.getTitle());
        assertEquals(List.of("java", "spring", "remote-friendly"), response.getTags());
        verify(jobApplicationRepository).save(any(JobApplication.class));
    }

    @Test
    void create_setsUserIdOnEntity() {
        String userId = TestDataFactory.DEFAULT_USER_ID;
        JobApplicationRequest request = TestDataFactory.createMinimalJobApplicationRequest();

        when(jobApplicationRepository.save(any(JobApplication.class))).thenAnswer(inv -> {
            JobApplication app = inv.getArgument(0);
            app.setId(1L);
            return app;
        });

        jobApplicationService.create(userId, request);

        verify(jobApplicationRepository).save(argThat(app -> userId.equals(app.getUserId())));
    }

    @Test
    void create_appliesTextCleaning() {
        String userId = TestDataFactory.DEFAULT_USER_ID;
        JobApplicationRequest request = new JobApplicationRequest();
        request.setCompany("  Acme  Corp  ");
        request.setTitle("  Software  Engineer  ");

        when(jobApplicationRepository.save(any(JobApplication.class))).thenAnswer(inv -> {
            JobApplication app = inv.getArgument(0);
            app.setId(1L);
            return app;
        });

        JobApplicationResponse response = jobApplicationService.create(userId, request);

        assertEquals("Acme Corp", response.getCompany());
        assertEquals("Software Engineer", response.getTitle());
    }

    @Test
    void create_defaultsCurrencyToUsd() {
        String userId = TestDataFactory.DEFAULT_USER_ID;
        JobApplicationRequest request = TestDataFactory.createMinimalJobApplicationRequest();
        request.setCurrency(null);

        when(jobApplicationRepository.save(any(JobApplication.class))).thenAnswer(inv -> {
            JobApplication app = inv.getArgument(0);
            app.setId(1L);
            return app;
        });

        JobApplicationResponse response = jobApplicationService.create(userId, request);

        assertEquals("USD", response.getCurrency());
    }

    @Test
    void create_defaultsStatusToSaved() {
        String userId = TestDataFactory.DEFAULT_USER_ID;
        JobApplicationRequest request = TestDataFactory.createMinimalJobApplicationRequest();
        request.setStatus(null);

        when(jobApplicationRepository.save(any(JobApplication.class))).thenAnswer(inv -> {
            JobApplication app = inv.getArgument(0);
            app.setId(1L);
            return app;
        });

        JobApplicationResponse response = jobApplicationService.create(userId, request);

        assertEquals(ApplicationStatus.SAVED, response.getStatus());
    }

    @Test
    void create_cleansTags() {
        String userId = TestDataFactory.DEFAULT_USER_ID;
        JobApplicationRequest request = new JobApplicationRequest();
        request.setCompany("Acme");
        request.setTitle("Engineer");
        request.setTags(List.of("  java  ", "", "spring"));

        when(jobApplicationRepository.save(any(JobApplication.class))).thenAnswer(inv -> {
            JobApplication app = inv.getArgument(0);
            app.setId(1L);
            return app;
        });

        JobApplicationResponse response = jobApplicationService.create(userId, request);

        assertEquals(List.of("java", "spring"), response.getTags());
    }

    @Test
    void update_validRequest_returnsUpdatedResponse() {
        String userId = TestDataFactory.DEFAULT_USER_ID;
        Long id = 1L;
        JobApplication existing = TestDataFactory.createJobApplicationEntity(userId);
        existing.setId(id);

        when(jobApplicationRepository.findById(id)).thenReturn(Optional.of(existing));
        when(jobApplicationRepository.save(any(JobApplication.class))).thenAnswer(inv -> inv.getArgument(0));

        JobApplicationRequest request = TestDataFactory.createJobApplicationRequest();
        request.setCompany("Updated Corp");

        JobApplicationResponse response = jobApplicationService.update(userId, id, request);

        assertEquals("Updated Corp", response.getCompany());
        verify(jobApplicationRepository).save(any(JobApplication.class));
    }

    @Test
    void update_wrongUser_throwsAccessDenied() {
        String userId = TestDataFactory.DEFAULT_USER_ID;
        Long id = 1L;
        JobApplication existing = TestDataFactory.createJobApplicationEntity(userId);
        existing.setId(id);

        when(jobApplicationRepository.findById(id)).thenReturn(Optional.of(existing));

        JobApplicationRequest request = TestDataFactory.createJobApplicationRequest();

        assertThrows(AccessDeniedException.class,
                () -> jobApplicationService.update(TestDataFactory.OTHER_USER_ID, id, request));
    }

    @Test
    void update_notFound_throwsIllegalState() {
        Long id = 999L;
        when(jobApplicationRepository.findById(id)).thenReturn(Optional.empty());

        JobApplicationRequest request = TestDataFactory.createJobApplicationRequest();

        assertThrows(IllegalStateException.class,
                () -> jobApplicationService.update(TestDataFactory.DEFAULT_USER_ID, id, request));
    }

    @Test
    void delete_validOwner_deletes() {
        String userId = TestDataFactory.DEFAULT_USER_ID;
        Long id = 1L;
        JobApplication existing = TestDataFactory.createJobApplicationEntity(userId);
        existing.setId(id);

        when(jobApplicationRepository.findById(id)).thenReturn(Optional.of(existing));

        jobApplicationService.delete(userId, id);

        verify(jobApplicationRepository).delete(existing);
    }

    @Test
    void delete_wrongUser_throwsAccessDenied() {
        String userId = TestDataFactory.DEFAULT_USER_ID;
        Long id = 1L;
        JobApplication existing = TestDataFactory.createJobApplicationEntity(userId);
        existing.setId(id);

        when(jobApplicationRepository.findById(id)).thenReturn(Optional.of(existing));

        assertThrows(AccessDeniedException.class,
                () -> jobApplicationService.delete(TestDataFactory.OTHER_USER_ID, id));
    }

    @Test
    void delete_notFound_throwsIllegalState() {
        Long id = 999L;
        when(jobApplicationRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(IllegalStateException.class,
                () -> jobApplicationService.delete(TestDataFactory.DEFAULT_USER_ID, id));
    }

    @Test
    void getById_validOwner_returnsResponse() {
        String userId = TestDataFactory.DEFAULT_USER_ID;
        Long id = 1L;
        JobApplication existing = TestDataFactory.createJobApplicationEntity(userId);
        existing.setId(id);

        when(jobApplicationRepository.findById(id)).thenReturn(Optional.of(existing));

        JobApplicationResponse response = jobApplicationService.getById(userId, id);

        assertEquals(id, response.getId());
        assertEquals("Acme Corp", response.getCompany());
    }

    @Test
    void getById_wrongUser_throwsAccessDenied() {
        String userId = TestDataFactory.DEFAULT_USER_ID;
        Long id = 1L;
        JobApplication existing = TestDataFactory.createJobApplicationEntity(userId);
        existing.setId(id);

        when(jobApplicationRepository.findById(id)).thenReturn(Optional.of(existing));

        assertThrows(AccessDeniedException.class,
                () -> jobApplicationService.getById(TestDataFactory.OTHER_USER_ID, id));
    }

    @Test
    void listAll_returnsAllUserApplications() {
        String userId = TestDataFactory.DEFAULT_USER_ID;
        JobApplication app1 = TestDataFactory.createJobApplicationEntity(userId);
        app1.setId(1L);
        JobApplication app2 = TestDataFactory.createJobApplicationEntity(userId);
        app2.setId(2L);

        when(jobApplicationRepository.findByUserIdWithInterviews(userId)).thenReturn(List.of(app1, app2));

        List<JobApplicationResponse> responses = jobApplicationService.listAll(userId);

        assertEquals(2, responses.size());
    }

    @Test
    void listAll_withInterviews_includesInterviewsInResponse() {
        String userId = TestDataFactory.DEFAULT_USER_ID;
        JobApplication app = TestDataFactory.createJobApplicationEntity(userId);
        app.setId(1L);

        Interview interview = TestDataFactory.createInterviewEntity(app);
        interview.setId(10L);
        app.setInterviews(List.of(interview));

        when(jobApplicationRepository.findByUserIdWithInterviews(userId)).thenReturn(List.of(app));

        List<JobApplicationResponse> responses = jobApplicationService.listAll(userId);

        assertEquals(1, responses.size());
        assertEquals(1, responses.get(0).getInterviews().size());
        assertEquals(10L, responses.get(0).getInterviews().get(0).getId());
    }

    @Test
    void listAll_emptyResult_returnsEmptyList() {
        when(jobApplicationRepository.findByUserIdWithInterviews("no-user")).thenReturn(Collections.emptyList());

        List<JobApplicationResponse> responses = jobApplicationService.listAll("no-user");

        assertTrue(responses.isEmpty());
    }

    @Test
    void search_returnsPaginatedResults() {
        String userId = TestDataFactory.DEFAULT_USER_ID;
        JobApplication app = TestDataFactory.createJobApplicationEntity(userId);
        app.setId(1L);

        Page<JobApplication> page = new PageImpl<>(List.of(app), Pageable.ofSize(10), 1);
        when(jobApplicationRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);

        JobApplicationSearchRequest searchRequest = new JobApplicationSearchRequest();
        searchRequest.setPage(0);
        searchRequest.setSize(10);

        PaginatedResponse<JobApplicationResponse> response = jobApplicationService.search(userId, searchRequest);

        assertEquals(1, response.getContent().size());
        assertEquals(0, response.getPage());
        assertEquals(10, response.getSize());
        assertEquals(1, response.getTotalElements());
    }

    @Test
    void getStats_computesCorrectCounts() {
        String userId = TestDataFactory.DEFAULT_USER_ID;

        JobApplication app1 = TestDataFactory.createJobApplicationEntity(userId);
        app1.setId(1L);
        app1.setStatus(ApplicationStatus.OFFER);

        JobApplication app2 = TestDataFactory.createJobApplicationEntity(userId);
        app2.setId(2L);
        app2.setStatus(ApplicationStatus.REJECTED);

        JobApplication app3 = TestDataFactory.createJobApplicationEntity(userId);
        app3.setId(3L);
        app3.setStatus(ApplicationStatus.APPLIED);

        Interview interview = TestDataFactory.createInterviewEntity(app1);
        app1.setInterviews(List.of(interview));

        when(jobApplicationRepository.findByUserIdWithInterviews(userId)).thenReturn(List.of(app1, app2, app3));

        JobApplicationStatsResponse stats = jobApplicationService.getStats(userId);

        assertEquals(3, stats.getTotal());
        assertEquals(1, stats.getTotalInterviews());
        assertEquals(1, stats.getOffers());
        assertEquals(1, stats.getRejected());
        assertEquals(1L, stats.getByStatus().get("OFFER"));
        assertEquals(1L, stats.getByStatus().get("REJECTED"));
        assertEquals(1L, stats.getByStatus().get("APPLIED"));
    }

    @Test
    void getStats_noApplications_returnsZeros() {
        when(jobApplicationRepository.findByUserIdWithInterviews("empty-user")).thenReturn(Collections.emptyList());

        JobApplicationStatsResponse stats = jobApplicationService.getStats("empty-user");

        assertEquals(0, stats.getTotal());
        assertEquals(0, stats.getTotalInterviews());
        assertEquals(0, stats.getOffers());
        assertEquals(0, stats.getRejected());
        assertTrue(stats.getByStatus().isEmpty());
    }
}
