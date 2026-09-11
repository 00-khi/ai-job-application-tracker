# AI Feature Implementation Guide

This document explains how to add new AI features to the backend. Follow this pattern exactly — it is the established convention for this project.

---

## Architecture

| Component | Technology | Details |
|-----------|-----------|---------|
| Framework | Spring AI 2.0.0 | Uses `ChatClient` as the primary API |
| Provider | NVIDIA NIM | OpenAI-compatible API at `integrate.api.nvidia.com/v1` |
| Model | `deepseek-ai/deepseek-v4-flash-0731` | Free, 1M context, reliable |
| Output | Structured (typed records) | `.entity(Class, spec -> spec.validateSchema())` |

### How It Works

```
Request DTO → Controller → Service → ChatClient → NVIDIA API → Structured Response
                                                              ↓
                                                     .entity(ResponseRecord.class)
                                                     validates JSON against schema
                                                     auto-retries up to 3x on failure
```

The AI returns **typed Java records**, not plain text. Spring AI generates a JSON schema from your record, sends it to the model, and deserializes the response automatically.

### Configuration

```yaml
# application.yaml
spring:
  ai:
    model:
      chat: openai
      embedding: none
    openai:
      api-key: ${NVIDIA_API_KEY}
      base-url: https://integrate.api.nvidia.com/v1   # Must include /v1
      chat:
        model: deepseek-ai/deepseek-v4-flash-0731
        max-tokens: 2048                               # Required by NVIDIA
        options:
          temperature: 0.7
```

---

## Adding a New AI Feature

Every AI feature follows this exact file structure:

```
backend/src/main/java/com/khiancarasicas/sunset/
├── model/
│   ├── enums/
│   │   └── NewEnum.java              (if feature needs enums)
│   └── dto/
│       ├── NewFeatureRequest.java     (input)
│       └── NewFeatureResponse.java    (output)
├── service/
│   └── AiService.java                (add method here)
├── controller/
│   └── AiController.java             (add endpoint here)

backend/src/main/resources/prompts/
└── new-feature.st                     (system prompt)
```

### Step 1: Create Enums (if needed)

Only if the feature has fixed choices. Otherwise use `String`.

```java
// model/enums/NewEnum.java
package com.khiancarasicas.sunset.model.enums;

public enum NewEnum {
    VALUE_ONE,
    VALUE_TWO,
    VALUE_THREE
}
```

### Step 2: Create Request Record

Use Java records with Jakarta validation. Validation messages must follow `"<FieldName> is required"` pattern.

```java
// model/dto/NewFeatureRequest.java
package com.khiancarasicas.sunset.model.dto;

import com.khiancarasicas.sunset.model.enums.NewEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record NewFeatureRequest(
    @NotBlank(message = "Field name is required")
    String fieldName,

    @NotNull(message = "Enum field is required")
    NewEnum enumField,

    @NotEmpty(message = "List field is required")
    List<String> listField,

    String optionalField
) {}
```

**Validation annotations:**
| Annotation | Use for |
|------------|---------|
| `@NotBlank` | Non-empty strings |
| `@NotNull` | Required objects/enums |
| `@NotEmpty` | Required lists (not null, not empty) |

### Step 3: Create Response Record

The response **must be a record** — OpenAI's structured output API does not accept top-level arrays. Wrap lists in a record.

```java
// model/dto/NewFeatureResponse.java
package com.khiancarasicas.sunset.model.dto;

import java.util.List;

public record NewFeatureResponse(
    List<String> results
) {}
```

### Step 4: Create System Prompt

Save as `.st` file in `resources/prompts/`. This defines the AI's role, output format, and constraints.

```
// resources/prompts/new-feature.st
You are an expert in [domain].

Your task is to [what the AI should do].

## Guidelines

- Rule 1
- Rule 2
- Rule 3

## Output Format

- Must return exactly N results
- Each result should be [description]
```

### Step 5: Add Method to AiService

```java
// service/AiService.java — add this method

public NewFeatureResponse generateNewFeature(NewFeatureRequest request) {
    logger.info("Processing new feature request: {}", request.fieldName());

    String userPrompt = buildNewFeaturePrompt(request);

    NewFeatureResponse response = chatClient.prompt()
            .system(newFeatureSystemPrompt)       // loaded from .st file
            .user(userPrompt)                      // built from request fields
            .call()
            .entity(NewFeatureResponse.class, spec -> spec.validateSchema());

    logger.info("Generated {} results", response.results().size());
    return response;
}

private String buildNewFeaturePrompt(NewFeatureRequest request) {
    StringBuilder sb = new StringBuilder();
    sb.append("Task description:\n\n");
    sb.append("Field: ").append(request.fieldName()).append("\n");
    sb.append("Type: ").append(request.enumField()).append("\n");
    sb.append("Items: ").append(String.join(", ", request.listField())).append("\n");

    if (request.optionalField() != null && !request.optionalField().isBlank()) {
        sb.append("Additional context: ").append(request.optionalField()).append("\n");
    }

    return sb.toString();
}
```

