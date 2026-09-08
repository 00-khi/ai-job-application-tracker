package com.khiancarasicas.sunset.repository;

import com.khiancarasicas.sunset.model.entity.JobApplication;
import com.khiancarasicas.sunset.model.enums.ApplicationStatus;
import com.khiancarasicas.sunset.model.enums.WorkMode;
import com.khiancarasicas.sunset.util.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
@ActiveProfiles("test")
class JobApplicationSpecificationTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @BeforeEach
    void setUp() {
        JobApplication app1 = TestDataFactory.createJobApplicationEntity(TestDataFactory.DEFAULT_USER_ID);
        app1.setCompany("Acme Corp");
        app1.setTitle("Software Engineer");
        app1.setStatus(ApplicationStatus.APPLIED);
        app1.setSource("LinkedIn");
        app1.setContactEmail("jane@acme.com");
        app1.setNotes("Great opportunity");
        app1.setTags("java,spring");
        entityManager.persist(app1);

        JobApplication app2 = TestDataFactory.createJobApplicationEntity(TestDataFactory.DEFAULT_USER_ID);
        app2.setCompany("Tech Startup");
        app2.setTitle("Backend Developer");
        app2.setStatus(ApplicationStatus.OFFER);
        app2.setSource("Indeed");
        app2.setContactEmail("hr@techstartup.com");
        app2.setNotes("Remote position");
        app2.setTags("python,django");
        entityManager.persist(app2);

        JobApplication app3 = TestDataFactory.createJobApplicationEntity(TestDataFactory.OTHER_USER_ID);
        app3.setCompany("Acme Corp");
        app3.setTitle("Frontend Developer");
        app3.setStatus(ApplicationStatus.APPLIED);
        entityManager.persist(app3);

        entityManager.flush();
        entityManager.clear();
    }

    @Test
    void build_filtersByUserId() {
        Specification<JobApplication> spec = JobApplicationSpecification.build(
                TestDataFactory.DEFAULT_USER_ID, null, null);

        Page<JobApplication> results = jobApplicationRepository.findAll(
                spec, PageRequest.of(0, 10));

        assertEquals(2, results.getTotalElements());
    }

    @Test
    void build_filtersByStatus() {
        Specification<JobApplication> spec = JobApplicationSpecification.build(
                TestDataFactory.DEFAULT_USER_ID, null, ApplicationStatus.OFFER);

        Page<JobApplication> results = jobApplicationRepository.findAll(
                spec, PageRequest.of(0, 10));

        assertEquals(1, results.getTotalElements());
        assertEquals("Tech Startup", results.getContent().get(0).getCompany());
    }

    @Test
    void build_searchByCompany() {
        Specification<JobApplication> spec = JobApplicationSpecification.build(
                TestDataFactory.DEFAULT_USER_ID, "acme", null);

        Page<JobApplication> results = jobApplicationRepository.findAll(
                spec, PageRequest.of(0, 10));

        assertEquals(1, results.getTotalElements());
        assertEquals("Acme Corp", results.getContent().get(0).getCompany());
    }

    @Test
    void build_searchByCompany_caseInsensitive() {
        Specification<JobApplication> spec = JobApplicationSpecification.build(
                TestDataFactory.DEFAULT_USER_ID, "ACME", null);

        Page<JobApplication> results = jobApplicationRepository.findAll(
                spec, PageRequest.of(0, 10));

        assertEquals(1, results.getTotalElements());
    }

    @Test
    void build_searchByTitle() {
        Specification<JobApplication> spec = JobApplicationSpecification.build(
                TestDataFactory.DEFAULT_USER_ID, "backend", null);

        Page<JobApplication> results = jobApplicationRepository.findAll(
                spec, PageRequest.of(0, 10));

        assertEquals(1, results.getTotalElements());
        assertEquals("Backend Developer", results.getContent().get(0).getTitle());
    }

    @Test
    void build_searchBySource() {
        Specification<JobApplication> spec = JobApplicationSpecification.build(
                TestDataFactory.DEFAULT_USER_ID, "linkedin", null);

        Page<JobApplication> results = jobApplicationRepository.findAll(
                spec, PageRequest.of(0, 10));

        assertEquals(1, results.getTotalElements());
    }

    @Test
    void build_searchByContactEmail() {
        Specification<JobApplication> spec = JobApplicationSpecification.build(
                TestDataFactory.DEFAULT_USER_ID, "jane@", null);

        Page<JobApplication> results = jobApplicationRepository.findAll(
                spec, PageRequest.of(0, 10));

        assertEquals(1, results.getTotalElements());
    }

    @Test
    void build_searchByNotes() {
        Specification<JobApplication> spec = JobApplicationSpecification.build(
                TestDataFactory.DEFAULT_USER_ID, "remote", null);

        Page<JobApplication> results = jobApplicationRepository.findAll(
                spec, PageRequest.of(0, 10));

        assertEquals(1, results.getTotalElements());
        assertEquals("Tech Startup", results.getContent().get(0).getCompany());
    }

    @Test
    void build_searchByTags() {
        Specification<JobApplication> spec = JobApplicationSpecification.build(
                TestDataFactory.DEFAULT_USER_ID, "django", null);

        Page<JobApplication> results = jobApplicationRepository.findAll(
                spec, PageRequest.of(0, 10));

        assertEquals(1, results.getTotalElements());
    }

    @Test
    void build_combinedSearchAndStatus() {
        Specification<JobApplication> spec = JobApplicationSpecification.build(
                TestDataFactory.DEFAULT_USER_ID, "acme", ApplicationStatus.APPLIED);

        Page<JobApplication> results = jobApplicationRepository.findAll(
                spec, PageRequest.of(0, 10));

        assertEquals(1, results.getTotalElements());
        assertEquals("Acme Corp", results.getContent().get(0).getCompany());
    }

    @Test
    void build_searchWithNoMatch_returnsEmpty() {
        Specification<JobApplication> spec = JobApplicationSpecification.build(
                TestDataFactory.DEFAULT_USER_ID, "nonexistent", null);

        Page<JobApplication> results = jobApplicationRepository.findAll(
                spec, PageRequest.of(0, 10));

        assertEquals(0, results.getTotalElements());
    }

    @Test
    void build_userIsolation_doesNotReturnOtherUsersApps() {
        Specification<JobApplication> spec = JobApplicationSpecification.build(
                TestDataFactory.DEFAULT_USER_ID, "acme", null);

        Page<JobApplication> results = jobApplicationRepository.findAll(
                spec, PageRequest.of(0, 10));

        results.getContent().forEach(app ->
                assertEquals(TestDataFactory.DEFAULT_USER_ID, app.getUserId()));
    }

    @Test
    void build_nullSearchAndNullStatus_returnsAllUserApps() {
        Specification<JobApplication> spec = JobApplicationSpecification.build(
                TestDataFactory.DEFAULT_USER_ID, null, null);

        Page<JobApplication> results = jobApplicationRepository.findAll(
                spec, PageRequest.of(0, 10));

        assertEquals(2, results.getTotalElements());
    }

    @Test
    void build_blankSearchIgnored() {
        Specification<JobApplication> spec = JobApplicationSpecification.build(
                TestDataFactory.DEFAULT_USER_ID, "   ", null);

        Page<JobApplication> results = jobApplicationRepository.findAll(
                spec, PageRequest.of(0, 10));

        assertEquals(2, results.getTotalElements());
    }
}
