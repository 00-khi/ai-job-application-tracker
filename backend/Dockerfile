# ---------------------------------------------------------------------------
# Stage 1: Build & Test
# ---------------------------------------------------------------------------
FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

# Copy Maven wrapper and config first — this layer gets cached unless
# .mvn or mvnw changes, so subsequent builds stay fast.
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Pre-download all dependencies. This layer is cached as long as pom.xml
# doesn't change, so we avoid re-downloading on every code change.
RUN chmod +x ./mvnw
RUN ./mvnw dependency:go-offline -B

# Copy source code and run the full build with the "test" profile.
# The test profile activates H2 for tests so no external DB is needed.
COPY src ./src
RUN ./mvnw clean package

# ---------------------------------------------------------------------------
# Stage 2: Runtime
# ---------------------------------------------------------------------------
FROM eclipse-temurin:21-jre

WORKDIR /app

# Pull the built jar from the build stage.
COPY --from=build /app/target/sunset-*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
