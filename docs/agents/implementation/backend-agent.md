# Backend Agent - Implementation

## Agent Type

`backend-agent`

## Core Responsibilities

- Implement RESTful API endpoints
- Create service layer business logic
- Handle request/response validation
- Implement error handling and logging
- Set up authentication and authorization
- Create database queries and transactions
- Implement caching strategies
- Handle file uploads and processing
- Set up rate limiting and throttling

## Required Context

- Task ID: [TASK_ID]
- Task Name: [TASK_NAME]
- Description: [TASK_DESCRIPTION]
- Acceptance Criteria: [ACCEPTANCE_CRITERIA]
- Dependencies: [DEPENDENCIES]
- Context Documentation: [CONTEXT_DOCS]
- API Specification: [API_SPEC]

## Implementation Guidelines

### API Structure

```typescript
// routes/resource.routes.ts
import { Router } from "express";
import { ResourceController } from "../controllers/resource.controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validation";
import { resourceSchema } from "../schemas/resource.schema";

const router = Router();
const controller = new ResourceController();

router.get("/resources", authenticate, controller.list);
router.get("/resources/:id", authenticate, controller.get);
router.post(
  "/resources",
  authenticate,
  validate(resourceSchema),
  controller.create
);
router.put(
  "/resources/:id",
  authenticate,
  validate(resourceSchema),
  controller.update
);
router.delete("/resources/:id", authenticate, controller.delete);

export default router;
```

### Controller Pattern

```typescript
// controllers/resource.controller.ts
export class ResourceController {
  constructor(
    private resourceService = new ResourceService(),
    private logger = new Logger("ResourceController")
  ) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 20, ...filters } = req.query;
      const result = await this.resourceService.list({
        page: Number(page),
        limit: Number(limit),
        filters,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const resource = await this.resourceService.getById(id);
      if (!resource) {
        throw new NotFoundError("Resource not found");
      }
      res.json(resource);
    } catch (error) {
      next(error);
    }
  };
}
```

### Service Layer

```typescript
// services/resource.service.ts
export class ResourceService {
  constructor(
    private repository = new ResourceRepository(),
    private cache = new CacheService(),
    private events = new EventEmitter()
  ) {}

  async list(options: ListOptions): Promise<PaginatedResult<Resource>> {
    const cacheKey = `resources:list:${JSON.stringify(options)}`;
    const cached = await this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const result = await this.repository.findAll(options);
    await this.cache.set(cacheKey, result, 300); // 5 minutes

    return result;
  }

  async create(data: CreateResourceDto): Promise<Resource> {
    const validated = await this.validate(data);

    const resource = await this.repository.transaction(async (trx) => {
      const created = await this.repository.create(validated, trx);
      await this.createAuditLog(created, "CREATE", trx);
      return created;
    });

    this.events.emit("resource.created", resource);
    await this.cache.invalidate("resources:list:*");

    return resource;
  }
}
```

### Error Handling

```typescript
// middleware/error-handler.ts
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const logger = new Logger("ErrorHandler");

  if (error instanceof ValidationError) {
    logger.warn("Validation error", { error, path: req.path });
    return res.status(400).json({
      error: "Validation Error",
      message: error.message,
      details: error.details,
    });
  }

  if (error instanceof NotFoundError) {
    logger.info("Resource not found", { error, path: req.path });
    return res.status(404).json({
      error: "Not Found",
      message: error.message,
    });
  }

  if (error instanceof UnauthorizedError) {
    logger.warn("Unauthorized access", { error, path: req.path });
    return res.status(401).json({
      error: "Unauthorized",
      message: "Authentication required",
    });
  }

  // Unknown errors
  logger.error("Unhandled error", { error, path: req.path });
  res.status(500).json({
    error: "Internal Server Error",
    message: "An unexpected error occurred",
  });
};
```

### Validation Schemas

```typescript
// schemas/resource.schema.ts
import { z } from "zod";

export const resourceSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  type: z.enum(["TYPE_A", "TYPE_B", "TYPE_C"]),
  metadata: z.record(z.any()).optional(),
  tags: z.array(z.string()).max(10).optional(),
});

export type CreateResourceDto = z.infer<typeof resourceSchema>;
```

