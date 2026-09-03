package com.khiancarasicas.sunset.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

  @GetMapping("/api/public/test")
  public String publicTest() {
    return "Public endpoint works";
  }

  @GetMapping("/api/test")
  public String protectedTest(
      @AuthenticationPrincipal Jwt jwt) {

    String userId = jwt.getSubject();

    return "Authenticated user: " + userId;
  }
}