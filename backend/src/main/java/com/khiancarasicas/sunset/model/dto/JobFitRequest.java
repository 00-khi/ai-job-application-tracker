package com.khiancarasicas.sunset.model.dto;

import com.khiancarasicas.sunset.model.enums.Strictness;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record JobFitRequest(
    @NotBlank(message = "Resume is required")
    String resume,

    @NotBlank(message = "Job description is required")
    String jobDescription,

    @NotNull(message = "Strictness is required")
    Strictness strictness
) {}
