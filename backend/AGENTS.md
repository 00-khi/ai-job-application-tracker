# CRITICAL RULES - MUST FOLLOW

## RESPONSES

- Keep responses concise and to the point - unless the user asks otherwise

## PROJECT STRUCTURE

This project is a Spring Boot Java application.

Use the following structure as the **preferred project/package organization**. When creating, modifying, or suggesting files, follow this structure unless the user explicitly requests a different organization.

```text
src/
└── main/
    └── java/
        └── <base-package>/
            └── sunset/
                ├── SunsetApplication.java
                ├── config/
                ├── controller/
├── model/
│   ├── dto/
│   ├── enums/
│   └── entity/
                └── service/
```

### Package Responsibilities

- `SunsetApplication.java`
  - Main Spring Boot application entry point.
  - Keep the `@SpringBootApplication` class here.

- `config/`
  - Spring configuration classes.
  - Security configuration, application configuration, bean definitions, WebMVC configuration, etc.

- `controller/`
  - REST/API controllers.
  - Handle HTTP requests, request validation, response mapping, and HTTP-specific concerns.
  - Keep business logic out of controllers.

- `model/`
  - Application data models.

- `model/enums/`
  - Application-wide enumeration types.
  - Status values, type constants, and other fixed-choice fields used by entities and DTOs.

- `model/dto/`
  - Data Transfer Objects used for API requests and responses.
  - Prefer DTOs at API boundaries instead of exposing entities directly.

- `model/entity/`
  - Persistence/database entities.
  - Classes representing database tables or persisted domain data.

- `service/`
  - Business logic and application use cases.
  - Controllers should delegate business operations to services.
  - Keep persistence and HTTP-specific concerns separated from business logic where practical.

### Structure Rules

- Follow the existing package structure before introducing new packages.
- Do not create new top-level architectural packages without first discussing the reason.
- Prefer adding classes to the existing `config`, `controller`, `model/dto`, `model/enums`, `model/entity`, or `service` packages when they fit those responsibilities.
- Keep controllers thin and services responsible for business logic.
- Do not place DTOs and entities in the same package.
- Do not place business logic inside DTOs, entities, or controllers unless there is a clear reason.
- Preserve consistent naming and package conventions across the project.
- When proposing new files, explicitly identify where they belong in this structure.

## COMMAND EXECUTION

- NEVER run commands.
- The user must execute all commands manually.
- Only provide the exact command(s) the user should run.
- Never use a terminal, shell, command runner, or equivalent tool to execute commands.
- Do not run package managers, builds, tests, linters, formatters, migrations, or scripts.
- Do not run commands merely to verify whether a change works.
- If verification is needed, tell the user exactly how to verify it manually.

## PLANNING MODE

- Always ask clarifying questions
- Never assume design, tech stack or features
- Use deep-dive sub-agents to assist with research
- Use deep-dive sub-agents to review the different aspects of your plan before presenting to the user
- Keep the final plan concise and focused on actionable changes.

## CHANGE / EDIT MODE

- Never implement features yourself when possible - use sub-agents!
- Identify changes from the plan that can be implemented in parallel, and use sub-agents to implement the features efficiently
- When using sub-agents to implement features, act as a coordinator only
- Review the changes made by sub-agents before considering the task complete.

## TESTING

- NEVER run tests or test-related commands.
- Do not invoke test runners, build tools, integration tests, unit tests, or test scripts.
- Do not use tools to execute tests.
- Instead, help the user test the changes manually.
- Provide the exact commands the user should run themselves.
- Prefer targeted tests over running the entire test suite.
- Explain what successful output or behavior the user should expect.
- If manual API testing is appropriate, provide a concise json or explain how to test the endpoint using the user's preferred API client.
- Ask the user to provide only the relevant failure/error section when debugging.
- Never ask the user to paste large logs when a stack trace, error message, or specific section is sufficient.

Requirements:

- Use skills by default, even if the user does not explicitly mention them.
- For Spring Boot / Java tasks, **check and follow the relevant Spring Boot skills before planning or making changes**.
- Use the Spring Boot skills as the primary reference for project architecture, conventions, patterns, best practices, and implementation details.
- If a relevant skill exists for a specific concern (e.g. Spring Security, JPA, REST APIs, validation, testing, database access, or architecture), check that skill before making decisions related to that concern.
- Follow the project's preferred folder structure defined above unless the relevant skill or an explicit user requirement requires otherwise.
- When the project structure, existing code, and skills provide conflicting guidance, ask the user for clarification rather than assuming.
- NEVER run commands.
- The user must execute all commands manually.
- Only provide the commands and explain what the user needs to run.
 