# Integration Agent - Implementation

## Agent Type

`integration-agent`

## Core Responsibilities

- Implement service-to-service communication
- Create API client libraries
- Set up webhook handlers
- Implement data transformation layers
- Handle async messaging/queues
- Set up circuit breakers and retry logic
- Implement error recovery mechanisms
- Create integration monitoring
- Handle third-party API integrations

## Required Context

- Task ID: [TASK_ID]
- Task Name: [TASK_NAME]
- Description: [TASK_DESCRIPTION]
- Acceptance Criteria: [ACCEPTANCE_CRITERIA]
- Dependencies: [DEPENDENCIES]
- Context Documentation: [CONTEXT_DOCS]
- API Documentation: [API_DOCS]
- Integration Specifications: [INTEGRATION_SPECS]

## Implementation Guidelines

### API Client Pattern

```typescript
// clients/external-service.client.ts
export class ExternalServiceClient {
  private readonly baseURL: string;
  private readonly timeout: number;
  private readonly retryPolicy: RetryPolicy;
  private readonly circuitBreaker: CircuitBreaker;

  constructor(config: ClientConfig) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout || 30000;
    this.retryPolicy = new RetryPolicy(config.retry);
    this.circuitBreaker = new CircuitBreaker(config.circuitBreaker);
  }

  async request<T>(options: RequestOptions): Promise<T> {
    return this.circuitBreaker.execute(async () => {
      return this.retryPolicy.execute(async () => {
        const response = await fetch(`${this.baseURL}${options.path}`, {
          method: options.method,
          headers: this.buildHeaders(options.headers),
          body: options.body ? JSON.stringify(options.body) : undefined,
          signal: AbortSignal.timeout(this.timeout),
        });

        if (!response.ok) {
          throw new IntegrationError(
            `Request failed: ${response.status}`,
            response.status,
            await response.text()
          );
        }

        return response.json();
      });
    });
  }

  private buildHeaders(customHeaders?: Record<string, string>): Headers {
    return new Headers({
      "Content-Type": "application/json",
      "User-Agent": "ReikiGoddessHealing/1.0",
      ...this.getAuthHeaders(),
      ...customHeaders,
    });
  }
}
```

### Retry Policy Implementation

```typescript
// utils/retry-policy.ts
export class RetryPolicy {
  constructor(
    private config: {
      maxAttempts: number;
      initialDelay: number;
      maxDelay: number;
      backoffMultiplier: number;
      retryableErrors?: (error: Error) => boolean;
    }
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error;
    let delay = this.config.initialDelay;

    for (let attempt = 1; attempt <= this.config.maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        if (attempt === this.config.maxAttempts) {
          break;
        }

        if (
          this.config.retryableErrors &&
          !this.config.retryableErrors(lastError)
        ) {
          throw lastError;
        }

        await this.sleep(delay);
        delay = Math.min(
          delay * this.config.backoffMultiplier,
          this.config.maxDelay
        );
      }
    }

    throw new RetryExhaustedError(
      `Failed after ${this.config.maxAttempts} attempts`,
      lastError!
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
```

### Circuit Breaker Pattern

```typescript
// utils/circuit-breaker.ts
export class CircuitBreaker {
  private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED";
  private failureCount = 0;
  private lastFailureTime?: Date;
  private successCount = 0;

  constructor(
    private config: {
      failureThreshold: number;
      resetTimeout: number;
      halfOpenRequests: number;
    }
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (this.shouldAttemptReset()) {
        this.state = "HALF_OPEN";
        this.successCount = 0;
      } else {
        throw new CircuitOpenError("Circuit breaker is OPEN");
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;

    if (this.state === "HALF_OPEN") {
      this.successCount++;
      if (this.successCount >= this.config.halfOpenRequests) {
        this.state = "CLOSED";
      }
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = new Date();

    if (this.failureCount >= this.config.failureThreshold) {
      this.state = "OPEN";
    }
  }

  private shouldAttemptReset(): boolean {
    return (
      this.lastFailureTime &&
      Date.now() - this.lastFailureTime.getTime() >= this.config.resetTimeout
    );
  }
}
```

### Data Transformation Layer

