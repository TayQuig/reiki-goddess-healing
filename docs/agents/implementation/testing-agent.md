# Testing Agent - Implementation

## Agent Type

`testing-agent`

## Core Responsibilities

- Write comprehensive unit tests
- Create integration test suites
- Implement end-to-end tests
- Set up test data factories
- Create mock services and stubs
- Ensure code coverage targets
- Write performance benchmarks
- Implement visual regression tests
- Create accessibility tests
- Set up continuous testing pipelines

## Required Context

- Task ID: [TASK_ID]
- Task Name: [TASK_NAME]
- Description: [TASK_DESCRIPTION]
- Acceptance Criteria: [ACCEPTANCE_CRITERIA]
- Dependencies: [DEPENDENCIES]
- Context Documentation: [CONTEXT_DOCS]
- Code Under Test: [CODE_PATHS]
- Coverage Requirements: [COVERAGE_TARGETS]

## Implementation Guidelines

### Unit Test Structure

```typescript
// ComponentName.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from './ComponentName';
import { mockData } from '../__mocks__/mockData';

describe('ComponentName', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    initialValue: 'test'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with required props', () => {
      render(<ComponentName {...defaultProps} />);

      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/input label/i)).toHaveValue('test');
    });

    it('should render loading state', () => {
      render(<ComponentName {...defaultProps} isLoading />);

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should render error state', () => {
      const error = 'Something went wrong';
      render(<ComponentName {...defaultProps} error={error} />);

      expect(screen.getByRole('alert')).toHaveTextContent(error);
    });
  });

  describe('Interactions', () => {
    it('should handle form submission', async () => {
      const user = userEvent.setup();
      render(<ComponentName {...defaultProps} />);

      const input = screen.getByLabelText(/input label/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });

      await user.clear(input);
      await user.type(input, 'new value');
      await user.click(submitButton);

      expect(defaultProps.onSubmit).toHaveBeenCalledWith({
        value: 'new value'
      });
    });

    it('should validate input on blur', async () => {
      const user = userEvent.setup();
      render(<ComponentName {...defaultProps} />);

      const input = screen.getByLabelText(/input label/i);

      await user.clear(input);
      await user.tab();

      expect(screen.getByText(/field is required/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<ComponentName {...defaultProps} />);
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<ComponentName {...defaultProps} />);

      await user.tab();
      expect(screen.getByLabelText(/input label/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button')).toHaveFocus();
    });
  });
});
```

### Integration Test Pattern

```typescript
// api/resource.integration.test.ts
import request from "supertest";
import { app } from "../app";
import { setupTestDatabase, teardownTestDatabase } from "../test-utils";
import { createTestUser, createTestResource } from "../factories";

describe("Resource API Integration", () => {
  let authToken: string;
  let testUser: User;

  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    testUser = await createTestUser();
    authToken = await generateAuthToken(testUser);
  });

  describe("GET /api/resources", () => {
    it("should return paginated resources", async () => {
      // Arrange
      const resources = await Promise.all(
        Array.from({ length: 25 }, () =>
          createTestResource({ userId: testUser.id })
        )
      );

      // Act
      const response = await request(app)
        .get("/api/resources")
        .set("Authorization", `Bearer ${authToken}`)
        .query({ page: 1, limit: 10 });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
          }),
        ]),
        pagination: {
          page: 1,
          limit: 10,
          total: 25,
          totalPages: 3,
        },
      });
    });

    it("should filter resources by type", async () => {
      // Arrange
      await createTestResource({ userId: testUser.id, type: "TYPE_A" });
      await createTestResource({ userId: testUser.id, type: "TYPE_B" });

      // Act
      const response = await request(app)
        .get("/api/resources")
        .set("Authorization", `Bearer ${authToken}`)
        .query({ type: "TYPE_A" });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].type).toBe("TYPE_A");
    });
  });

  describe("POST /api/resources", () => {
    it("should create a new resource", async () => {
      // Arrange
      const payload = {
        name: "Test Resource",
        description: "A test resource",
        type: "TYPE_A",
      };

      // Act
      const response = await request(app)
        .post("/api/resources")
        .set("Authorization", `Bearer ${authToken}`)
        .send(payload);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: expect.any(String),
        ...payload,
        userId: testUser.id,
        createdAt: expect.any(String),
      });

      // Verify in database
      const resource = await ResourceModel.findById(response.body.id);
      expect(resource).toBeTruthy();
    });

    it("should validate required fields", async () => {
      // Act
      const response = await request(app)
        .post("/api/resources")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ description: "Missing name" });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Validation Error");
      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          field: "name",
          message: expect.any(String),
        })
      );
    });
  });
});
```

