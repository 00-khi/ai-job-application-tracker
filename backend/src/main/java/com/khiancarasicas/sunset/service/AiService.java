package com.khiancarasicas.sunset.service;

import com.khiancarasicas.sunset.model.dto.BulletGenerationRequest;
import com.khiancarasicas.sunset.model.dto.BulletGenerationResponse;
import com.khiancarasicas.sunset.model.dto.JobFitRequest;
import com.khiancarasicas.sunset.model.dto.JobFitResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Service
public class AiService {

    private static final Logger logger = LoggerFactory.getLogger(AiService.class);

    private final ChatClient chatClient;
    private final String bulletGenerationSystemPrompt;
    private final String jobFitSystemPrompt;

    public AiService(ChatClient.Builder chatClientBuilder) throws IOException {
        this.chatClient = chatClientBuilder.build();
        this.bulletGenerationSystemPrompt = new ClassPathResource("prompts/bullet-generation.st")
                .getContentAsString(StandardCharsets.UTF_8);
        this.jobFitSystemPrompt = new ClassPathResource("prompts/job-fit.st")
                .getContentAsString(StandardCharsets.UTF_8);
    }

    public BulletGenerationResponse generateBullets(BulletGenerationRequest request) {
        logger.info("Generating bullets for jobTitle={}, seniority={}, tone={}",
                request.jobTitle(), request.seniority(), request.tone());

        String userPrompt = buildBulletUserPrompt(request);

        try {
            BulletGenerationResponse response = chatClient.prompt()
                    .system(bulletGenerationSystemPrompt)
                    .user(userPrompt)
                    .call()
                    .entity(BulletGenerationResponse.class, spec -> spec.validateSchema());

            logger.info("Generated {} bullets", response.bullets().size());
            return response;
        } catch (Exception e) {
            logger.error("AI generation failed - prompt: {}", userPrompt, e);
            throw new RuntimeException("Failed to generate bullets: " + e.getMessage(), e);
        }
    }

    public JobFitResponse analyzeJobFit(JobFitRequest request) {
        logger.info("Analyzing job fit: strictness={}, resumeChars={}, jobDescriptionChars={}",
                request.strictness(), request.resume().length(), request.jobDescription().length());

        String userPrompt = buildJobFitUserPrompt(request);

        try {
            JobFitResponse response = chatClient.prompt()
                    .system(jobFitSystemPrompt)
                    .user(userPrompt)
                    .call()
                    .entity(JobFitResponse.class, spec -> spec.validateSchema());

            logger.info("Job fit analysis complete: overallScore={}", response.overallScore());
            return response;
        } catch (Exception e) {
            logger.error("Job fit analysis failed: resumeChars={}, jobDescriptionChars={}",
                    request.resume().length(), request.jobDescription().length(), e);
            throw new RuntimeException("Failed to analyze job fit: " + e.getMessage(), e);
        }
    }

    private String buildBulletUserPrompt(BulletGenerationRequest request) {
        StringBuilder sb = new StringBuilder();
        sb.append("Generate 3 resume bullet points for the following:\n\n");
        sb.append("Job Title: ").append(request.jobTitle()).append("\n");
        sb.append("Seniority: ").append(request.seniority()).append("\n");
        sb.append("Skills: ").append(String.join(", ", request.skills())).append("\n");
        sb.append("Achievements/Context: ").append(request.achievements()).append("\n");
        sb.append("Desired Tone: ").append(request.tone()).append("\n");

        if (request.existingBullets() != null && !request.existingBullets().isBlank()) {
            sb.append("Existing Bullets to Improve: ").append(request.existingBullets()).append("\n");
        }

        return sb.toString();
    }

    private String buildJobFitUserPrompt(JobFitRequest request) {
        StringBuilder sb = new StringBuilder();
        sb.append("Analyze the fit between this resume and this job description.\n\n");
        sb.append("Strictness: ").append(request.strictness()).append("\n");
        sb.append("=== RESUME ===\n");
        sb.append(request.resume()).append("\n\n");
        sb.append("=== JOB DESCRIPTION ===\n");
        sb.append(request.jobDescription()).append("\n");

        return sb.toString();
    }
}