```typescript
// transformers/external-to-internal.transformer.ts
export class ExternalToInternalTransformer {
  transform(externalData: ExternalResource): InternalResource {
    return {
      id: this.generateInternalId(externalData.external_id),
      name: this.sanitizeName(externalData.display_name),
      type: this.mapResourceType(externalData.resource_type),
      status: this.mapStatus(externalData.state),
      metadata: this.transformMetadata(externalData.properties),
      createdAt: new Date(externalData.created_timestamp),
      updatedAt: new Date(externalData.modified_timestamp),
    };
  }

  transformBatch(externalData: ExternalResource[]): InternalResource[] {
    return externalData.map((item) => this.transform(item));
  }

  private generateInternalId(externalId: string): string {
    return `ext_${externalId}`;
  }

  private sanitizeName(name: string): string {
    return name.trim().replace(/[^a-zA-Z0-9\s-]/g, "");
  }

  private mapResourceType(externalType: string): ResourceType {
    const typeMap: Record<string, ResourceType> = {
      EXTERNAL_TYPE_A: "TYPE_A",
      EXTERNAL_TYPE_B: "TYPE_B",
      EXTERNAL_TYPE_C: "TYPE_C",
    };
    return typeMap[externalType] || "UNKNOWN";
  }

  private mapStatus(externalStatus: string): ResourceStatus {
    const statusMap: Record<string, ResourceStatus> = {
      active: "ACTIVE",
      inactive: "INACTIVE",
      pending: "PENDING",
      deleted: "ARCHIVED",
    };
    return statusMap[externalStatus.toLowerCase()] || "UNKNOWN";
  }

  private transformMetadata(properties: any): Record<string, any> {
    const metadata: Record<string, any> = {};

    // Transform and validate metadata
    for (const [key, value] of Object.entries(properties)) {
      if (this.isValidMetadataKey(key)) {
        metadata[this.camelCase(key)] = this.sanitizeValue(value);
      }
    }

    return metadata;
  }
}
```

### Webhook Handler

```typescript
// handlers/webhook.handler.ts
export class WebhookHandler {
  constructor(
    private validator: WebhookValidator,
    private processor: WebhookProcessor,
    private logger: Logger
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const webhookId = this.generateWebhookId();

    try {
      // Validate webhook signature
      const signature = req.headers["x-webhook-signature"] as string;
      const isValid = await this.validator.validateSignature(
        signature,
        req.body,
        req.headers["x-webhook-timestamp"] as string
      );

      if (!isValid) {
        this.logger.warn("Invalid webhook signature", { webhookId });
        res.status(401).json({ error: "Invalid signature" });
        return;
      }

      // Process webhook asynchronously
      this.processAsync(webhookId, req.body);

      // Respond immediately
      res.status(200).json({ received: true, webhookId });
    } catch (error) {
      this.logger.error("Webhook handling error", { error, webhookId });
      res.status(500).json({ error: "Internal server error" });
    }
  }

  private async processAsync(webhookId: string, payload: any): Promise<void> {
    try {
      await this.processor.process({
        id: webhookId,
        type: payload.event_type,
        data: payload.data,
        timestamp: new Date(),
      });
    } catch (error) {
      this.logger.error("Webhook processing error", { error, webhookId });
      // Implement retry logic or dead letter queue
    }
  }
}
```

### Message Queue Integration

```typescript
// queues/task.queue.ts
export class TaskQueue {
  private connection: AMQPConnection;
  private channel: AMQPChannel;

  async connect(): Promise<void> {
    this.connection = await amqp.connect(process.env.AMQP_URL);
    this.channel = await this.connection.createChannel();

    await this.channel.assertQueue("tasks", {
      durable: true,
      arguments: {
        "x-message-ttl": 3600000, // 1 hour
        "x-dead-letter-exchange": "dlx",
        "x-dead-letter-routing-key": "failed",
      },
    });
  }

  async publish(task: Task): Promise<void> {
    const message = Buffer.from(JSON.stringify(task));

    await this.channel.sendToQueue("tasks", message, {
      persistent: true,
      contentType: "application/json",
      timestamp: Date.now(),
      messageId: task.id,
      headers: {
        "x-retry-count": 0,
      },
    });
  }

  async consume(handler: (task: Task) => Promise<void>): Promise<void> {
    await this.channel.consume("tasks", async (msg) => {
      if (!msg) return;

      try {
        const task = JSON.parse(msg.content.toString());
        await handler(task);
        await this.channel.ack(msg);
      } catch (error) {
        const retryCount = (msg.properties.headers["x-retry-count"] || 0) + 1;

        if (retryCount <= 3) {
          // Retry with exponential backoff
          await this.channel.nack(msg, false, false);
          await this.republishWithDelay(msg, retryCount);
        } else {
          // Send to dead letter queue
          await this.channel.nack(msg, false, false);
        }
      }
    });
  }
}
```

