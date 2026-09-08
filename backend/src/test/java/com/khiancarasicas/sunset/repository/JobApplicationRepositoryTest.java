package com.khiancarasicas.sunset.repository;

import com.khiancarasicas.sunset.model.entity.Interview;
import com.khiancarasicas.sunset.model.entity.JobApplication;
import com.khiancarasicas.sunset.model.enums.*;
import com.khiancarasicas.sunset.util.TestDataFactory;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@DataJpaTest
@ActiveProfiles("test")
class JobApplicationRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Test
    void findByUserIdWithInterviews_returnsApplicationsWithInterviews() {
        JobApplication app = TestDataFactory.createJobApplicationEntity(TestDataFactory.DEFAULT_USER_ID);
        entityManager.persistAndFlush(app);

        Interview interview = TestDataFactory.createInterviewEntity(app);
        entityManager.persistAndFlush(interview);

        entityManager.clear();

        List<JobApplication> results = jobApplicationRepository.findByUserIdWithInterviews(TestDataFactory.DEFAULT_USER_ID);

        assertEquals(1, results.size());
        assertEquals(1, results.get(0).getInterviews().size());
    }

    @Test
    void findByUserIdWithInterviews_noInterviews_returnsEmptyInterviewList() {
        JobApplication app = TestDataFactory.createJobApplicationEntity(TestDataFactory.DEFAULT_USER_ID);
        app.setInterviews(null);
        entityManager.persistAndFlush(app);

        entityManager.clear();

        List<JobApplication> results = jobApplicationRepository.findByUserIdWithInterviews(TestDataFactory.DEFAULT_USER_ID);

        assertEquals(1, results.size());
    }

    @Test
    void findByUserIdWithInterviews_isolatesByUser() {
        JobApplication user1App = TestDataFactory.createJobApplicationEntity(TestDataFactory.DEFAULT_USER_ID);
        entityManager.persistAndFlush(user1App);

        JobApplication user2App = TestDataFactory.createJobApplicationEntity(TestDataFactory.OTHER_USER_ID);
        entityManager.persistAndFlush(user2App);

        entityManager.clear();

        List<JobApplication> user1Results = jobApplicationRepository.findByUserIdWithInterviews(TestDataFactory.DEFAULT_USER_ID);
        List<JobApplication> user2Results = jobApplicationRepository.findByUserIdWithInterviews(TestDataFactory.OTHER_USER_ID);

        assertEquals(1, user1Results.size());
        assertEquals(1, user2Results.size());
        assertEquals(TestDataFactory.DEFAULT_USER_ID, user1Results.get(0).getUserId());
        assertEquals(TestDataFactory.OTHER_USER_ID, user2Results.get(0).getUserId());
    }

    @Test
    void findByUserIdAndStatus_filtersCorrectly() {
        JobApplication app1 = TestDataFactory.createJobApplicationEntity(TestDataFactory.DEFAULT_USER_ID);
        app1.setStatus(ApplicationStatus.APPLIED);
        entityManager.persistAndFlush(app1);

        JobApplication app2 = TestDataFactory.createJobApplicationEntity(TestDataFactory.DEFAULT_USER_ID);
        app2.setStatus(ApplicationStatus.OFFER);
        entityManager.persistAndFlush(app2);

        entityManager.clear();

        List<JobApplication> appliedApps = jobApplicationRepository.findByUserIdAndStatus(
                TestDataFactory.DEFAULT_USER_ID, ApplicationStatus.APPLIED);

        assertEquals(1, appliedApps.size());
        assertEquals(ApplicationStatus.APPLIED, appliedApps.get(0).getStatus());
    }

    @Test
    void findByUserIdAndStatus_noMatch_returnsEmpty() {
        JobApplication app = TestDataFactory.createJobApplicationEntity(TestDataFactory.DEFAULT_USER_ID);
        app.setStatus(ApplicationStatus.APPLIED);
        entityManager.persistAndFlush(app);

        entityManager.clear();

        List<JobApplication> rejectedApps = jobApplicationRepository.findByUserIdAndStatus(
                TestDataFactory.DEFAULT_USER_ID, ApplicationStatus.REJECTED);

        assertEquals(0, rejectedApps.size());
    }

    @Test
    void findAll_withPagination_returnsCorrectPage() {
        for (int i = 0; i < 15; i++) {
            JobApplication app = TestDataFactory.createJobApplicationEntity(TestDataFactory.DEFAULT_USER_ID);
            app.setCompany("Company " + i);
            entityManager.persist(app);
        }
        entityManager.flush();
        entityManager.clear();

        Page<JobApplication> page = jobApplicationRepository.findAll(
                PageRequest.of(0, 5, Sort.by("company").ascending()));

        assertEquals(5, page.getContent().size());
        assertEquals(15, page.getTotalElements());
        assertEquals(3, page.getTotalPages());
    }

    @Test
    void save_setsCreatedAtAndUpdatedAt() {
        JobApplication app = TestDataFactory.createJobApplicationEntity(TestDataFactory.DEFAULT_USER_ID);
        entityManager.persistAndFlush(app);

        assertNotNull(app.getCreatedAt());
        assertNotNull(app.getUpdatedAt());
    }

    @Test
    void save_withInterviews_cascades() {
        JobApplication app = TestDataFactory.createJobApplicationEntity(TestDataFactory.DEFAULT_USER_ID);
        entityManager.persist(app);

        Interview interview1 = TestDataFactory.createInterviewEntity(app);
        entityManager.persist(interview1);

        Interview interview2 = TestDataFactory.createInterviewEntity(app);
        interview2.setType(InterviewType.BEHAVIORAL);
        entityManager.persist(interview2);

        entityManager.flush();
        entityManager.clear();

        JobApplication found = entityManager.find(JobApplication.class, app.getId());
        assertEquals(2, found.getInterviews().size());
    }
}
