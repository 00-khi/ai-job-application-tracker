# Backend Testing Explanation

## Overview

This backend has **8 test classes** across 4 layers, covering ~97 test cases. Each layer tests different parts of the application at different levels of isolation.

```
src/test/java/com/khiancarasicas/sunset/
├── SunsetApplicationTests.java          (existing - context load)
├── util/
│   ├── TextCleanerTest.java             (12 tests - unit)
│   └── TestDataFactory.java             (shared helper)
├── service/
│   ├── JobApplicationServiceTest.java   (20 tests - unit)
│   └── InterviewServiceTest.java        (12 tests - unit)
├── controller/
│   ├── JobApplicationControllerTest.java (11 tests - WebMVC)
│   └── InterviewControllerTest.java      (8 tests - WebMVC)
└── repository/
    ├── JobApplicationRepositoryTest.java (8 tests - DataJpaTest)
    └── JobApplicationSpecificationTest.java (14 tests - DataJpaTest)
```

---

## How the Layers Work Together

```
Request flows:
  HTTP Request → Controller (tested by WebMVC tests)
                    ↓
                  Service (tested by unit tests with mocks)
                    ↓
                  Repository (tested by DataJpaTest with real H2)
                    ↓
                  Database
```

| Layer | What loads | What's real | What's fake | Speed |
|-------|-----------|-------------|-------------|-------|
| **Unit tests** | Nothing from Spring | The class under test | Repositories (Mockito mocks) | ~milliseconds |
| **WebMVC tests** | Controller + security + validation | Controller, HTTP layer | Services (Mockito mocks) | ~seconds |
| **DataJpaTest** | JPA + H2 database | Repository, entities, queries | PostgreSQL (replaced by H2) | ~seconds |

---

## Commands to Run

```bash
# Run all tests
mvnw.cmd test

# Run a specific layer
mvnw.cmd test -Dtest="com.khiancarasicas.sunset.service.*"
mvnw.cmd test -Dtest="com.khiancarasicas.sunset.controller.*"
mvnw.cmd test -Dtest="com.khiancarasicas.sunset.repository.*"
mvnw.cmd test -Dtest="com.khiancarasicas.sunset.util.*"

# Run a single test class
mvnw.cmd test -Dtest=JobApplicationServiceTest

# Run a single test method
mvnw.cmd test -Dtest="JobApplicationServiceTest#create_validRequest_returnsResponse"
```

---

## Layer 1: Unit Tests

### What "unit test" means

A **unit test** tests one class in isolation. It doesn't start Spring, doesn't connect to a database, doesn't start a server. It's the fastest type of test. To isolate the class, we use **mocks** — fake stand-ins for dependencies.

---

### `TextCleanerTest.java` — The simplest test

**What it tests:** The `TextCleaner` utility class (pure functions, no dependencies).

**How it works:**

```java
@Test
void trimAndCollapse_normalString_returnsTrimmed() {
    assertEquals("hello world", TextCleaner.trimAndCollapse("  hello  world  "));
}
```

- `@Test` — tells JUnit "this is a test method"
- `assertEquals(expected, actual)` — checks if both values are equal. If not, the test fails
- The method name describes the scenario: `trimAndCollapse` (what), `normalString` (input), `returnsTrimmed` (expected output)

**Pattern:** Every test follows `method_scenario_expectedResult` naming. You call the method with a known input, and assert the output matches what you expect.

**Why this matters:** `TextCleaner` is used by the service layer to sanitize user input. If this breaks, user data gets corrupted silently.

---

### `TestDataFactory.java` — Not a test, it's a helper

**What it is:** A shared factory that creates pre-filled test data. It's not a test class (no `@Test` methods). It exists to avoid repeating the same setup code in every test.

**Key pieces:**

```java
public static final String DEFAULT_USER_ID = "user-123";   // the "logged in" user
public static final String OTHER_USER_ID = "user-456";      // a different user (for access control tests)
```

- `createJobApplicationRequest()` — a full valid request with all fields filled
- `createMinimalJobApplicationRequest()` — only the required fields (`company` + `title`)
- `createJobApplicationEntity(userId)` — creates a JPA entity (for repo/service tests)
- `createInterviewRequest()` / `createInterviewEntity()` — same for interviews

**Why:** Instead of writing `request.setCompany("Acme"); request.setTitle("Engineer"); request.setLocation(...)` in every test, you call `TestDataFactory.createJobApplicationRequest()`. If you later need to change test data, you change it in one place.

---

### `JobApplicationServiceTest.java` — Testing business logic with mocks

**What it tests:** `JobApplicationService` — the class that handles creating, updating, deleting, searching, and getting stats for job applications.

