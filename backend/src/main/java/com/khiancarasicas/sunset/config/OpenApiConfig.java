package com.khiancarasicas.sunset.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

  @Bean
  public OpenAPI openAPI() {
    return new OpenAPI()
        .info(
            new Info()
                .title("Sunset API")
                .description(
                    "AI Job Application Tracker - REST API for managing job applications and interviews")
                .version("0.0.1-SNAPSHOT")
                .contact(
                    new Contact()
                        .name("Sunset Team")))
        .schemaRequirement(
            "bearer-jwt",
            new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT"))
        .addSecurityItem(
            new SecurityRequirement().addList("bearer-jwt"));
  }
}
