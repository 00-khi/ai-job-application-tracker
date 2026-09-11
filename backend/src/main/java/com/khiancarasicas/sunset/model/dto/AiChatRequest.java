package com.khiancarasicas.sunset.model.dto;

import jakarta.validation.constraints.NotBlank;

public record AiChatRequest(
    @NotBlank(message = "Prompt is required")
    String prompt
) {}
