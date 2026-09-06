# Sunset - Backend

For managing job applications and interviews, built with Spring Boot and backed by Supabase for authentication.

## Prerequisites

- Java 21
- PostgreSQL
- A Supabase project (for JWT auth)

## Getting Started

1. **Set environment variables** (see [Configuration](#configuration))

2. **Build the project**

   ```bash
   ./mvnw clean install       # Linux/Mac
   mvnw.cmd clean install     # Windows
   ```

3. **Run the application**

   ```bash
   ./mvnw spring-boot:run     # Linux/Mac
   mvnw.cmd spring-boot:run   # Windows
   ```

   The server starts on `http://localhost:8080`.

## Configuration

| Variable                     | Description             | Required                                 |
| ---------------------------- | ----------------------- | ---------------------------------------- |
| `SUNSET_DB_URL`              | PostgreSQL JDBC URL     | Yes                                      |
| `SUNSET_DB_USERNAME`         | Database username       | Yes                                      |
| `SUNSET_DB_PASSWORD`         | Database password       | Yes                                      |
| `SUNSET_SUPABASE_JWT_ISSUER` | Supabase JWT issuer URI | Yes                                      |
| `JWT_SECRET`                 | JWT secret key          | Yes                                      |
| `FRONTEND_URL`               | CORS allowed origin     | No (defaults to `http://localhost:3000`) |

## Project Structure

```text
src/main/java/com/khiancarasicas/sunset/
├── config/       # Security, JPA, exception handling
├── controller/   # REST endpoints
├── model/
│   ├── dto/      # Request/response objects
│   ├── enums/    # Status and type enumerations
│   └── entity/   # JPA entities
├── repository/   # Data access layer
├── service/      # Business logic
└── util/         # Helpers (text cleaning)
```

## Tech Stack

- Java 21
- Spring Boot 4.1.1
- Spring Security + OAuth2 (JWT)
- Spring Data JPA / Hibernate
- PostgreSQL
- Supabase (db & auth)
- Lombok