### E2E Test Pattern

```typescript
// e2e/user-journey.spec.ts
import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ResourcePage } from "./pages/ResourcePage";

test.describe("User Journey: Create and Manage Resource", () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let resourcePage: ResourcePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    resourcePage = new ResourcePage(page);
  });

  test("should complete full resource lifecycle", async ({ page }) => {
    // Login
    await loginPage.goto();
    await loginPage.login("test@example.com", "password123");
    await expect(dashboardPage.welcomeMessage).toBeVisible();

    // Navigate to resources
    await dashboardPage.navigateToResources();
    await expect(resourcePage.pageTitle).toHaveText("Resources");

    // Create new resource
    await resourcePage.clickCreateButton();
    await resourcePage.fillForm({
      name: "E2E Test Resource",
      description: "Created by automated test",
      type: "TYPE_A",
    });
    await resourcePage.submitForm();

    // Verify creation
    await expect(resourcePage.successToast).toHaveText(
      "Resource created successfully"
    );
    await expect(resourcePage.resourceList).toContainText("E2E Test Resource");

    // Edit resource
    await resourcePage.selectResource("E2E Test Resource");
    await resourcePage.clickEditButton();
    await resourcePage.updateName("Updated E2E Resource");
    await resourcePage.saveChanges();

    // Verify update
    await expect(resourcePage.successToast).toHaveText(
      "Resource updated successfully"
    );
    await expect(resourcePage.resourceList).toContainText(
      "Updated E2E Resource"
    );

    // Delete resource
    await resourcePage.selectResource("Updated E2E Resource");
    await resourcePage.clickDeleteButton();
    await resourcePage.confirmDelete();

    // Verify deletion
    await expect(resourcePage.successToast).toHaveText(
      "Resource deleted successfully"
    );
    await expect(resourcePage.resourceList).not.toContainText(
      "Updated E2E Resource"
    );
  });

  test("should handle errors gracefully", async ({ page }) => {
    await page.route("**/api/resources", (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: "Internal Server Error" }),
      });
    });

    await loginPage.goto();
    await loginPage.login("test@example.com", "password123");
    await dashboardPage.navigateToResources();

    await expect(resourcePage.errorMessage).toHaveText(
      "Failed to load resources. Please try again."
    );
    await expect(resourcePage.retryButton).toBeVisible();
  });
});
```

### Test Data Factories

```typescript
// factories/user.factory.ts
import { faker } from "@faker-js/faker";
import { User } from "../types";

export const userFactory = {
  build: (overrides?: Partial<User>): User => ({
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    role: "USER",
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  }),

  create: async (overrides?: Partial<User>): Promise<User> => {
    const user = userFactory.build(overrides);
    return await UserModel.create(user);
  },

  createMany: async (
    count: number,
    overrides?: Partial<User>
  ): Promise<User[]> => {
    const users = Array.from({ length: count }, () =>
      userFactory.build(overrides)
    );
    return await UserModel.insertMany(users);
  },
};

// factories/resource.factory.ts
export const resourceFactory = {
  build: (overrides?: Partial<Resource>): Resource => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    type: faker.helpers.arrayElement(["TYPE_A", "TYPE_B", "TYPE_C"]),
    status: "ACTIVE",
    userId: faker.string.uuid(),
    metadata: {
      tags: faker.helpers.arrayElements(["tag1", "tag2", "tag3"], 2),
      priority: faker.helpers.arrayElement(["LOW", "MEDIUM", "HIGH"]),
    },
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  }),
};
```

### Mock Service Pattern

```typescript
// mocks/external-service.mock.ts
export class ExternalServiceMock {
  private responses: Map<string, any> = new Map();
  private calls: Array<{ method: string; args: any[] }> = [];

  setup(): void {
    vi.mock("../services/external.service", () => ({
      ExternalService: vi.fn().mockImplementation(() => this),
    }));
  }

  mockResponse(method: string, response: any): void {
    this.responses.set(method, response);
  }

  mockError(method: string, error: Error): void {
    this.responses.set(method, Promise.reject(error));
  }

  async getResource(id: string): Promise<any> {
    this.calls.push({ method: "getResource", args: [id] });
    const response = this.responses.get("getResource");

    if (response instanceof Promise) {
      return response;
    }

    return response || { id, name: "Mocked Resource" };
  }

  getCalls(method?: string): Array<{ method: string; args: any[] }> {
    if (method) {
      return this.calls.filter((call) => call.method === method);
    }
    return this.calls;
  }

  reset(): void {
    this.responses.clear();
    this.calls = [];
  }
}
```