**Loading the system prompt** — add this to the constructor:

```java
private final String newFeatureSystemPrompt;

public AiService(ChatClient.Builder chatClientBuilder) throws IOException {
    this.chatClient = chatClientBuilder.build();
    // Load system prompts from .st files
    this.newFeatureSystemPrompt = new ClassPathResource("prompts/new-feature.st")
            .getContentAsString(StandardCharsets.UTF_8);
}
```

### Step 6: Add Endpoint to AiController

```java
// controller/AiController.java — add this method

@PostMapping("/new-feature")
public ResponseEntity<NewFeatureResponse> newFeature(
        @Valid @RequestBody NewFeatureRequest request) {
    NewFeatureResponse response = aiService.generateNewFeature(request);
    return ResponseEntity.ok(response);
}
```

---

## Structured Output Rules

### Why `.entity()` instead of `.content()`

| Method | Returns | Use case |
|--------|---------|----------|
| `.content()` | `String` | Plain text, no structure needed |
| `.entity(Class)` | Typed record | Structured data with validation |
| `.entity(Class, spec -> spec.validateSchema())` | Typed record with retry | Production use — auto-retries on malformed JSON |

### Always use `validateSchema()`

```java
// CORRECT — retries up to 3x if JSON doesn't match schema
chatClient.prompt()
    .system(systemPrompt)
    .user(userPrompt)
    .call()
    .entity(ResponseRecord.class, spec -> spec.validateSchema());

// WRONG — no retry on malformed output
chatClient.prompt()
    .system(systemPrompt)
    .user(userPrompt)
    .call()
    .entity(ResponseRecord.class);
```

### Response must be a record, not a raw list

```java
// CORRECT
public record MyResponse(List<String> items) {}

// WRONG — OpenAI structured output rejects top-level arrays
// public record MyResponse(List<String>) {}  // NO
```

---

## Prompt Guidelines

### System Prompt (`.st` file)

- Defines the AI's **role** ("You are an expert...")
- Defines the **task** ("Your task is to...")
- Lists **constraints** (bullet count, format, length)
- Defines **terminology** (what each enum value means)
- Should be **static** — no template variables

### User Prompt (built in service)

- Contains the **actual data** from the request
- Built as a string from request fields
- Can include conditional sections (e.g., existing bullets)

### Template Variables (optional)

If the prompt needs dynamic values, use `{variable}` syntax with `PromptTemplate`:

```java
PromptTemplate template = new PromptTemplate(systemPrompt);
String rendered = template.render(Map.of("variable", value));
```

---

## Working Example: Bullet Generation

### Request

```json
POST /api/ai/bullets
{
  "jobTitle": "Senior Backend Developer",
  "seniority": "SENIOR",
  "skills": ["Java", "Spring Boot", "PostgreSQL"],
  "achievements": "Led migration from monolith to microservices",
  "tone": "IMPACT"
}
```

### Response

```json
{
  "bullets": [
    "Architected and led monolith-to-microservices migration serving 2M+ daily requests",
    "Optimized API response times by 40% through query refactoring and caching",
    "Spearheaded backend modernization reducing deployment time from hours to minutes"
  ]
}
```

### Files Created

| File | Purpose |
|------|---------|
| `model/enums/Seniority.java` | `JUNIOR`, `MID_LEVEL`, `SENIOR`, `PRINCIPAL` |
| `model/enums/BulletTone.java` | `IMPACT`, `STAR`, `TECHNICAL`, `LEADERSHIP`, `QUANTITATIVE`, `COLLABORATIVE`, `INNOVATION` |
| `model/dto/BulletGenerationRequest.java` | Request record with validation |
| `model/dto/BulletGenerationResponse.java` | Response record with `List<String> bullets` |
| `prompts/bullet-generation.st` | System prompt defining AI role and output rules |
| `service/AiService.java` | `generateBullets()` method |
| `controller/AiController.java` | `POST /api/ai/bullets` endpoint |

---

## Common Pitfalls

| Issue | Cause | Fix |
|-------|-------|-----|
| 404 from NVIDIA | Base URL missing `/v1` | Set `base-url: https://integrate.api.nvidia.com/v1` |
| Server error from NVIDIA | `max-tokens` not set | Add `spring.ai.openai.chat.max-tokens: 2048` |
| 404 on model name | Wrong model slug | Verify exact slug at build.nvidia.com |
| JSON parse error | Top-level array in response | Wrap in a record: `record Response(List<String> items) {}` |
| Validation not triggering | Missing `@Valid` on controller param | Add `@Valid @RequestBody` |
| `ClassPathResource` not found | File not in `src/main/resources/prompts/` | Check path matches exactly |

---

## Dependencies

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-starter-model-openai</artifactId>
</dependency>
```

BOM managed in `<dependencyManagement>`:
```xml
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-bom</artifactId>
    <version>2.0.0</version>
    <type>pom</type>
    <scope>import</scope>
</dependency>
```
