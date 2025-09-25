# Security Agent - Implementation

## Agent Type

`security-agent`

## Core Responsibilities

- Implement authentication mechanisms
- Set up authorization and access control
- Validate and sanitize all inputs
- Implement security headers and CORS
- Set up rate limiting and DDoS protection
- Handle encryption and key management
- Implement secure session management
- Conduct security audits
- Set up vulnerability scanning
- Implement OWASP best practices

## Required Context

- Task ID: [TASK_ID]
- Task Name: [TASK_NAME]
- Description: [TASK_DESCRIPTION]
- Acceptance Criteria: [ACCEPTANCE_CRITERIA]
- Dependencies: [DEPENDENCIES]
- Context Documentation: [CONTEXT_DOCS]
- Security Requirements: [SECURITY_REQS]
- Compliance Standards: [COMPLIANCE_STANDARDS]

## Implementation Guidelines

### Authentication Implementation

```typescript
// auth/auth.service.ts
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET;
  private readonly refreshSecret = process.env.JWT_REFRESH_SECRET;
  private readonly accessTokenExpiry = "15m";
  private readonly refreshTokenExpiry = "7d";

  async register(dto: RegisterDto): Promise<AuthResponse> {
    // Validate input
    const validation = await this.validateRegistration(dto);
    if (!validation.isValid) {
      throw new ValidationError(validation.errors);
    }

    // Check for existing user
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictError("Email already registered");
    }

    // Hash password with Argon2
    const hashedPassword = await argon2.hash(dto.password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });

    // Create user with transaction
    const user = await this.userRepository.transaction(async (client) => {
      const newUser = await this.userRepository.create(
        {
          email: dto.email,
          password: hashedPassword,
          role: "USER",
          emailVerified: false,
        },
        client
      );

      // Send verification email
      await this.emailService.sendVerificationEmail(newUser.email);

      // Create audit log
      await this.auditService.log(
        {
          action: "USER_REGISTRATION",
          userId: newUser.id,
          metadata: { email: newUser.email },
        },
        client
      );

      return newUser;
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    // Rate limiting check
    await this.rateLimiter.checkLogin(dto.email);

    // Find user
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      await this.simulatePasswordCheck(); // Prevent timing attacks
      throw new UnauthorizedError("Invalid credentials");
    }

    // Verify password
    const isValid = await argon2.verify(user.password, dto.password);
    if (!isValid) {
      await this.auditService.log({
        action: "FAILED_LOGIN",
        userId: user.id,
        metadata: { reason: "Invalid password" },
      });
      throw new UnauthorizedError("Invalid credentials");
    }

    // Check if account is active
    if (user.status !== "ACTIVE") {
      throw new ForbiddenError("Account is not active");
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Update last login
    await this.userRepository.updateLastLogin(user.id);

    // Log successful login
    await this.auditService.log({
      action: "SUCCESSFUL_LOGIN",
      userId: user.id,
      metadata: { ip: dto.ipAddress },
    });

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  private async generateTokens(user: User): Promise<TokenPair> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(payload, this.jwtSecret, this.accessTokenExpiry),
      this.signToken(payload, this.refreshSecret, this.refreshTokenExpiry),
    ]);

    // Store refresh token
    await this.tokenRepository.create({
      userId: user.id,
      token: await this.hashToken(refreshToken),
      expiresAt: new Date(Date.now() + ms(this.refreshTokenExpiry)),
    });

    return { accessToken, refreshToken };
  }

  private async signToken(
    payload: JwtPayload,
    secret: string,
    expiresIn: string
  ): Promise<string> {
    return jwt.sign(payload, secret, {
      expiresIn,
      issuer: "reiki-goddess-healing",
      audience: "web-app",
    });
  }
}
```

### Authorization Implementation