### Performance Benchmark

```typescript
// benchmarks/api.bench.ts
import { bench, describe } from "vitest";
import { processLargeDataset, optimizedProcess } from "../utils/processing";

describe("Data Processing Performance", () => {
  const testData = generateTestData(10000);

  bench("Original implementation", () => {
    processLargeDataset(testData);
  });

  bench("Optimized implementation", () => {
    optimizedProcess(testData);
  });

  bench("Parallel processing", async () => {
    await processInParallel(testData);
  });
});
```

## Quality Checks

1. **Test Coverage**

   ```bash
   npm test -- --coverage
   # Ensure >90% coverage
   ```

2. **Test Quality**
   - Each test has clear arrange/act/assert sections
   - Test names describe expected behavior
   - No test interdependencies
   - Proper cleanup in afterEach/afterAll

3. **Performance Tests**

   ```bash
   npm run test:performance
   ```

4. **E2E Tests**

   ```bash
   npm run test:e2e
   ```

5. **Visual Regression**
   ```bash
   npm run test:visual
   ```

## Output Format

### Deliverables

1. **Test Files**
   - `*.test.ts` - Unit tests
   - `*.integration.test.ts` - Integration tests
   - `*.spec.ts` - E2E tests
   - `*.bench.ts` - Performance benchmarks

2. **Test Utilities**
   - `factories/*` - Test data factories
   - `mocks/*` - Mock implementations
   - `fixtures/*` - Static test data
   - `utils/*` - Test helpers

3. **Configuration**
   - Test environment setup
   - CI/CD pipeline configuration
   - Coverage thresholds

4. **Documentation**
   - Testing strategy document
   - Test case catalog
   - Coverage reports

### Success Metrics

- [ ] All acceptance criteria covered by tests
- [ ] > 90% code coverage achieved
- [ ] All tests passing in CI
- [ ] E2E tests cover critical paths
- [ ] Performance benchmarks established
- [ ] Visual regression tests implemented
- [ ] Accessibility tests passing
- [ ] Test execution time <5 minutes

## Testing Best Practices

### Test Organization

- Group related tests with describe blocks
- Use consistent naming conventions
- Keep tests focused and atomic
- Avoid testing implementation details

### Test Data Management

```typescript
// Use factories for dynamic data
const user = await userFactory.create();

// Use fixtures for static data
const fixture = await loadFixture("complex-scenario.json");

// Clean up after tests
afterEach(async () => {
  await cleanupTestData();
});
```

### Async Testing

```typescript
// Always await async operations
await waitFor(() => {
  expect(screen.getByText("Loaded")).toBeInTheDocument();
});

// Set appropriate timeouts
test(
  "long running operation",
  async () => {
    // Test implementation
  },
  { timeout: 10000 }
);
```

### Mocking Strategies

```typescript
// Mock at the module boundary
vi.mock("../api/client");

// Provide meaningful mock implementations
mockClient.get.mockResolvedValue({ data: testData });

// Verify mock interactions
expect(mockClient.get).toHaveBeenCalledWith("/api/resource/123");
```

## Common Testing Patterns

### Component Testing with Context

```typescript
const renderWithProviders = (ui: React.ReactElement, options = {}) => {
  const AllProviders = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>
      <AuthProvider>
        <QueryClient>
          {children}
        </QueryClient>
      </AuthProvider>
    </ThemeProvider>
  );

  return render(ui, { wrapper: AllProviders, ...options });
};
```

### API Testing with Interceptors

```typescript
beforeEach(() => {
  server.use(
    rest.get("/api/resources", (req, res, ctx) => {
      return res(ctx.json({ data: mockResources }));
    })
  );
});
```

### Database Testing

```typescript
const setupTestDatabase = async () => {
  await mongoose.connect(process.env.TEST_DATABASE_URL);
  await mongoose.connection.db.dropDatabase();
};

const seedTestData = async () => {
  await User.create(testUsers);
  await Resource.create(testResources);
};
```

## Dependencies

- Vitest for unit/integration tests
- React Testing Library
- Playwright for E2E tests
- MSW for API mocking
- Faker.js for test data
- Supertest for API testing
- Coverage reporting tools