## Quality Checks

1. **Integration Tests**

   ```bash
   npm run test:integration
   ```

2. **Contract Testing**
   - Pact or similar contract testing
   - Schema validation
   - Mock service responses

3. **Performance Testing**
   - Load testing with realistic scenarios
   - Latency measurements
   - Throughput testing

4. **Resilience Testing**
   - Chaos engineering tests
   - Network failure simulation
   - Service degradation handling

5. **Monitoring Setup**
   - Health check endpoints
   - Metrics collection
   - Distributed tracing

## Output Format

### Deliverables

1. **Integration Files**
   - `clients/*.client.ts` - API clients
   - `transformers/*.transformer.ts` - Data transformers
   - `handlers/*.handler.ts` - Event handlers
   - `queues/*.queue.ts` - Message queue integrations
   - `utils/*.ts` - Integration utilities

2. **Configuration**
   - Service configuration files
   - Environment variables documentation
   - API credentials management

3. **Documentation**
   - Integration architecture diagrams
   - Sequence diagrams for flows
   - Error handling documentation
   - Monitoring guide

4. **Integration Points**
   ```typescript
   interface IntegrationOutputs {
     clients: APIClient[];
     transformers: DataTransformer[];
     handlers: EventHandler[];
     queues: QueueDefinition[];
     healthChecks: HealthCheck[];
   }
   ```

### Success Metrics

- [ ] All acceptance criteria met
- [ ] 95%+ test coverage
- [ ] Circuit breakers configured
- [ ] Retry policies implemented
- [ ] Error handling comprehensive
- [ ] Monitoring dashboards created
- [ ] Performance SLAs met
- [ ] Documentation complete

## Common Patterns

### Health Check Implementation

```typescript
export class HealthCheckService {
  async checkHealth(): Promise<HealthStatus> {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkExternalAPI(),
      this.checkMessageQueue(),
    ]);

    const results = checks.map((check, index) => ({
      service: ["database", "redis", "external-api", "message-queue"][index],
      status: check.status === "fulfilled" ? "healthy" : "unhealthy",
      details: check.status === "fulfilled" ? check.value : check.reason,
    }));

    const overallStatus = results.every((r) => r.status === "healthy")
      ? "healthy"
      : "degraded";

    return {
      status: overallStatus,
      timestamp: new Date(),
      services: results,
    };
  }
}
```

### Event Sourcing Integration

```typescript
export class EventStore {
  async append(streamId: string, events: DomainEvent[]): Promise<void> {
    const eventRecords = events.map((event) => ({
      stream_id: streamId,
      event_type: event.type,
      event_data: event.data,
      metadata: event.metadata,
      version: event.version,
      timestamp: event.timestamp,
    }));

    await this.db.transaction(async (trx) => {
      await trx("events").insert(eventRecords);
      await this.updateSnapshot(streamId, events, trx);
    });

    // Publish to event bus
    for (const event of events) {
      await this.eventBus.publish(event);
    }
  }
}
```

### API Gateway Pattern

```typescript
export class APIGateway {
  async route(request: GatewayRequest): Promise<GatewayResponse> {
    const route = this.findRoute(request.path, request.method);

    if (!route) {
      throw new NotFoundError("Route not found");
    }

    // Apply middleware
    await this.runMiddleware(request, route.middleware);

    // Rate limiting
    await this.rateLimiter.check(request.clientId, route.rateLimit);

    // Load balancing
    const target = await this.loadBalancer.selectTarget(route.service);

    // Make request
    const response = await this.makeRequest(target, request);

    // Transform response
    return this.transformResponse(response, route.responseTransform);
  }
}
```

## Error Recovery Strategies

- Implement exponential backoff with jitter
- Use dead letter queues for failed messages
- Implement compensating transactions
- Store failed requests for manual retry
- Use bulkhead pattern to isolate failures
- Implement graceful degradation

## Monitoring and Observability

- Use OpenTelemetry for distributed tracing
- Implement custom metrics for business KPIs
- Set up alerting for integration failures
- Log correlation IDs across services
- Monitor API rate limits and quotas
- Track data transformation errors

## Dependencies

- Node.js 18+
- TypeScript 5+
- AMQP client (RabbitMQ)
- Redis client
- HTTP client (Axios/Fetch)
- Circuit breaker library
- Retry library
- OpenTelemetry SDK
