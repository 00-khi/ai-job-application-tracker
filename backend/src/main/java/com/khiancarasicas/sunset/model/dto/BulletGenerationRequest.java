package com.khiancarasicas.sunset.model.dto;

import com.khiancarasicas.sunset.model.enums.BulletTone;
import com.khiancarasicas.sunset.model.enums.Seniority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record BulletGenerationRequest(
    @NotBlank(message = "Job title is required")
    String jobTitle,

    @NotNull(message = "Seniority is required")
    Seniority seniority,

    @NotEmpty(message = "Skills are required")
    List<String> skills,

    @NotBlank(message = "Achievements are required")
    String achievements,

    String existingBullets,

    @NotNull(message = "Tone is required")
    BulletTone tone
) {}