```typescript
// auth/authorization.service.ts
export class AuthorizationService {
  private readonly permissions = new Map<string, Set<string>>();

  constructor() {
    this.loadPermissions();
  }

  private loadPermissions(): void {
    // Define role-based permissions
    this.permissions.set(
      "USER",
      new Set([
        "read:own-profile",
        "update:own-profile",
        "read:public-resources",
        "create:bookings",
      ])
    );

    this.permissions.set(
      "ADMIN",
      new Set([
        ...this.permissions.get("USER")!,
        "read:all-users",
        "update:all-users",
        "delete:all-users",
        "manage:system-settings",
      ])
    );
  }

  async checkPermission(
    user: User,
    permission: string,
    resource?: any
  ): Promise<boolean> {
    // Check role-based permissions
    const rolePermissions = this.permissions.get(user.role);
    if (!rolePermissions?.has(permission)) {
      return false;
    }

    // Check resource-based permissions
    if (resource && permission.includes("own")) {
      return this.checkResourceOwnership(user, resource);
    }

    // Check attribute-based permissions
    return this.checkAttributeBasedAccess(user, permission, resource);
  }

  private checkResourceOwnership(user: User, resource: any): boolean {
    return resource.userId === user.id || resource.ownerId === user.id;
  }

  private async checkAttributeBasedAccess(
    user: User,
    permission: string,
    resource?: any
  ): Promise<boolean> {
    // Implement ABAC logic
    const policies = await this.policyRepository.findByPermission(permission);

    for (const policy of policies) {
      if (await this.evaluatePolicy(policy, user, resource)) {
        return true;
      }
    }

    return false;
  }
}

// Middleware
export const authorize = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError("Authentication required");
      }

      const hasPermission = await authorizationService.checkPermission(
        user,
        permission,
        req.params.id ? await getResource(req.params.id) : undefined
      );

      if (!hasPermission) {
        throw new ForbiddenError("Insufficient permissions");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
```

### Input Validation and Sanitization

```typescript
// security/input-validator.ts
export class InputValidator {
  private readonly sanitizer = new DOMPurify();

  validateAndSanitize<T>(input: unknown, schema: z.ZodSchema<T>): T {
    // First pass: basic validation
    const parseResult = schema.safeParse(input);
    if (!parseResult.success) {
      throw new ValidationError(
        "Input validation failed",
        parseResult.error.errors
      );
    }

    // Second pass: sanitization
    const sanitized = this.deepSanitize(parseResult.data);

    // Third pass: re-validate after sanitization
    const finalResult = schema.safeParse(sanitized);
    if (!finalResult.success) {
      throw new ValidationError(
        "Sanitized input validation failed",
        finalResult.error.errors
      );
    }

    return finalResult.data;
  }

  private deepSanitize(obj: any): any {
    if (typeof obj === "string") {
      return this.sanitizeString(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.deepSanitize(item));
    }

    if (obj && typeof obj === "object") {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[this.sanitizeKey(key)] = this.deepSanitize(value);
      }
      return sanitized;
    }

    return obj;
  }

  private sanitizeString(str: string): string {
    // Remove HTML tags
    let sanitized = this.sanitizer.sanitize(str, { ALLOWED_TAGS: [] });

    // Remove SQL injection attempts
    sanitized = sanitized.replace(
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|CREATE|ALTER)\b)/gi,
      ""
    );

    // Remove script injection attempts
    sanitized = sanitized.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      ""
    );

    // Normalize whitespace
    sanitized = sanitized.replace(/\s+/g, " ").trim();

    return sanitized;
  }

  private sanitizeKey(key: string): string {
    // Only allow alphanumeric and underscores
    return key.replace(/[^a-zA-Z0-9_]/g, "");
  }
}

// Usage in middleware
export const validateInput = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = inputValidator.validateAndSanitize(req.body, schema);
      next();
    } catch (error) {
      next(error);
    }
  };
};
```

### Security Headers Implementation

```typescript
// security/security-headers.ts
export const securityHeaders = (app: Express): void => {
  // Helmet for basic security headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "https://trusted-cdn.com"],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com",
          ],
          imgSrc: ["'self'", "data:", "https:"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          connectSrc: ["'self'", "https://api.reiki-goddess.com"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: true,
      crossOriginOpenerPolicy: true,
      crossOriginResourcePolicy: { policy: "cross-origin" },
      dnsPrefetchControl: true,
      frameguard: { action: "deny" },
      hidePoweredBy: true,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      ieNoOpen: true,
      noSniff: true,
      originAgentCluster: true,
      permittedCrossDomainPolicies: false,
      referrerPolicy: { policy: "no-referrer" },
      xssFilter: true,
    })
  );

  // Additional custom headers
  app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader(
      "Permissions-Policy",
      "geolocation=(), microphone=(), camera=()"
    );
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
    next();
  });
};
```

### Rate Limiting Implementation