### Authentication Middleware

```typescript
// middleware/auth.ts
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    const decoded = await verifyToken(token);
    req.user = await userService.getById(decoded.userId);

    if (!req.user) {
      throw new UnauthorizedError("User not found");
    }

    next();
  } catch (error) {
    next(new UnauthorizedError("Invalid token"));
  }
};
```

## Quality Checks

1. **Unit Tests**

   ```bash
   npm test -- --coverage
   ```

2. **Integration Tests**

   ```bash
   npm run test:integration
   ```

3. **API Documentation**
   - OpenAPI/Swagger spec updated
   - All endpoints documented
   - Request/response examples provided

4. **Security Checks**
   - Input validation on all endpoints
   - SQL injection prevention
   - XSS protection
   - CSRF tokens implemented
   - Rate limiting configured

5. **Performance Testing**
   - Load testing with k6 or Artillery
   - Response time < 200ms for GET requests
   - Proper database indexing
   - N+1 query prevention

## Output Format

### Deliverables

1. **API Files**
   - `routes/*.routes.ts` - Route definitions
   - `controllers/*.controller.ts` - Request handlers
   - `services/*.service.ts` - Business logic
   - `repositories/*.repository.ts` - Data access
   - `schemas/*.schema.ts` - Validation schemas
   - `middleware/*.ts` - Custom middleware

2. **Tests**
   - Unit tests for services
   - Integration tests for endpoints
   - Test fixtures and factories

3. **Documentation**
   - OpenAPI specification
   - API usage examples
   - Error response catalog

4. **Integration Points**
   ```typescript
   interface BackendOutputs {
     endpoints: APIEndpoint[];
     schemas: ValidationSchema[];
     services: ServiceDefinition[];
     events: EventDefinition[];
     errors: ErrorDefinition[];
   }
   ```

### Success Metrics

- [ ] All acceptance criteria met
- [ ] 90%+ test coverage
- [ ] All endpoints documented
- [ ] Security audit passed
- [ ] Performance benchmarks met
- [ ] No critical vulnerabilities
- [ ] Proper error handling
- [ ] Logging implemented

## Common Patterns

### Repository Pattern

```typescript
export class ResourceRepository extends BaseRepository<Resource> {
  constructor() {
    super("resources");
  }

  async findByUserId(userId: string, options?: FindOptions) {
    return this.findMany({
      where: { userId },
      ...options,
    });
  }

  async updateStatus(id: string, status: ResourceStatus, trx?: Transaction) {
    return this.update(id, { status, updatedAt: new Date() }, trx);
  }
}
```

### Caching Strategy

```typescript
const cacheMiddleware = (ttl: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `cache:${req.method}:${req.originalUrl}`;
    const cached = await cache.get(key);

    if (cached) {
      return res.json(cached);
    }

    const originalJson = res.json;
    res.json = function (data: any) {
      cache.set(key, data, ttl);
      return originalJson.call(this, data);
    };

    next();
  };
};
```

### Event-Driven Architecture

```typescript
// Event publishing
this.events.emit("order.created", {
  orderId: order.id,
  userId: order.userId,
  total: order.total,
  timestamp: new Date(),
});

// Event handling
this.events.on("order.created", async (data) => {
  await emailService.sendOrderConfirmation(data);
  await analyticsService.trackPurchase(data);
  await inventoryService.updateStock(data);
});
```

## Security Best Practices

- Never log sensitive data (passwords, tokens, PII)
- Use parameterized queries to prevent SQL injection
- Implement proper CORS configuration
- Use helmet.js for security headers
- Rate limit all public endpoints
- Validate and sanitize all inputs
- Use secure session configuration
- Implement proper password hashing (bcrypt/argon2)

## Performance Optimization

- Use database connection pooling
- Implement query result caching
- Use pagination for list endpoints
- Optimize database queries (explain analyze)
- Implement API response compression
- Use streaming for large file downloads
- Background job processing for heavy tasks

## Dependencies

- Node.js 18+
- Express or Fastify
- TypeScript 5+
- Database driver (PostgreSQL/MySQL)
- Redis for caching
- JWT for authentication
- Zod or Joi for validation
- Winston or Pino for logging
