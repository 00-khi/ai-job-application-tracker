package com.khiancarasicas.sunset.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiService {

    private static final Logger logger = LoggerFactory.getLogger(AiService.class);

    private final ChatClient chatClient;

    public AiService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public String chat(String prompt) {
        logger.info("Sending prompt to AI: {}", prompt);
        String response = chatClient.prompt()
                .user(prompt)
                .call()
                .content();
        logger.info("Received AI response");
        return response;
    }
}