```typescript
// security/rate-limiter.ts
export class RateLimiter {
  private readonly redis: Redis;
  private readonly limits = {
    login: { window: 900, max: 5 }, // 5 attempts per 15 minutes
    api: { window: 60, max: 100 }, // 100 requests per minute
    registration: { window: 3600, max: 3 }, // 3 registrations per hour
  };

  async checkLimit(key: string, type: keyof typeof this.limits): Promise<void> {
    const limit = this.limits[type];
    const redisKey = `rate-limit:${type}:${key}`;

    const current = await this.redis.incr(redisKey);

    if (current === 1) {
      await this.redis.expire(redisKey, limit.window);
    }

    if (current > limit.max) {
      const ttl = await this.redis.ttl(redisKey);
      throw new TooManyRequestsError(
        `Rate limit exceeded. Try again in ${ttl} seconds.`
      );
    }
  }

  middleware(type: keyof typeof this.limits = "api") {
    return async (req: Request, res: Response, next: NextFunction) => {
      const key = this.getKey(req);

      try {
        await this.checkLimit(key, type);
        next();
      } catch (error) {
        if (error instanceof TooManyRequestsError) {
          res.status(429).json({
            error: "Too Many Requests",
            message: error.message,
          });
        } else {
          next(error);
        }
      }
    };
  }

  private getKey(req: Request): string {
    // Use user ID if authenticated, otherwise IP
    return req.user?.id || req.ip || req.connection.remoteAddress || "unknown";
  }
}
```

### Encryption and Key Management

```typescript
// security/encryption.service.ts
export class EncryptionService {
  private readonly algorithm = "aes-256-gcm";
  private readonly keyDerivationIterations = 100000;

  async encrypt(data: string, masterKey: string): Promise<EncryptedData> {
    // Generate salt and IV
    const salt = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    // Derive key from master key
    const key = await this.deriveKey(masterKey, salt);

    // Create cipher
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);

    // Encrypt data
    const encrypted = Buffer.concat([
      cipher.update(data, "utf8"),
      cipher.final(),
    ]);

    // Get auth tag
    const authTag = cipher.getAuthTag();

    return {
      encrypted: encrypted.toString("base64"),
      salt: salt.toString("base64"),
      iv: iv.toString("base64"),
      authTag: authTag.toString("base64"),
      algorithm: this.algorithm,
    };
  }

  async decrypt(
    encryptedData: EncryptedData,
    masterKey: string
  ): Promise<string> {
    // Derive key
    const salt = Buffer.from(encryptedData.salt, "base64");
    const key = await this.deriveKey(masterKey, salt);

    // Create decipher
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      key,
      Buffer.from(encryptedData.iv, "base64")
    );

    // Set auth tag
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, "base64"));

    // Decrypt
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedData.encrypted, "base64")),
      decipher.final(),
    ]);

    return decrypted.toString("utf8");
  }

  private async deriveKey(masterKey: string, salt: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        masterKey,
        salt,
        this.keyDerivationIterations,
        32,
        "sha256",
        (err, derivedKey) => {
          if (err) reject(err);
          else resolve(derivedKey);
        }
      );
    });
  }

  // Key rotation
  async rotateEncryption(
    data: EncryptedData,
    oldKey: string,
    newKey: string
  ): Promise<EncryptedData> {
    const decrypted = await this.decrypt(data, oldKey);
    return this.encrypt(decrypted, newKey);
  }
}
```

### Session Management

```typescript
// security/session.service.ts
export class SessionService {
  private readonly sessionStore: SessionStore;
  private readonly sessionConfig = {
    secret: process.env.SESSION_SECRET!,
    name: "rgh.sid",
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      sameSite: "strict" as const,
      path: "/",
    },
    resave: false,
    saveUninitialized: false,
    rolling: true,
  };

  configureSession(app: Express): void {
    app.use(
      session({
        ...this.sessionConfig,
        store: this.sessionStore,
        genid: () => this.generateSecureId(),
      })
    );

    // Session fixation protection
    app.use((req, res, next) => {
      if (req.session && req.session.regenerate) {
        const oldSession = { ...req.session };
        req.session.regenerate((err) => {
          if (err) return next(err);

          // Restore user data
          Object.assign(req.session, oldSession);
          next();
        });
      } else {
        next();
      }
    });
  }

  private generateSecureId(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  async validateSession(sessionId: string): Promise<boolean> {
    const session = await this.sessionStore.get(sessionId);

    if (!session) return false;

    // Check expiry
    if (session.cookie.expires < new Date()) {
      await this.sessionStore.destroy(sessionId);
      return false;
    }

    // Check for suspicious activity
    if (await this.detectSuspiciousActivity(session)) {
      await this.sessionStore.destroy(sessionId);
      return false;
    }

    return true;
  }

  private async detectSuspiciousActivity(session: any): Promise<boolean> {
    // Check for rapid IP changes
    if (session.lastIp && session.currentIp !== session.lastIp) {
      const geoChange = await this.checkGeographicAnomaly(
        session.lastIp,
        session.currentIp
      );
      if (geoChange) return true;
    }

    // Check for unusual user agent changes
    if (session.userAgent && session.currentUserAgent !== session.userAgent) {
      return true;
    }

    return false;
  }
}
```

