package com.khiancarasicas.sunset.controller;

import com.khiancarasicas.sunset.config.GlobalExceptionHandler;
import com.khiancarasicas.sunset.model.dto.InterviewRequest;
import com.khiancarasicas.sunset.model.dto.InterviewResponse;
import com.khiancarasicas.sunset.model.enums.InterviewStatus;
import com.khiancarasicas.sunset.model.enums.InterviewType;
import com.khiancarasicas.sunset.service.InterviewService;
import com.khiancarasicas.sunset.util.TestDataFactory;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(InterviewController.class)
@Import(GlobalExceptionHandler.class)
class InterviewControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private InterviewService interviewService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void create_validBody_returns201() throws Exception {
        InterviewRequest request = TestDataFactory.createMinimalInterviewRequest();
        Long jobAppId = 1L;

        InterviewResponse response = new InterviewResponse();
        response.setId(10L);
        response.setType(InterviewType.PHONE_SCREEN);
        response.setDate(request.getDate());
        response.setStatus(InterviewStatus.SCHEDULED);

        when(interviewService.createInterview(eq(TestDataFactory.DEFAULT_USER_ID), eq(jobAppId), any(InterviewRequest.class)))
                .thenReturn(response);

        mockMvc.perform(post("/api/job-applications/{jobAppId}/interviews", jobAppId)
                        .with(jwt().jwt(j -> j.header("alg", "none")
                                .claim("sub", TestDataFactory.DEFAULT_USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(10)))
                .andExpect(jsonPath("$.type", is("PHONE_SCREEN")))
                .andExpect(jsonPath("$.status", is("SCHEDULED")));
    }

    @Test
    void create_missingType_returns400() throws Exception {
        InterviewRequest request = new InterviewRequest();
        request.setDate(java.time.LocalDate.of(2025, 2, 1));
        request.setStatus(InterviewStatus.SCHEDULED);

        mockMvc.perform(post("/api/job-applications/{jobAppId}/interviews", 1L)
                        .with(jwt().jwt(j -> j.header("alg", "none")
                                .claim("sub", TestDataFactory.DEFAULT_USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.type", is("Interview type is required")));
    }

    @Test
    void create_missingDate_returns400() throws Exception {
        InterviewRequest request = new InterviewRequest();
        request.setType(InterviewType.TECHNICAL);
        request.setStatus(InterviewStatus.SCHEDULED);

        mockMvc.perform(post("/api/job-applications/{jobAppId}/interviews", 1L)
                        .with(jwt().jwt(j -> j.header("alg", "none")
                                .claim("sub", TestDataFactory.DEFAULT_USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.date", is("Date is required")));
    }

    @Test
    void create_missingStatus_returns400() throws Exception {
        InterviewRequest request = new InterviewRequest();
        request.setType(InterviewType.TECHNICAL);
        request.setDate(java.time.LocalDate.of(2025, 2, 1));

        mockMvc.perform(post("/api/job-applications/{jobAppId}/interviews", 1L)
                        .with(jwt().jwt(j -> j.header("alg", "none")
                                .claim("sub", TestDataFactory.DEFAULT_USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is("Status is required")));
    }

    @Test
    void create_emptyBody_returns400() throws Exception {
        mockMvc.perform(post("/api/job-applications/{jobAppId}/interviews", 1L)
                        .with(jwt().jwt(j -> j.header("alg", "none")
                                .claim("sub", TestDataFactory.DEFAULT_USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void update_validBody_returns200() throws Exception {
        InterviewRequest request = TestDataFactory.createMinimalInterviewRequest();
        Long jobAppId = 1L;
        Long interviewId = 10L;

        InterviewResponse response = new InterviewResponse();
        response.setId(interviewId);
        response.setType(InterviewType.PHONE_SCREEN);
        response.setStatus(InterviewStatus.COMPLETED);

        when(interviewService.updateInterview(eq(TestDataFactory.DEFAULT_USER_ID), eq(jobAppId), eq(interviewId), any(InterviewRequest.class)))
                .thenReturn(response);

        mockMvc.perform(put("/api/job-applications/{jobAppId}/interviews/{id}", jobAppId, interviewId)
                        .with(jwt().jwt(j -> j.header("alg", "none")
                                .claim("sub", TestDataFactory.DEFAULT_USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(10)))
                .andExpect(jsonPath("$.status", is("COMPLETED")));
    }

    @Test
    void delete_returns204() throws Exception {
        Long jobAppId = 1L;
        Long interviewId = 10L;

        mockMvc.perform(delete("/api/job-applications/{jobAppId}/interviews/{id}", jobAppId, interviewId)
                        .with(jwt().jwt(j -> j.header("alg", "none")
                                .claim("sub", TestDataFactory.DEFAULT_USER_ID))))
                .andExpect(status().isNoContent());

        verify(interviewService).deleteInterview(TestDataFactory.DEFAULT_USER_ID, jobAppId, interviewId);
    }

    @Test
    void create_withoutJwt_returns401() throws Exception {
        mockMvc.perform(post("/api/job-applications/{jobAppId}/interviews", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"type\":\"TECHNICAL\",\"date\":\"2025-02-01\",\"status\":\"SCHEDULED\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void create_withInvalidJwt_returns401() throws Exception {
        mockMvc.perform(post("/api/job-applications/{jobAppId}/interviews", 1L)
                        .header("Authorization", "Bearer invalid-token-value")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"type\":\"TECHNICAL\",\"date\":\"2025-02-01\",\"status\":\"SCHEDULED\"}"))
                .andExpect(status().isUnauthorized());
    }
}
