package com.khiancarasicas.sunset.controller;

import com.khiancarasicas.sunset.config.GlobalExceptionHandler;
import com.khiancarasicas.sunset.model.dto.BulletGenerationRequest;
import com.khiancarasicas.sunset.model.dto.BulletGenerationResponse;
import com.khiancarasicas.sunset.model.enums.BulletTone;
import com.khiancarasicas.sunset.model.enums.Seniority;
import com.khiancarasicas.sunset.service.AiService;
import com.khiancarasicas.sunset.util.TestDataFactory;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AiController.class)
@ActiveProfiles("test")
@Import(GlobalExceptionHandler.class)
class AiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AiService aiService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void generateBullets_validRequest_returns200() throws Exception {
        BulletGenerationRequest request = TestDataFactory.createBulletGenerationRequest();

        BulletGenerationResponse response = new BulletGenerationResponse(List.of(
                "Built a caching layer that reduced API latency by 40%",
                "Designed and implemented a job queue processing 10K daily tasks",
                "Led PostgreSQL query optimization cutting database load by 30%"
        ));

        when(aiService.generateBullets(any(BulletGenerationRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/ai/bullets")
                        .with(jwt().jwt(j -> j.header("alg", "none")
                                .claim("sub", TestDataFactory.DEFAULT_USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bullets", hasSize(3)))
                .andExpect(jsonPath("$.bullets[0]", containsString("caching")))
                .andExpect(jsonPath("$.bullets[1]", containsString("queue")))
                .andExpect(jsonPath("$.bullets[2]", containsString("PostgreSQL")));
    }

    @Test
    void generateBullets_missingJobTitle_returns400() throws Exception {
        BulletGenerationRequest request = new BulletGenerationRequest(
                null,
                Seniority.SENIOR,
                List.of("Java"),
                "Built something great",
                null,
                BulletTone.IMPACT
        );

        mockMvc.perform(post("/api/ai/bullets")
                        .with(jwt().jwt(j -> j.header("alg", "none")
                                .claim("sub", TestDataFactory.DEFAULT_USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.jobTitle", is("Job title is required")));
    }

    @Test
    void generateBullets_missingSeniority_returns400() throws Exception {
        BulletGenerationRequest request = new BulletGenerationRequest(
                "Software Engineer",
                null,
                List.of("Java"),
                "Built something great",
                null,
                BulletTone.IMPACT
        );

        mockMvc.perform(post("/api/ai/bullets")
                        .with(jwt().jwt(j -> j.header("alg", "none")
                                .claim("sub", TestDataFactory.DEFAULT_USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.seniority", is("Seniority is required")));
    }

    @Test
    void generateBullets_missingSkills_returns400() throws Exception {
        BulletGenerationRequest request = new BulletGenerationRequest(
                "Software Engineer",
                Seniority.SENIOR,
                null,
                "Built something great",
                null,
                BulletTone.IMPACT
        );

        mockMvc.perform(post("/api/ai/bullets")
                        .with(jwt().jwt(j -> j.header("alg", "none")
                                .claim("sub", TestDataFactory.DEFAULT_USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.skills", is("Skills are required")));
    }

    @Test
    void generateBullets_missingAchievements_returns400() throws Exception {
        BulletGenerationRequest request = new BulletGenerationRequest(
                "Software Engineer",
                Seniority.SENIOR,
                List.of("Java"),
                null,
                null,
                BulletTone.IMPACT
        );

        mockMvc.perform(post("/api/ai/bullets")
                        .with(jwt().jwt(j -> j.header("alg", "none")
                                .claim("sub", TestDataFactory.DEFAULT_USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.achievements", is("Achievements are required")));
    }

    @Test
    void generateBullets_missingTone_returns400() throws Exception {
        BulletGenerationRequest request = new BulletGenerationRequest(
                "Software Engineer",
                Seniority.SENIOR,
                List.of("Java"),
                "Built something great",
                null,
                null
        );

        mockMvc.perform(post("/api/ai/bullets")
                        .with(jwt().jwt(j -> j.header("alg", "none")
                                .claim("sub", TestDataFactory.DEFAULT_USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.tone", is("Tone is required")));
    }

    @Test
    void generateBullets_emptyBody_returns400() throws Exception {
        mockMvc.perform(post("/api/ai/bullets")
                        .with(jwt().jwt(j -> j.header("alg", "none")
                                .claim("sub", TestDataFactory.DEFAULT_USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void generateBullets_withoutJwt_returns403() throws Exception {
        mockMvc.perform(post("/api/ai/bullets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isForbidden());
    }
}
