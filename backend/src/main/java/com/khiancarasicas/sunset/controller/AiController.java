package com.khiancarasicas.sunset.controller;

import com.khiancarasicas.sunset.model.dto.AiChatRequest;
import com.khiancarasicas.sunset.model.dto.AiChatResponse;
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

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(@Valid @RequestBody AiChatRequest request) {
        String response = aiService.chat(request.prompt());
        return ResponseEntity.ok(new AiChatResponse(response));
    }
}