**How it works:**

```java
@ExtendWith(MockitoExtension.class)    // 1. Enable Mockito
class JobApplicationServiceTest {

    @Mock                                          // 2. Create a fake repository
    private JobApplicationRepository jobApplicationRepository;

    @InjectMocks                                   // 3. Create the real service, injecting the fake
    private JobApplicationService jobApplicationService;
```

**The three annotations explained:**

- `@ExtendWith(MockitoExtension.class)` — activates Mockito for this test class
- `@Mock` — creates a **fake** `JobApplicationRepository`. It looks real but does nothing unless you tell it what to return. This means we don't need a real database.
- `@InjectMocks` — creates the real `JobApplicationService` and injects the fake repository into it. The service thinks it has a real repository, but it's the fake.

**The Arrange-Act-Assert pattern:**

Every test follows this 3-step pattern:

```java
@Test
void create_validRequest_returnsResponse() {
    // ARRANGE: set up what the fake should return
    when(jobApplicationRepository.save(any(JobApplication.class))).thenAnswer(inv -> {
        JobApplication app = inv.getArgument(0);
        app.setId(1L);        // simulate the database generating an ID
        return app;
    });

    // ACT: call the method being tested
    JobApplicationResponse response = jobApplicationService.create(userId, request);

    // ASSERT: check the result
    assertNotNull(response);
    assertEquals("Acme Corp", response.getCompany());
    verify(jobApplicationRepository).save(any(JobApplication.class));  // verify the fake was called
}
```

**Mockito syntax explained:**

- `when(mock.method(args)).thenReturn(value)` — "when someone calls this method with these args, return this value"
- `when(...).thenAnswer(inv -> ...)` — "when someone calls this, run this code" (used when you need to modify the argument, like setting an ID)
- `verify(mock).method(args)` — "assert that this method was called"
- `argThat(predicate)` — "assert that the method was called with an argument matching this condition"
- `any(Class.class)` — matches any argument of that type

**Test scenarios covered:**

| Test | What it verifies |
|------|-----------------|
| `create_validRequest_returnsResponse` | Happy path: creating a job application works |
| `create_setsUserIdOnEntity` | The userId from the JWT is set on the entity |
| `create_appliesTextCleaning` | Whitespace is trimmed: `"  Acme  Corp  "` becomes `"Acme Corp"` |
| `create_defaultsCurrencyToUsd` | If no currency provided, defaults to `"USD"` |
| `create_defaultsStatusToSaved` | If no status provided, defaults to `SAVED` |
| `create_cleansTags` | Empty/blank tags are removed, remaining are trimmed |
| `update_validRequest_returnsUpdatedResponse` | Happy path: updating works |
| `update_wrongUser_throwsAccessDenied` | User A can't update User B's application |
| `update_notFound_throwsIllegalState` | Updating a non-existent app throws |
| `delete_validOwner_deletes` | Happy path: deleting works |
| `delete_wrongUser_throwsAccessDenied` | User A can't delete User B's application |
| `delete_notFound_throwsIllegalState` | Deleting a non-existent app throws |
| `getById_validOwner_returnsResponse` | Happy path: fetching by ID works |
| `getById_wrongUser_throwsAccessDenied` | User A can't read User B's application |
| `listAll_returnsAllUserApplications` | Returns all apps for the user |
| `listAll_withInterviews_includesInterviewsInResponse` | Interviews are included in the response |
| `listAll_emptyResult_returnsEmptyList` | No apps returns empty list, not null |
| `search_returnsPaginatedResults` | Pagination works correctly |
| `getStats_computesCorrectCounts` | Stats (total, offers, rejected, byStatus) are calculated |
| `getStats_noApplications_returnsZeros` | Empty state returns zeros, not errors |

**Why this matters:** This is the most important layer. If the service tests pass, your business logic is correct — the data is being processed, ownership is enforced, defaults are applied, and errors are thrown at the right times.

---

### `InterviewServiceTest.java` — Same pattern, different entity

**What it tests:** `InterviewService` — creating, updating, deleting interviews under a job application.

**Same structure:** `@Mock` for both `InterviewRepository` and `JobApplicationRepository`, `@InjectMocks` for `InterviewService`.

**Key scenarios:**

