# How to Write Tests — A Practical Guide

This guide teaches you how to write tests for any new feature you add to this backend. Every section includes working sample code you can copy and adapt.

---

## Table of Contents

1. [Quick Reference Cheatsheet](#1-quick-reference-cheatsheet)
2. [Service Tests (Unit)](#2-service-tests-unit)
3. [Controller Tests (WebMVC)](#3-controller-tests-webmvc)
4. [Repository Tests (DataJpaTest)](#4-repository-tests-datajpatest)
5. [Common Patterns](#5-common-patterns)
6. [Testing Checklist for New Features](#6-testing-checklist-for-new-features)

---

## 1. Quick Reference Cheatsheet

### Which test type to use

| Test Type | Annotation | What it loads | What to test | Speed |
|-----------|-----------|---------------|--------------|-------|
| **Unit** | `@ExtendWith(MockitoExtension.class)` | Nothing from Spring | Business logic, calculations, transformations | ~ms |
| **WebMVC** | `@WebMvcTest(Controller.class)` | Controller + security + validation | HTTP routing, status codes, JSON, auth | ~s |
| **DataJpaTest** | `@DataJpaTest` | JPA + H2 in-memory DB | Database queries, pagination, filtering | ~s |

### Key annotations

| Annotation | What it does |
|-----------|-------------|
| `@Test` | Marks a method as a test |
| `@ExtendWith(MockitoExtension.class)` | Activates Mockito for mocks |
| `@Mock` | Creates a fake dependency (does nothing unless told) |
| `@InjectMocks` | Creates the real class, injects the fakes into it |
| `@MockitoBean` | Creates a fake Spring bean (for controller tests) |
| `@WebMvcTest(Controller.class)` | Loads only the web layer |
| `@DataJpaTest` | Loads only JPA with H2 database |
| `@BeforeEach` | Runs before every test method |
| `@ActiveProfiles("test")` | Uses `application-test.yaml` config |

### Mockito cheat sheet

```java
// Arrange: tell the mock what to return
when(mock.method(args)).thenReturn(value);

// Arrange: run custom code when called
when(mock.method(args)).thenAnswer(inv -> {
    MyArg arg = inv.getArgument(0);  // get the first argument
    arg.setId(1L);                    // modify it
    return arg;
});

// Assert: verify a method was called
verify(mock).method(args);

// Assert: verify with any argument
verify(mock).method(any(SomeClass.class));

// Assert: verify with a condition
verify(mock).method(argThat(x -> x.getName().equals("Acme")));

// Assert: method was never called
verify(mock, never()).method(args);

// Assert: method called exactly N times
verify(mock, times(3)).method(args);
```

### Assertion cheat sheet

```java
// Equality
assertEquals(expected, actual);
assertEquals(expected, actual, "custom message");

// Null checks
assertNull(value);
assertNotNull(value);

// Booleans
assertTrue(condition);
assertFalse(condition);

// Collections
assertTrue(list.isEmpty());
assertEquals(3, list.size());
assertEquals("Acme", list.get(0).getName());

// Exceptions
assertThrows(ExceptionClass.class, () -> {
    service.methodThatShouldThrow(args);
});

// JSON (in controller tests)
.jsonPath("$.field", is("value"))
.jsonPath("$.count", is(3))
.jsonPath("$.items", hasSize(2))
```

---

## 2. Service Tests (Unit)

Service tests verify business logic in isolation. No Spring context, no database — just the class under test and fake dependencies.

### Step 1: Create the test class with annotations

```java
package com.khiancarasicas.sunset.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)      // activates Mockito
class YourServiceTest {

    @Mock                                 // creates a fake repository
    private YourRepository yourRepository;

    @InjectMocks                          // creates the real service, injects the fake
    private YourService yourService;
}
```

**What happens here:**
- `@ExtendWith(MockitoExtension.class)` tells JUnit to run Mockito before each test
- `@Mock` creates a fake `YourRepository` — it looks real but does nothing
- `@InjectMocks` creates the real `YourService` and passes the fake repository into its constructor

### Step 2: Write a happy path test

```java
@Test
void create_validRequest_returnsResponse() {
    // ARRANGE: set up inputs and mock behavior
    YourRequest request = new YourRequest();
    request.setName("Acme Corp");

    // When the fake repository's save() is called, return the same object with an ID
    when(yourRepository.save(any(YourEntity.class))).thenAnswer(inv -> {
        YourEntity entity = inv.getArgument(0);
        entity.setId(1L);
        return entity;
    });

    // ACT: call the method being tested
    YourResponse response = yourService.create("user-123", request);

    // ASSERT: check the result
    assertNotNull(response);
    assertEquals("Acme Corp", response.getName());
    assertEquals(1L, response.getId());

    // VERIFY: the repository's save() was called
    verify(yourRepository).save(any(YourEntity.class));
}
```

**The pattern is always:**
1. **Arrange** — create inputs, configure mocks
2. **Act** — call the method
3. **Assert** — check the output

### Step 3: Write an error/exception test

```java
@Test
void getById_notFound_throwsIllegalState() {
    // ARRANGE: repository returns empty (item doesn't exist)
    when(yourRepository.findById(999L)).thenReturn(Optional.empty());

    // ACT + ASSERT: calling the method throws the expected exception
    assertThrows(IllegalStateException.class,
            () -> yourService.getById("user-123", 999L));
}
```

### Step 4: Write an ownership/access control test

```java
@Test
void update_wrongUser_throwsAccessDenied() {
    // ARRANGE: create an entity owned by user-123
    YourEntity existing = createTestEntity();
    existing.setUserId("user-123");
    existing.setId(1L);

    when(yourRepository.findById(1L)).thenReturn(Optional.of(existing));

    YourRequest request = new YourRequest();
    request.setName("Updated Name");

    // ACT + ASSERT: user-456 trying to update user-123's data → AccessDenied
    assertThrows(AccessDeniedException.class,
            () -> yourService.update("user-456", 1L, request));
}
```

### Step 5: Write a test with argument verification

```java
@Test
void create_setsUserIdOnEntity() {
    // ARRANGE
    when(yourRepository.save(any(YourEntity.class))).thenAnswer(inv -> {
        YourEntity entity = inv.getArgument(0);
        entity.setId(1L);
        return entity;
    });

    YourRequest request = new YourRequest();
    request.setName("Acme");

    // ACT
    yourService.create("user-123", request);

    // ASSERT: verify the userId was set correctly on the entity
    verify(yourRepository).save(argThat(entity -> "user-123".equals(entity.getUserId())));
}
```

`argThat()` lets you check a condition on the argument instead of just checking it was called.

---

## 3. Controller Tests (WebMVC)

Controller tests verify the HTTP layer: routing, status codes, JSON serialization, validation errors, and authentication. Services are mocked.

### Step 1: Create the test class with annotations

```java
package com.khiancarasicas.sunset.controller;

import com.khiancarasicas.sunset.config.GlobalExceptionHandler;
import com.khiancarasicas.sunset.service.YourService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(YourController.class)         // load only this controller
@Import(GlobalExceptionHandler.class)     // also load exception handling
class YourControllerTest {

    @Autowired
    private MockMvc mockMvc;               // simulated HTTP client

    @MockitoBean
    private YourService yourService;       // fake service

    @Autowired
    private ObjectMapper objectMapper;     // JSON serializer
}
```

### Step 2: Write a happy path test

```java
@Test
void getById_returnsEntity() throws Exception {
    // ARRANGE: fake service returns a response
    YourResponse response = new YourResponse();
    response.setId(1L);
    response.setName("Acme Corp");

    when(yourService.getById("user-123", 1L)).thenReturn(response);

    // ACT + ASSERT: simulate HTTP GET, check response
    mockMvc.perform(get("/api/your-resource/1")
                    .with(jwt().jwt(j -> j.header("alg", "none")
                            .claim("sub", "user-123"))))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id", is(1)))
            .andExpect(jsonPath("$.name", is("Acme Corp")));
}
```

**Breaking down the HTTP simulation:**

```java
mockMvc.perform(                          // 1. send a request
    get("/api/your-resource/1")           //    HTTP GET to this URL
        .with(jwt().jwt(j ->             //    attach a fake JWT
            j.header("alg", "none")
             .claim("sub", "user-123")))
        .contentType(MediaType.APPLICATION_JSON)  // Content-Type header
)
.andExpect(status().isOk())              // 2. check status code is 200
.andExpect(jsonPath("$.name", is("Acme")));  // 3. check JSON body
```

**What `.with(jwt().jwt(...))` does:**
- Creates a fake JWT token and attaches it to the request
- Spring Security sees it and sets the authenticated user
- The `sub` claim becomes the `userId` your controller gets from `jwt.getSubject()`
- Without this, you get 403 (not authenticated)

### Step 3: Write a POST test (create)

```java
@Test
void create_validBody_returns201() throws Exception {
    // ARRANGE
    YourRequest request = new YourRequest();
    request.setName("New Corp");

    YourResponse response = new YourResponse();
    response.setId(1L);
    response.setName("New Corp");

    when(yourService.create(eq("user-123"), any(YourRequest.class)))
            .thenReturn(response);

    // ACT + ASSERT
    mockMvc.perform(post("/api/your-resource")
                    .with(jwt().jwt(j -> j.header("alg", "none")
                            .claim("sub", "user-123")))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))  // convert object to JSON string
            .andExpect(status().isCreated())       // 201
            .andExpect(jsonPath("$.id", is(1)))
            .andExpect(jsonPath("$.name", is("New Corp")));
}
```

### Step 4: Write a validation test (400)

```java
@Test
void create_missingName_returns400() throws Exception {
    // ARRANGE: create a request with missing required field
    YourRequest request = new YourRequest();
    // name is @NotBlank but we left it null

    // ACT + ASSERT
    mockMvc.perform(post("/api/your-resource")
                    .with(jwt().jwt(j -> j.header("alg", "none")
                            .claim("sub", "user-123")))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())    // 400
            .andExpect(jsonPath("$.name", is("Name is required")));  // error message
}
```

This works because your DTO has `@NotBlank(message = "Name is required")`. Spring validation rejects the request and returns 400 with field-level errors.

### Step 5: Write an auth test (403)

```java
@Test
void getById_withoutJwt_returns403() throws Exception {
    // No .with(jwt()...) — no authentication
    mockMvc.perform(get("/api/your-resource/1"))
            .andExpect(status().isForbidden());     // 403
}
```

---

## 4. Repository Tests (DataJpaTest)

Repository tests verify database queries against a real (but in-memory) H2 database. No mocking — the queries actually run.

### Step 1: Create the test class with annotations

```java
package com.khiancarasicas.sunset.repository;

import com.khiancarasicas.sunset.model.entity.YourEntity;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest                    // load only JPA + H2
@ActiveProfiles("test")         // use application-test.yaml
class YourRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;   // helper to save/find data

    @Autowired
    private YourRepository yourRepository;     // the real repository
}
```

### Step 2: Write a basic query test

```java
@Test
void findByName_returnsMatchingEntities() {
    // ARRANGE: save test data directly to the database
    YourEntity entity1 = new YourEntity();
    entity1.setName("Acme Corp");
    entity1.setUserId("user-123");
    entityManager.persistAndFlush(entity1);     // save immediately

    YourEntity entity2 = new YourEntity();
    entity2.setName("Tech Startup");
    entity2.setUserId("user-123");
    entityManager.persistAndFlush(entity2);

    entityManager.clear();                      // clear JPA cache (forces DB read)

    // ACT
    List<YourEntity> results = yourRepository.findByName("Acme Corp");

    // ASSERT
    assertEquals(1, results.size());
    assertEquals("Acme Corp", results.get(0).getName());
}
```

**What `persistAndFlush()` does:**
- `persist()` — marks the entity as managed
- `flush()` — writes it to the database immediately (normally JPA batches writes)

**What `clear()` does:**
- Empties the JPA persistence cache
- Forces the next `find()` to read from the database
- Without this, results might come from cache, hiding bugs in your queries

### Step 3: Write a test with user isolation

```java
@Test
void findByUserId_onlyReturnsThatUsersData() {
    // ARRANGE: create data for two different users
    YourEntity user1App = new YourEntity();
    user1App.setName("Acme");
    user1App.setUserId("user-123");
    entityManager.persistAndFlush(user1App);

    YourEntity user2App = new YourEntity();
    user2App.setName("Tech");
    user2App.setUserId("user-456");
    entityManager.persistAndFlush(user2App);

    entityManager.clear();

    // ACT
    List<YourEntity> user1Results = yourRepository.findByUserId("user-123");
    List<YourEntity> user2Results = yourRepository.findByUserId("user-456");

    // ASSERT: each user only sees their own data
    assertEquals(1, user1Results.size());
    assertEquals(1, user2Results.size());
    assertEquals("user-123", user1Results.get(0).getUserId());
    assertEquals("user-456", user2Results.get(0).getUserId());
}
```

### Step 4: Write a pagination test

```java
@Test
void findAll_withPagination_returnsCorrectPage() {
    // ARRANGE: create 15 entities
    for (int i = 0; i < 15; i++) {
        YourEntity entity = new YourEntity();
        entity.setName("Company " + i);
        entity.setUserId("user-123");
        entityManager.persist(entity);
    }
    entityManager.flush();
    entityManager.clear();

    // ACT: request page 0, size 5, sorted by name
    Page<YourEntity> page = yourRepository.findAll(
            PageRequest.of(0, 5, Sort.by("name").ascending()));

    // ASSERT
    assertEquals(5, page.getContent().size());    // page has 5 items
    assertEquals(15, page.getTotalElements());     // 15 total
    assertEquals(3, page.getTotalPages());         // 3 pages
    assertEquals("Company 0", page.getContent().get(0).getName()); // first item
}
```

---

## 5. Common Patterns

### Pattern: Testing ownership enforcement

```java
@Test
void update_wrongUser_throwsAccessDenied() {
    // ARRANGE: entity owned by user-123
    YourEntity existing = createTestEntity("user-123");
    when(repository.findById(1L)).thenReturn(Optional.of(existing));

    YourRequest request = new ValidRequest();

    // ACT + ASSERT: user-456 tries to update → AccessDeniedException
    assertThrows(AccessDeniedException.class,
            () -> service.update("user-456", 1L, request));
}
```

### Pattern: Testing "not found"

```java
@Test
void getById_notFound_throwsIllegalState() {
    when(repository.findById(999L)).thenReturn(Optional.empty());

    assertThrows(IllegalStateException.class,
            () -> service.getById("user-123", 999L));
}
```

### Pattern: Testing defaults

```java
@Test
void create_nullCurrency_defaultsToUsd() {
    when(repository.save(any())).thenAnswer(inv -> {
        YourEntity e = inv.getArgument(0);
        e.setId(1L);
        return e;
    });

    YourRequest request = new ValidRequest();
    request.setCurrency(null);

    YourResponse response = service.create("user-123", request);

    assertEquals("USD", response.getCurrency());
}
```

### Pattern: Testing text cleaning

```java
@Test
void create_trimsWhitespaceFromFields() {
    when(repository.save(any())).thenAnswer(inv -> {
        YourEntity e = inv.getArgument(0);
        e.setId(1L);
        return e;
    });

    YourRequest request = new ValidRequest();
    request.setCompany("  Acme  Corp  ");

    YourResponse response = service.create("user-123", request);

    assertEquals("Acme Corp", response.getCompany());
}
```

### Pattern: Using `@BeforeEach` for shared setup

```java
@DataJpaTest
@ActiveProfiles("test")
class YourRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private YourRepository yourRepository;

    private YourEntity savedEntity;

    @BeforeEach
    void setUp() {
        // This runs BEFORE every test
        savedEntity = new YourEntity();
        savedEntity.setName("Acme Corp");
        savedEntity.setUserId("user-123");
        entityManager.persistAndFlush(savedEntity);
        entityManager.clear();
    }

    @Test
    void findByName_findsAcme() {
        // savedEntity is already in the database
        List<YourEntity> results = yourRepository.findByName("Acme Corp");
        assertEquals(1, results.size());
    }

    @Test
    void findByName_noMatch_returnsEmpty() {
        // savedEntity is still there, but we search for something else
        List<YourEntity> results = yourRepository.findByName("Nonexistent");
        assertTrue(results.isEmpty());
    }
}
```

### Pattern: Testing exception message

```java
@Test
void create_blankName_throwsWithMessage() {
    when(repository.save(any())).thenAnswer(inv -> inv.getArgument(0));

    YourRequest request = new YourRequest();
    request.setName("");  // blank

    // If your service validates and throws:
    // IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
    //         () -> service.create("user-123", request));
    // assertEquals("Name is required", ex.getMessage());
}
```

---

## 6. Testing Checklist for New Features

Use this checklist every time you add a new endpoint, entity, or service method.

### New Entity

- [ ] Entity test: verify `@CreationTimestamp` / `@UpdateTimestamp` work
- [ ] Repository test: verify cascading relationships
- [ ] Repository test: verify indexes on frequently queried columns

### New Repository Query

- [ ] Test: returns correct results for matching input
- [ ] Test: returns empty list when no match
- [ ] Test: user isolation — can't see other users' data
- [ ] Test: pagination works (if paginated)

### New Service Method

- [ ] Happy path test: method returns expected result
- [ ] Error test: throws exception when entity not found
- [ ] Error test: throws `AccessDeniedException` when wrong user
- [ ] Default test: null optional fields get correct defaults
- [ ] Text cleaning test: whitespace is trimmed (if applicable)

### New Controller Endpoint

- [ ] Happy path test: returns correct status code and JSON
- [ ] Validation test: missing required fields → 400 with error messages
- [ ] Auth test: no JWT → 403
- [ ] JSON serialization test: response fields match expected values

### Quick command to run all tests

```bash
mvnw.cmd test
```

### Quick command to run one test class

```bash
mvnw.cmd test -Dtest=YourServiceTest
```

### Quick command to run one test method

```bash
mvnw.cmd test -Dtest="YourServiceTest#methodName"
```

---

## Appendix: File Naming Convention

```
src/main/java/.../service/YourService.java
                                          → src/test/java/.../service/YourServiceTest.java

src/main/java/.../controller/YourController.java
                                          → src/test/java/.../controller/YourControllerTest.java

src/main/java/.../repository/YourRepository.java
                                          → src/test/java/.../repository/YourRepositoryTest.java
```

The test class name is always `{ClassName}Test.java` in the same package under `src/test/`.

---

## Appendix: Spring Boot 4.x Import Reference

If you see "cannot resolve symbol" errors, check these:

| What | Old (3.x) | New (4.x) |
|------|-----------|-----------|
| `@WebMvcTest` | `o.s.boot.test.autoconfigure.web.servlet.WebMvcTest` | `o.s.boot.webmvc.test.autoconfigure.WebMvcTest` |
| `@MockBean` | `o.s.boot.test.mock.mockito.MockBean` | `o.s.test.context.bean.override.mockito.MockitoBean` |
| `@DataJpaTest` | `o.s.boot.test.autoconfigure.orm.jpa.DataJpaTest` | `o.s.boot.data.jpa.test.autoconfigure.DataJpaTest` |
| `TestEntityManager` | `o.s.boot.test.autoconfigure.orm.jpa.TestEntityManager` | `o.s.boot.jpa.test.autoconfigure.TestEntityManager` |
| `ObjectMapper` | `com.fasterxml.jackson.databind.ObjectMapper` | `tools.jackson.databind.ObjectMapper` |

JWT mocking:
```java
// Import
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;

// Usage
.with(jwt().jwt(j -> j.header("alg", "none").claim("sub", "user-123")))
```