## Quality Checks

1. **Security Scanning**

   ```bash
   npm audit
   npm run security:scan
   ```

2. **Vulnerability Testing**
   - OWASP ZAP scanning
   - Dependency vulnerability checks
   - Static code analysis (ESLint security plugin)

3. **Penetration Testing**
   - SQL injection attempts
   - XSS attack vectors
   - CSRF testing
   - Authentication bypass attempts

4. **Compliance Verification**
   - OWASP Top 10 checklist
   - GDPR compliance
   - Security headers validation

5. **Performance Impact**
   - Measure auth endpoint response times
   - Monitor rate limiter efficiency
   - Check encryption/decryption performance

## Output Format

### Deliverables

1. **Security Files**
   - `auth/*.ts` - Authentication services
   - `middleware/security.ts` - Security middleware
   - `validators/*.ts` - Input validators
   - `utils/encryption.ts` - Encryption utilities
   - `config/security.ts` - Security configuration

2. **Configuration**
   - Environment variables documentation
   - Security policy files
   - CORS configuration
   - CSP policies

3. **Documentation**
   - Security architecture diagram
   - Authentication flow documentation
   - API security guidelines
   - Incident response procedures

4. **Integration Points**
   ```typescript
   interface SecurityOutputs {
     middleware: SecurityMiddleware[];
     validators: InputValidator[];
     policies: SecurityPolicy[];
     auditHooks: AuditHook[];
   }
   ```

### Success Metrics

- [ ] All OWASP Top 10 vulnerabilities addressed
- [ ] Zero high/critical vulnerabilities in scan
- [ ] Authentication/authorization working correctly
- [ ] All inputs validated and sanitized
- [ ] Security headers properly configured
- [ ] Rate limiting effectively preventing abuse
- [ ] Encryption implemented for sensitive data
- [ ] Audit logging comprehensive

## Security Best Practices

### Password Security

- Minimum 12 characters
- Require complexity (uppercase, lowercase, numbers, symbols)
- Check against common passwords list
- Implement password history
- Force periodic password changes for privileged accounts

### API Security

```typescript
// API key management
const apiKey = req.headers["x-api-key"];
const hashedKey = await this.hashApiKey(apiKey);
const keyRecord = await this.apiKeyRepository.findByHash(hashedKey);

if (!keyRecord || keyRecord.expiresAt < new Date()) {
  throw new UnauthorizedError("Invalid API key");
}

// Log API key usage
await this.auditService.logApiUsage(keyRecord.id, req);
```

### Data Protection

- Encrypt PII at rest
- Use TLS 1.3 for data in transit
- Implement field-level encryption for sensitive data
- Regular key rotation
- Secure key storage (HSM/KMS)

### Monitoring and Alerting

```typescript
// Security event monitoring
export class SecurityMonitor {
  async detectAnomalies(): Promise<void> {
    const events = await this.getRecentSecurityEvents();

    for (const detector of this.anomalyDetectors) {
      const anomalies = await detector.analyze(events);

      if (anomalies.length > 0) {
        await this.alertService.sendSecurityAlert({
          type: detector.type,
          severity: detector.severity,
          anomalies,
        });
      }
    }
  }
}
```

## Common Security Patterns

### CSRF Protection

```typescript
app.use(
  csrf({
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    },
  })
);

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});
```

### Content Security

```typescript
// File upload security
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});
```

## Dependencies

- Node.js 18+
- TypeScript 5+
- Argon2 for password hashing
- JWT for tokens
- Helmet for security headers
- Express-rate-limit
- CSRF protection
- Input validation libraries
- Encryption libraries
