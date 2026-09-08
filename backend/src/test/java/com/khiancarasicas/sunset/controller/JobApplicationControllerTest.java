package com.khiancarasicas.sunset.controller;

import com.khiancarasicas.sunset.config.GlobalExceptionHandler;
import com.khiancarasicas.sunset.model.dto.JobApplicationRequest;
import com.khiancarasicas.sunset.model.dto.JobApplicationResponse;
import com.khiancarasicas.sunset.model.dto.JobApplicationStatsResponse;
import com.khiancarasicas.sunset.model.dto.PaginatedResponse;
import com.khiancarasicas.sunset.model.enums.ApplicationStatus;
import com.khiancarasicas.sunset.service.JobApplicationService;
import com.khiancarasicas.sunset.util.TestDataFactory;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.util.Collections;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(JobApplicationController.class)
@Import(GlobalExceptionHandler.class)
class JobApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JobApplicationService jobApplicationService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void list_returnsPaginatedResponse() throws Exception {
        JobApplicationResponse appResponse = new JobApplicationResponse();
        appResponse.setId(1L);
        appResponse.setCompany("Acme Corp");
        appResponse.setTitle("Engineer");

        PaginatedResponse<JobApplicationResponse> paginatedResponse =
                PaginatedResponse.of(List.of(appResponse), 0, 10, 1, 1);

        when(jobApplicationService.search(eq(TestDataFactory.DEFAULT_USER_ID), any()))
                .thenReturn(paginatedResponse);

        mockMvc.perform(get("/api/job-applications")
                        .with(jwt().jwt(j -> j.header("alg", "none")
                                .claim("sub", TestDataFactory.DEFAULT_USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].company", is("Acme Corp")))
                .andExpect(jsonPath("$.page", is(0)))
                .andExpect(jsonPath("$.totalElements", is(1)));
    }

    @Test
    void list_withSearchParam_passesToService() throws Exception {
        PaginatedResponse<JobApplicationResponse> emptyResponse =
                PaginatedResponse.of(Collections.emptyList(), 0, 10, 0, 0);

        when(jobApplicationService.search(eq(TestDataFactory.DEFAULT_USER_ID), any()))
                .thenReturn(emptyResponse);

        mockMvc.perform(get("/api/job-applications")
                        .with(jwt().jwt(j -> j.header("alg", "none")
                                .claim("sub", TestDataFactory.DEFAULT_USER_ID)))
                        .param("search", "acme")
                        .param("status", "APPLIED")
                        .param("page", "0")
                        .param("size", "5")
                        .param("sortBy", "company")
                        .param("sortDirection", "asc"))
                .andExpect(status().isOk());

        verify(jobApplicationService).search(eq(TestDataFactory.DEFAULT_USER_ID), any());
    }

    @Test
    void getById_returnsJobApplication() throws Exception {
        JobApplicationResponse response = new JobApplicationResponse();
        response.setId(1L);
        response.setCompany("Acme Corp");
        response.setTitle("Engineer");

        when(jobApplicationService.getById(TestDataFactory.DEFAULT_USER_ID, 1L)).thenReturn(response);

        mockMvc.perform(get("/api/job-applications/1")
                        .with(jwt().jwt(j -> j.header("alg", "none")
                                .claim("sub", TestDataFactory.DEFAULT_USER_ID))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.company", is("Acme Corp")));
    }

    @Test
    void create_validBody_returns201() throws Exception {
        JobApplicationRequest request = TestDataFactory.createMinimalJobApplicationRequest();

        JobApplicationResponse response = new JobApplicationResponse();
        response.setId(1L);
        response.setCompany("Tech Startup");
        response.setTitle("Backend Developer");
        response.setCurrency("USD");
        response.setStatus(ApplicationStatus.SAVED);

        when(jobApplicationService.create(eq(TestDataFactory.DEFAULT_USER_ID), any(JobApplicationRequest.class)))
                .thenReturn(response);

        mockMvc.perform(post("/api/job-applications")
                        .with(jwt().jwt(j -> j.header("alg", "none")
                                .claim("sub", TestDataFactory.DEFAULT_USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.company", is("Tech Startup")));
    }

    @Test
    void create_missingCompany_returns400() throws Exception {
        JobApplicationRequest request = new JobApplicationRequest();
        request.setTitle("Engineer");

        mockMvc.perform(post("/api/job-applications")
                        .with(jwt().jwt(j -> j.header("alg", "none")
                                .claim("sub", TestDataFactory.DEFAULT_USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.company", is("Company is required")));
    }

    @Test
    void create_missingTitle_returns400() throws Exception {
        JobApplicationRequest request = new JobApplicationRequest();
        request.setCompany("Acme");

        mockMvc.perform(post("/api/job-applications")
                        .with(jwt().jwt(j -> j.header("alg", "none")
                                .claim("sub", TestDataFactory.DEFAULT_USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title", is("Title is required")));
    }

    @Test
    void create_emptyBody_returns400() throws Exception {
        mockMvc.perform(post("/api/job-applications")
                        .with(jwt().jwt(j -> j.header("alg", "none")
                                .claim("sub", TestDataFactory.DEFAULT_USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void update_validBody_returns200() throws Exception {
        JobApplicationRequest request = TestDataFactory.createMinimalJobApplicationRequest();

        JobApplicationResponse response = new JobApplicationResponse();
        response.setId(1L);
        response.setCompany("Tech Startup");
        response.setTitle("Backend Developer");

        when(jobApplicationService.update(eq(TestDataFactory.DEFAULT_USER_ID), eq(1L), any(JobApplicationRequest.class)))
                .thenReturn(response);

        mockMvc.perform(put("/api/job-applications/1")
                        .with(jwt().jwt(j -> j.header("alg", "none")
                                .claim("sub", TestDataFactory.DEFAULT_USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)));
    }

    @Test
    void delete_returns204() throws Exception {
        mockMvc.perform(delete("/api/job-applications/1")
                        .with(jwt().jwt(j -> j.header("alg", "none")
                                .claim("sub", TestDataFactory.DEFAULT_USER_ID))))
                .andExpect(status().isNoContent());

        verify(jobApplicationService).delete(TestDataFactory.DEFAULT_USER_ID, 1L);
    }

    @Test
    void getStats_returnsStatsResponse() throws Exception {
        JobApplicationStatsResponse stats = JobApplicationStatsResponse.builder()
                .total(10)
                .totalInterviews(5)
                .offers(2)
                .rejected(1)
                .byStatus(java.util.Map.of("APPLIED", 5L, "OFFER", 2L))
                .build();

        when(jobApplicationService.getStats(TestDataFactory.DEFAULT_USER_ID)).thenReturn(stats);

        mockMvc.perform(get("/api/job-applications/stats")
                        .with(jwt().jwt(j -> j.header("alg", "none")
                                .claim("sub", TestDataFactory.DEFAULT_USER_ID))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total", is(10)))
                .andExpect(jsonPath("$.totalInterviews", is(5)))
                .andExpect(jsonPath("$.offers", is(2)))
                .andExpect(jsonPath("$.rejected", is(1)));
    }

    @Test
    void list_withoutJwt_returns401() throws Exception {
        mockMvc.perform(get("/api/job-applications")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void list_withInvalidJwt_returns401() throws Exception {
        mockMvc.perform(get("/api/job-applications")
                        .header("Authorization", "Bearer invalid-token-value")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }
}