| Test | What it verifies |
|------|-----------------|
| `createInterview_validRequest_returnsResponse` | Happy path |
| `createInterview_setsJobApplicationOnInterview` | The interview is linked to the correct job app |
| `createInterview_wrongUser_throwsAccessDenied` | Can't create interview on someone else's job app |
| `createInterview_jobAppNotFound_throwsIllegalState` | Job app doesn't exist |
| `updateInterview_validRequest_returnsUpdatedResponse` | Happy path |
| `updateInterview_interviewNotBelongingToApp_throwsAccessDenied` | Can't update an interview that belongs to a different job app |
| `updateInterview_wrongUser_throwsAccessDenied` | Can't update interview on someone else's app |
| `deleteInterview_validRequest_deletes` | Happy path |
| `deleteInterview_interviewNotBelongingToApp_throwsAccessDenied` | Can't delete an interview from a different app |
| `deleteInterview_wrongUser_throwsAccessDenied` | Can't delete interview on someone else's app |

---

## Layer 2: WebMVC Tests (Controller Tests)

### What "WebMVC test" means

A `@WebMvcTest` loads **only the web layer** — your controller, the security filter chain, validation, exception handlers. It does NOT load services, repositories, or database connections. Services are replaced with mocks.

It uses **`MockMvc`** — a simulated HTTP client that sends requests to your controller without starting a real server.

---

### `JobApplicationControllerTest.java`

```java
@WebMvcTest(JobApplicationController.class)    // 1. Only load this controller + web infra
@Import(GlobalExceptionHandler.class)          // 2. Also load our exception handler
class JobApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc;                   // 3. Simulated HTTP client

    @MockitoBean
    private JobApplicationService jobApplicationService;  // 4. Fake service

    @Autowired
    private ObjectMapper objectMapper;         // 5. JSON serializer (converts objects to JSON)
```

**How a test works — step by step:**

```java
@Test
void create_validBody_returns201() throws Exception {
    // ARRANGE: tell the fake service what to return
    when(jobApplicationService.create(...)).thenReturn(response);

    // ACT: simulate an HTTP POST request
    mockMvc.perform(post("/api/job-applications")
            .with(jwt().jwt(j -> j.header("alg", "none")
                    .claim("sub", "user-123")))          // fake JWT auth
            .contentType(MediaType.APPLICATION_JSON)      // send JSON
            .content(objectMapper.writeValueAsString(request)))  // body = JSON of the request
    // ASSERT: check the HTTP response
            .andExpect(status().isCreated())             // status 201
            .andExpect(jsonPath("$.id", is(1)))          // JSON body has id=1
            .andExpect(jsonPath("$.company", is("Tech Startup")));
}
```

**Key concepts:**

- **`mockMvc.perform(...)`** — sends a simulated HTTP request to the controller
- **`.with(jwt().jwt(...))`** — attaches a fake JWT token so Spring Security thinks the user is authenticated. The `sub` claim is the userId that the controller extracts via `jwt.getSubject()`.
- **`.andExpect(status().isCreated())`** — asserts the HTTP status code is 201
- **`.andExpect(jsonPath("$.company", is("Tech Startup")))`** — parses the JSON response body and checks a specific field. `$.company` means "the `company` field at the root of the JSON"

**Validation tests (400 errors):**

```java
@Test
void create_missingCompany_returns400() throws Exception {
    JobApplicationRequest request = new JobApplicationRequest();
    request.setTitle("Engineer");          // missing company (required)

    mockMvc.perform(post("/api/job-applications")
            .with(jwt()...)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())           // 400
            .andExpect(jsonPath("$.company", is("Company is required")));  // error message
}
```

This tests the `@NotBlank` validation on the `JobApplicationRequest` DTO. When `company` is blank, Spring returns 400 with field-level errors.

**Security test:**

```java
@Test
void list_withoutJwt_returns401() throws Exception {
    mockMvc.perform(get("/api/job-applications"))
            .andExpect(status().isUnauthorized());        // 401 without JWT
}
```

This verifies that unauthenticated requests are rejected.

---

### `InterviewControllerTest.java`

Same pattern. Tests POST/PUT/DELETE for interviews, plus validation (missing type/date/status -> 400) and auth (no JWT -> 401).

---

## Layer 3: Repository Tests

### What "DataJpaTest" means

A `@DataJpaTest` loads **only the JPA layer** — your repositories, entities, and a real (but in-memory) database. It uses H2 instead of PostgreSQL, so tests are fast and don't need an external database.

It auto-rolls-back every test — changes to the database are undone after each test, so tests don't affect each other.

---

### `JobApplicationRepositoryTest.java`

```java
@DataJpaTest                   // 1. Load only JPA + in-memory H2 database
@ActiveProfiles("test")        // 2. Use application-test.yaml (H2 config)
class JobApplicationRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;    // 3. Helper to save/find data in the test DB

    @Autowired
    private JobApplicationRepository jobApplicationRepository;  // 4. The real repository
```

**How a test works:**

