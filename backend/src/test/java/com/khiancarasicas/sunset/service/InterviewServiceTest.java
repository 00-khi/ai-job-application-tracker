package com.khiancarasicas.sunset.service;

import com.khiancarasicas.sunset.model.dto.InterviewRequest;
import com.khiancarasicas.sunset.model.dto.InterviewResponse;
import com.khiancarasicas.sunset.model.entity.Interview;
import com.khiancarasicas.sunset.model.entity.JobApplication;
import com.khiancarasicas.sunset.model.enums.InterviewOutcome;
import com.khiancarasicas.sunset.model.enums.InterviewStatus;
import com.khiancarasicas.sunset.model.enums.InterviewType;
import com.khiancarasicas.sunset.repository.InterviewRepository;
import com.khiancarasicas.sunset.repository.JobApplicationRepository;
import com.khiancarasicas.sunset.util.TestDataFactory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InterviewServiceTest {

    @Mock
    private InterviewRepository interviewRepository;

    @Mock
    private JobApplicationRepository jobApplicationRepository;

    @InjectMocks
    private InterviewService interviewService;

    @Test
    void createInterview_validRequest_returnsResponse() {
        String userId = TestDataFactory.DEFAULT_USER_ID;
        Long jobAppId = 1L;
        InterviewRequest request = TestDataFactory.createInterviewRequest();

        JobApplication app = TestDataFactory.createJobApplicationEntity(userId);
        app.setId(jobAppId);

        when(jobApplicationRepository.findById(jobAppId)).thenReturn(Optional.of(app));
        when(interviewRepository.save(any(Interview.class))).thenAnswer(inv -> {
            Interview interview = inv.getArgument(0);
            interview.setId(10L);
            return interview;
        });

        InterviewResponse response = interviewService.createInterview(userId, jobAppId, request);

        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals(InterviewType.TECHNICAL, response.getType());
        assertEquals(InterviewStatus.SCHEDULED, response.getStatus());
        verify(interviewRepository).save(any(Interview.class));
    }

    @Test
    void createInterview_setsJobApplicationOnInterview() {
        String userId = TestDataFactory.DEFAULT_USER_ID;
        Long jobAppId = 1L;
        InterviewRequest request = TestDataFactory.createMinimalInterviewRequest();

        JobApplication app = TestDataFactory.createJobApplicationEntity(userId);
        app.setId(jobAppId);

        when(jobApplicationRepository.findById(jobAppId)).thenReturn(Optional.of(app));
        when(interviewRepository.save(any(Interview.class))).thenAnswer(inv -> {
            Interview interview = inv.getArgument(0);
            interview.setId(10L);
            return interview;
        });

        interviewService.createInterview(userId, jobAppId, request);

        verify(interviewRepository).save(argThat(interview -> jobAppId.equals(interview.getJobApplication().getId())));
    }

    @Test
    void createInterview_wrongUser_throwsAccessDenied() {
        String userId = TestDataFactory.DEFAULT_USER_ID;
        Long jobAppId = 1L;
        InterviewRequest request = TestDataFactory.createInterviewRequest();

        JobApplication app = TestDataFactory.createJobApplicationEntity(userId);
        app.setId(jobAppId);

        when(jobApplicationRepository.findById(jobAppId)).thenReturn(Optional.of(app));

        assertThrows(AccessDeniedException.class,
                () -> interviewService.createInterview(TestDataFactory.OTHER_USER_ID, jobAppId, request));
    }

    @Test
    void createInterview_jobAppNotFound_throwsIllegalState() {
        Long jobAppId = 999L;
        InterviewRequest request = TestDataFactory.createInterviewRequest();

        when(jobApplicationRepository.findById(jobAppId)).thenReturn(Optional.empty());

        assertThrows(IllegalStateException.class,
                () -> interviewService.createInterview(TestDataFactory.DEFAULT_USER_ID, jobAppId, request));
    }

    @Test
    void updateInterview_validRequest_returnsUpdatedResponse() {
        String userId = TestDataFactory.DEFAULT_USER_ID;
        Long jobAppId = 1L;
        Long interviewId = 10L;

        JobApplication app = TestDataFactory.createJobApplicationEntity(userId);
        app.setId(jobAppId);

        Interview existing = TestDataFactory.createInterviewEntity(app);
        existing.setId(interviewId);

        when(jobApplicationRepository.findById(jobAppId)).thenReturn(Optional.of(app));
        when(interviewRepository.findById(interviewId)).thenReturn(Optional.of(existing));
        when(interviewRepository.save(any(Interview.class))).thenAnswer(inv -> inv.getArgument(0));

        InterviewRequest request = TestDataFactory.createInterviewRequest();
        request.setType(InterviewType.BEHAVIORAL);

        InterviewResponse response = interviewService.updateInterview(userId, jobAppId, interviewId, request);

        assertEquals(InterviewType.BEHAVIORAL, response.getType());
        verify(interviewRepository).save(any(Interview.class));
    }

    @Test
    void updateInterview_interviewNotBelongingToApp_throwsAccessDenied() {
        String userId = TestDataFactory.DEFAULT_USER_ID;
        Long jobAppId = 1L;
        Long interviewId = 10L;

        JobApplication app = TestDataFactory.createJobApplicationEntity(userId);
        app.setId(jobAppId);

        JobApplication otherApp = TestDataFactory.createJobApplicationEntity(userId);
        otherApp.setId(2L);

        Interview existing = TestDataFactory.createInterviewEntity(otherApp);
        existing.setId(interviewId);

        when(jobApplicationRepository.findById(jobAppId)).thenReturn(Optional.of(app));
        when(interviewRepository.findById(interviewId)).thenReturn(Optional.of(existing));

        InterviewRequest request = TestDataFactory.createInterviewRequest();

        assertThrows(AccessDeniedException.class,
                () -> interviewService.updateInterview(userId, jobAppId, interviewId, request));
    }

    @Test
    void updateInterview_interviewNotFound_throwsIllegalState() {
        String userId = TestDataFactory.DEFAULT_USER_ID;
        Long jobAppId = 1L;
        Long interviewId = 999L;

        JobApplication app = TestDataFactory.createJobApplicationEntity(userId);
        app.setId(jobAppId);

        when(jobApplicationRepository.findById(jobAppId)).thenReturn(Optional.of(app));
        when(interviewRepository.findById(interviewId)).thenReturn(Optional.empty());

        InterviewRequest request = TestDataFactory.createInterviewRequest();

        assertThrows(IllegalStateException.class,
                () -> interviewService.updateInterview(userId, jobAppId, interviewId, request));
    }

    @Test
    void updateInterview_wrongUser_throwsAccessDenied() {
        String userId = TestDataFactory.DEFAULT_USER_ID;
        Long jobAppId = 1L;
        Long interviewId = 10L;

        JobApplication app = TestDataFactory.createJobApplicationEntity(userId);
        app.setId(jobAppId);

        when(jobApplicationRepository.findById(jobAppId)).thenReturn(Optional.of(app));

        InterviewRequest request = TestDataFactory.createInterviewRequest();

        assertThrows(AccessDeniedException.class,
                () -> interviewService.updateInterview(TestDataFactory.OTHER_USER_ID, jobAppId, interviewId, request));
    }

    @Test
    void deleteInterview_validRequest_deletes() {
        String userId = TestDataFactory.DEFAULT_USER_ID;
        Long jobAppId = 1L;
        Long interviewId = 10L;

        JobApplication app = TestDataFactory.createJobApplicationEntity(userId);
        app.setId(jobAppId);

        Interview existing = TestDataFactory.createInterviewEntity(app);
        existing.setId(interviewId);

        when(jobApplicationRepository.findById(jobAppId)).thenReturn(Optional.of(app));
        when(interviewRepository.findById(interviewId)).thenReturn(Optional.of(existing));

        interviewService.deleteInterview(userId, jobAppId, interviewId);

        verify(interviewRepository).delete(existing);
    }

    @Test
    void deleteInterview_interviewNotBelongingToApp_throwsAccessDenied() {
        String userId = TestDataFactory.DEFAULT_USER_ID;
        Long jobAppId = 1L;
        Long interviewId = 10L;

        JobApplication app = TestDataFactory.createJobApplicationEntity(userId);
        app.setId(jobAppId);

        JobApplication otherApp = TestDataFactory.createJobApplicationEntity(userId);
        otherApp.setId(2L);

        Interview existing = TestDataFactory.createInterviewEntity(otherApp);
        existing.setId(interviewId);

        when(jobApplicationRepository.findById(jobAppId)).thenReturn(Optional.of(app));
        when(interviewRepository.findById(interviewId)).thenReturn(Optional.of(existing));

        assertThrows(AccessDeniedException.class,
                () -> interviewService.deleteInterview(userId, jobAppId, interviewId));
    }

    @Test
    void deleteInterview_wrongUser_throwsAccessDenied() {
        String userId = TestDataFactory.DEFAULT_USER_ID;
        Long jobAppId = 1L;
        Long interviewId = 10L;

        JobApplication app = TestDataFactory.createJobApplicationEntity(userId);
        app.setId(jobAppId);

        when(jobApplicationRepository.findById(jobAppId)).thenReturn(Optional.of(app));

        assertThrows(AccessDeniedException.class,
                () -> interviewService.deleteInterview(TestDataFactory.OTHER_USER_ID, jobAppId, interviewId));
    }

    @Test
    void deleteInterview_interviewNotFound_throwsIllegalState() {
        String userId = TestDataFactory.DEFAULT_USER_ID;
        Long jobAppId = 1L;
        Long interviewId = 999L;

        JobApplication app = TestDataFactory.createJobApplicationEntity(userId);
        app.setId(jobAppId);

        when(jobApplicationRepository.findById(jobAppId)).thenReturn(Optional.of(app));
        when(interviewRepository.findById(interviewId)).thenReturn(Optional.empty());

        assertThrows(IllegalStateException.class,
                () -> interviewService.deleteInterview(userId, jobAppId, interviewId));
    }
}
