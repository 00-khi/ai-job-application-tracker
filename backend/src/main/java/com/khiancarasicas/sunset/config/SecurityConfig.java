package com.khiancarasicas.sunset.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(
      HttpSecurity http) throws Exception {

    http
        .csrf(AbstractHttpConfigurer::disable)

        .cors(cors -> {
        })

        .authorizeHttpRequests(auth -> auth

            // Allow CORS preflight requests
            .requestMatchers(
                org.springframework.http.HttpMethod.OPTIONS,
                "/**")
            .permitAll()

            // Public endpoints
            .requestMatchers("/api/public/**").permitAll()

            // Health check endpoint
            .requestMatchers("/actuator/health").permitAll()

            // Swagger UI and API docs
            .requestMatchers(
                "/swagger-ui/**",
                "/swagger-ui.html",
                "/api-docs/**",
                "/v3/api-docs/**")
            .permitAll()

            // All other requests require authentication
            .anyRequest().authenticated())

        .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> {
        }));

    return http.build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource(
      @Value("${frontend.url}") String frontendUrl) {

    CorsConfiguration configuration = new CorsConfiguration();

    configuration.setAllowedOrigins(
        List.of(frontendUrl));

    configuration.setAllowedMethods(
        List.of(
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"));

    configuration.setAllowedHeaders(
        List.of(
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"));

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

    source.registerCorsConfiguration(
        "/**",
        configuration);

    return source;
  }
}