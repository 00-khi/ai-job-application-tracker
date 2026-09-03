package com.khiancarasicas.sunset.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Configuration
public class SecurityConfig {

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

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

            // Public authentication endpoints
            .requestMatchers("/api/auth/**").permitAll()

            // Public health check endpoint
            .requestMatchers("/actuator/health").permitAll()

            // All other requests require authentication
            .anyRequest().authenticated())

        .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> {
        }));

    return http.build();
  }

  @Bean
  public JwtDecoder jwtDecoder(
      @Value("${jwt.secret}") String secret) {

    SecretKey key = new SecretKeySpec(
        secret.getBytes(StandardCharsets.UTF_8),
        "HmacSHA256");

    return NimbusJwtDecoder
        .withSecretKey(key)
        .macAlgorithm(MacAlgorithm.HS256)
        .build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource(@Value("${frontend.url}") String frontendUrl) {

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
        List.of("*"));

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

    source.registerCorsConfiguration(
        "/**",
        configuration);

    return source;
  }
}