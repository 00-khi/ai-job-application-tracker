package com.khiancarasicas.sunset.controller;

import com.khiancarasicas.sunset.model.dto.BulletGenerationRequest;
import com.khiancarasicas.sunset.model.dto.BulletGenerationResponse;
import com.khiancarasicas.sunset.service.AiService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/bullets")
    public ResponseEntity<BulletGenerationResponse> generateBullets(
            @Valid @RequestBody BulletGenerationRequest request) {
        BulletGenerationResponse response = aiService.generateBullets(request);
        return ResponseEntity.ok(response);
    }
}