```java
@Test
void findByUserIdWithInterviews_returnsApplicationsWithInterviews() {
    // ARRANGE: save test data directly to the database
    JobApplication app = TestDataFactory.createJobApplicationEntity("user-123");
    entityManager.persistAndFlush(app);              // save to H2

    Interview interview = TestDataFactory.createInterviewEntity(app);
    entityManager.persistAndFlush(interview);

    entityManager.clear();                           // clear the cache (forces DB read)

    // ACT: call the repository method
    List<JobApplication> results = jobApplicationRepository.findByUserIdWithInterviews("user-123");

    // ASSERT: check the results
    assertEquals(1, results.size());
    assertEquals(1, results.get(0).getInterviews().size());  // interviews were fetched (no N+1)
}
```

**Key concepts:**

- **`TestEntityManager`** — a helper that wraps JPA's `EntityManager`. `persistAndFlush()` saves to the database immediately. `clear()` empties the persistence cache so the next read goes to the database.
- **`entityManager.clear()`** — this is critical. Without it, the result might come from the JPA cache instead of the database, which would hide bugs in your queries.

**Test scenarios:**

| Test | What it verifies |
|------|-----------------|
| `findByUserIdWithInterviews_returnsApplicationsWithInterviews` | The JPQL `LEFT JOIN FETCH` works — interviews are loaded eagerly |
| `findByUserIdWithInterviews_noInterviews_returnsEmptyInterviewList` | Apps without interviews still return correctly |
| `findByUserIdWithInterviews_isolatesByUser` | User A's query doesn't return User B's apps |
| `findByUserIdAndStatus_filtersCorrectly` | Status filter works |
| `findByUserIdAndStatus_noMatch_returnsEmpty` | No match returns empty list |
| `findAll_withPagination_returnsCorrectPage` | Pagination: 15 records, page size 5 -> 3 pages |
| `save_setsCreatedAtAndUpdatedAt` | JPA auditing works — timestamps are set |
| `save_withInterviews_cascades` | Saving an app with interviews saves both |

---

### `JobApplicationSpecificationTest.java`

**What it tests:** `JobApplicationSpecification.build()` — the dynamic query builder that handles search, status filtering, and user isolation.

**How it works differently:**

Instead of testing individual repository methods, this tests the **Specification** — a composable query filter. Each test builds a specification and runs it against the real H2 database.

```java
@BeforeEach
void setUp() {
    // Seed 3 job applications into H2:
    // app1: user-123, Acme Corp, APPLIED
    // app2: user-123, Tech Startup, OFFER
    // app3: user-456, Acme Corp, APPLIED    (different user!)
}
```

The `@BeforeEach` method runs before **every** test, re-seeding the database.

**Test scenarios:**

| Test | What it verifies |
|------|-----------------|
| `build_filtersByUserId` | Only returns apps for the specified user |
| `build_filtersByStatus` | Status filter works (e.g., only OFFER) |
| `build_searchByCompany` | Search finds "acme" in company name |
| `build_searchByCompany_caseInsensitive` | "ACME" also finds "Acme Corp" |
| `build_searchByTitle` | Search finds "backend" in title |
| `build_searchBySource` | Search finds "linkedin" in source |
| `build_searchByContactEmail` | Search finds "jane@" in email |
| `build_searchByNotes` | Search finds "remote" in notes |
| `build_searchByTags` | Search finds "django" in tags |
| `build_combinedSearchAndStatus` | Search + status filter together |
| `build_searchWithNoMatch_returnsEmpty` | "nonexistent" returns nothing |
| `build_userIsolation_doesNotReturnOtherUsersApps` | User A can't see User B's apps even by searching "acme" |
| `build_nullSearchAndNullStatus_returnsAllUserApps` | No filters = all apps for the user |
| `build_blankSearchIgnored` | A blank search string is treated as no search |

---

## Spring Boot 4.x Test Import Changes

If you see import errors, check these package moves:

| Old (Spring Boot 3.x) | New (Spring Boot 4.x) |
|---|---|
| `org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest` | `org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest` |
| `org.springframework.boot.test.mock.mockito.MockBean` | `org.springframework.test.context.bean.override.mockito.MockitoBean` |
| `org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest` | `org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest` |
| `org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager` | `org.springframework.boot.jpa.test.autoconfigure.TestEntityManager` |
| `com.fasterxml.jackson.databind.ObjectMapper` | `tools.jackson.databind.ObjectMapper` |

JWT mocking in MockMvc:
```java
// OLD (Spring Boot 3.x)
mockMvc.perform(get("/endpoint").jwt(jwt))

// NEW (Spring Boot 4.x)
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;

mockMvc.perform(get("/endpoint")
    .with(jwt().jwt(j -> j.header("alg", "none").claim("sub", "user-123"))))
```
