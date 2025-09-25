# Database Agent - Implementation

## Agent Type

`database-agent`

## Core Responsibilities

- Design and implement database schemas
- Create migration scripts
- Optimize database queries
- Set up proper indexing strategies
- Implement data validation constraints
- Create seed data scripts
- Handle database transactions
- Implement backup and recovery procedures
- Set up database monitoring
- Manage database connections and pooling

## Required Context

- Task ID: [TASK_ID]
- Task Name: [TASK_NAME]
- Description: [TASK_DESCRIPTION]
- Acceptance Criteria: [ACCEPTANCE_CRITERIA]
- Dependencies: [DEPENDENCIES]
- Context Documentation: [CONTEXT_DOCS]
- Data Model Requirements: [DATA_MODEL_SPECS]
- Performance Requirements: [PERFORMANCE_TARGETS]

## Implementation Guidelines

### Schema Design Pattern

```sql
-- migrations/001_create_users_table.sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT chk_role CHECK (role IN ('USER', 'ADMIN', 'MODERATOR')),
    CONSTRAINT chk_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED'))
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_username ON users(username) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_status ON users(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- Audit trigger
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### Migration Management

```typescript
// migrations/migration-runner.ts
export class MigrationRunner {
  private migrations: Migration[] = [];

  async run(): Promise<void> {
    const appliedMigrations = await this.getAppliedMigrations();
    const pendingMigrations = this.migrations.filter(
      (m) => !appliedMigrations.includes(m.id)
    );

    for (const migration of pendingMigrations) {
      await this.runMigration(migration);
    }
  }

  private async runMigration(migration: Migration): Promise<void> {
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");

      // Run migration
      await migration.up(client);

      // Record migration
      await client.query(
        "INSERT INTO migrations (id, name, applied_at) VALUES ($1, $2, $3)",
        [migration.id, migration.name, new Date()]
      );

      await client.query("COMMIT");
      console.log(`Applied migration: ${migration.name}`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`Migration failed: ${migration.name} - ${error.message}`);
    } finally {
      client.release();
    }
  }
}
```

### Repository Pattern Implementation

```typescript
// repositories/base.repository.ts
export abstract class BaseRepository<T> {
  constructor(
    protected pool: Pool,
    protected tableName: string
  ) {}

  async findById(id: string): Promise<T | null> {
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE id = $1 AND deleted_at IS NULL
    `;

    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async findAll(options: FindOptions = {}): Promise<PaginatedResult<T>> {
    const {
      page = 1,
      limit = 20,
      orderBy = "created_at",
      orderDirection = "DESC",
      filters = {},
    } = options;

    const offset = (page - 1) * limit;
    const conditions = this.buildWhereClause(filters);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) FROM ${this.tableName} 
      WHERE deleted_at IS NULL ${conditions.where}
    `;
    const countResult = await this.pool.query(countQuery, conditions.values);
    const total = parseInt(countResult.rows[0].count);

    // Get paginated data
    const dataQuery = `
      SELECT * FROM ${this.tableName} 
      WHERE deleted_at IS NULL ${conditions.where}
      ORDER BY ${orderBy} ${orderDirection}
      LIMIT $${conditions.values.length + 1} 
      OFFSET $${conditions.values.length + 2}
    `;

    const dataResult = await this.pool.query(dataQuery, [
      ...conditions.values,
      limit,
      offset,
    ]);

    return {
      data: dataResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(data: Partial<T>): Promise<T> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map((_, i) => `$${i + 1}`).join(", ");

    const query = `
      INSERT INTO ${this.tableName} (${fields.join(", ")})
      VALUES (${placeholders})
      RETURNING *
    `;

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(", ");

    const query = `
      UPDATE ${this.tableName}
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING *
    `;

    const result = await this.pool.query(query, [id, ...values]);
    return result.rows[0] || null;
  }

  async softDelete(id: string): Promise<boolean> {
    const query = `
      UPDATE ${this.tableName}
      SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
    `;

    const result = await this.pool.query(query, [id]);
    return result.rowCount > 0;
  }

  async transaction<R>(fn: (client: PoolClient) => Promise<R>): Promise<R> {
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");
      const result = await fn(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  private buildWhereClause(filters: Record<string, any>): {
    where: string;
    values: any[];
  } {
    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    for (const [field, value] of Object.entries(filters)) {
      if (value === null || value === undefined) continue;

      if (Array.isArray(value)) {
        const placeholders = value
          .map((_, i) => `$${paramIndex + i}`)
          .join(", ");
        conditions.push(`${field} IN (${placeholders})`);
        values.push(...value);
        paramIndex += value.length;
      } else if (typeof value === "object" && value.min !== undefined) {
        conditions.push(`${field} >= $${paramIndex}`);
        values.push(value.min);
        paramIndex++;

        if (value.max !== undefined) {
          conditions.push(`${field} <= $${paramIndex}`);
          values.push(value.max);
          paramIndex++;
        }
      } else {
        conditions.push(`${field} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    return {
      where: conditions.length > 0 ? ` AND ${conditions.join(" AND ")}` : "",
      values,
    };
  }
}
```

### Query Optimization

```typescript
// utils/query-optimizer.ts
export class QueryOptimizer {
  async analyzeQuery(query: string): Promise<QueryAnalysis> {
    const explainQuery = `EXPLAIN (ANALYZE, BUFFERS) ${query}`;
    const result = await this.pool.query(explainQuery);

    return this.parseExplainOutput(result.rows);
  }

  async suggestIndexes(tableName: string): Promise<IndexSuggestion[]> {
    // Analyze table statistics
    const statsQuery = `
      SELECT 
        schemaname,
        tablename,
        attname,
        n_distinct,
        correlation
      FROM pg_stats
      WHERE tablename = $1
    `;

    const stats = await this.pool.query(statsQuery, [tableName]);

    // Analyze slow queries
    const slowQueriesQuery = `
      SELECT 
        query,
        calls,
        mean_exec_time,
        total_exec_time
      FROM pg_stat_statements
      WHERE query LIKE $1
      ORDER BY mean_exec_time DESC
      LIMIT 10
    `;

    const slowQueries = await this.pool.query(slowQueriesQuery, [
      `%${tableName}%`,
    ]);

    return this.generateIndexSuggestions(stats.rows, slowQueries.rows);
  }

  async optimizeConnection(config: PoolConfig): Promise<PoolConfig> {
    const optimized = { ...config };

    // Analyze workload
    const workloadQuery = `
      SELECT 
        COUNT(*) as total_connections,
        COUNT(*) FILTER (WHERE state = 'active') as active_connections,
        COUNT(*) FILTER (WHERE state = 'idle') as idle_connections
      FROM pg_stat_activity
      WHERE datname = current_database()
    `;

    const workload = await this.pool.query(workloadQuery);
    const { total_connections, active_connections } = workload.rows[0];

    // Optimize pool size
    optimized.max = Math.max(20, Math.ceil(active_connections * 1.5));
    optimized.idleTimeoutMillis = 30000;
    optimized.connectionTimeoutMillis = 5000;

    return optimized;
  }
}
```

### Data Seeding

```typescript
// seeds/seed-runner.ts
export class SeedRunner {
  async run(environment: "development" | "staging"): Promise<void> {
    console.log(`Running seeds for ${environment} environment`);

    await this.transaction(async (client) => {
      // Clear existing data
      await this.clearData(client);

      // Seed users
      const users = await this.seedUsers(client, 100);

      // Seed related data
      await this.seedUserProfiles(client, users);
      await this.seedResources(client, users, 500);
      await this.seedActivities(client, users, 1000);
    });

    console.log("Seeding completed successfully");
  }

  private async seedUsers(client: PoolClient, count: number): Promise<User[]> {
    const users: User[] = [];

    for (let i = 0; i < count; i++) {
      const user = {
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password_hash: await bcrypt.hash("password123", 10),
        full_name: faker.person.fullName(),
        role: faker.helpers.arrayElement(["USER", "ADMIN", "MODERATOR"]),
        status: "ACTIVE",
        email_verified: faker.datatype.boolean(),
      };

      const result = await client.query(
        `INSERT INTO users (email, username, password_hash, full_name, role, status, email_verified)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        Object.values(user)
      );

      users.push(result.rows[0]);
    }

    return users;
  }
}
```

### Database Monitoring

```sql
-- monitoring/health-checks.sql
-- Check table sizes
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check slow queries
SELECT
    query,
    calls,
    mean_exec_time,
    total_exec_time,
    stddev_exec_time
FROM pg_stat_statements
WHERE mean_exec_time > 100
ORDER BY mean_exec_time DESC
LIMIT 20;

-- Check index usage
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;

-- Check connection stats
SELECT
    datname,
    numbackends,
    xact_commit,
    xact_rollback,
    blks_read,
    blks_hit,
    tup_returned,
    tup_fetched,
    tup_inserted,
    tup_updated,
    tup_deleted
FROM pg_stat_database
WHERE datname = current_database();
```

### Backup Strategy

```typescript
// backup/backup-manager.ts
export class BackupManager {
  async createBackup(): Promise<BackupResult> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `backup-${timestamp}.sql`;

    // Create backup
    const command = `pg_dump ${this.connectionString} -f ${filename} --verbose`;
    await exec(command);

    // Compress backup
    await exec(`gzip ${filename}`);

    // Upload to S3
    const uploadResult = await this.uploadToS3(`${filename}.gz`);

    // Clean up local file
    await fs.unlink(`${filename}.gz`);

    return {
      filename: `${filename}.gz`,
      size: uploadResult.size,
      location: uploadResult.location,
      timestamp: new Date(),
    };
  }

  async restoreBackup(backupId: string): Promise<void> {
    // Download from S3
    const localFile = await this.downloadFromS3(backupId);

    // Decompress
    await exec(`gunzip ${localFile}`);
    const sqlFile = localFile.replace(".gz", "");

    // Restore database
    const command = `psql ${this.connectionString} -f ${sqlFile}`;
    await exec(command);

    // Clean up
    await fs.unlink(sqlFile);
  }

  async scheduleBackups(): Promise<void> {
    // Daily backups at 2 AM
    cron.schedule("0 2 * * *", async () => {
      try {
        await this.createBackup();
        await this.cleanupOldBackups(30); // Keep 30 days
      } catch (error) {
        this.logger.error("Backup failed", error);
      }
    });
  }
}
```

## Quality Checks

1. **Schema Validation**
   - All tables have primary keys
   - Foreign key constraints defined
   - Proper indexes for common queries
   - Check constraints for data integrity

2. **Performance Testing**

   ```bash
   npm run db:analyze
   ```

3. **Migration Testing**
   - Test migrations up and down
   - Verify data integrity
   - Check for blocking operations

4. **Query Performance**
   - EXPLAIN ANALYZE critical queries
   - Ensure queries use indexes
   - No N+1 query problems

5. **Connection Pool Health**
   - Monitor active connections
   - Check for connection leaks
   - Verify timeout settings

## Output Format

### Deliverables

1. **Database Files**
   - `migrations/*.sql` - Migration scripts
   - `schemas/*.sql` - Schema definitions
   - `indexes/*.sql` - Index definitions
   - `seeds/*.ts` - Seed data scripts
   - `monitoring/*.sql` - Monitoring queries

2. **Code Files**
   - `repositories/*.repository.ts` - Data access layer
   - `models/*.model.ts` - Model definitions
   - `utils/db-*.ts` - Database utilities

3. **Documentation**
   - ERD diagrams
   - Data dictionary
   - Migration guide
   - Backup procedures

4. **Integration Points**
   ```typescript
   interface DatabaseOutputs {
     schemas: SchemaDefinition[];
     migrations: Migration[];
     repositories: RepositoryDefinition[];
     indexes: IndexDefinition[];
     constraints: ConstraintDefinition[];
   }
   ```

### Success Metrics

- [ ] All acceptance criteria met
- [ ] Query performance <100ms for reads
- [ ] Proper indexing strategy
- [ ] Zero data integrity issues
- [ ] Backup strategy implemented
- [ ] Migration rollback tested
- [ ] Connection pooling optimized
- [ ] Monitoring dashboards created

## Best Practices

### Schema Design

- Use UUIDs for primary keys
- Include audit columns (created_at, updated_at)
- Implement soft deletes where appropriate
- Use proper data types (avoid VARCHAR(MAX))
- Normalize to 3NF minimum

### Query Patterns

```sql
-- Use CTEs for complex queries
WITH user_stats AS (
  SELECT
    user_id,
    COUNT(*) as resource_count,
    MAX(created_at) as last_activity
  FROM resources
  WHERE deleted_at IS NULL
  GROUP BY user_id
)
SELECT
  u.*,
  COALESCE(s.resource_count, 0) as resource_count,
  s.last_activity
FROM users u
LEFT JOIN user_stats s ON u.id = s.user_id
WHERE u.status = 'ACTIVE';
```

### Transaction Management

```typescript
// Use savepoints for nested transactions
await client.query("SAVEPOINT sp1");
try {
  await riskyOperation(client);
  await client.query("RELEASE SAVEPOINT sp1");
} catch (error) {
  await client.query("ROLLBACK TO SAVEPOINT sp1");
  throw error;
}
```

### Connection Management

```typescript
// Always release connections
const client = await pool.connect();
try {
  return await operation(client);
} finally {
  client.release();
}
```

## Common Patterns

### Audit Trail

```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR(100) NOT NULL,
  record_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL,
  old_values JSONB,
  new_values JSONB,
  user_id UUID,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at DESC);
```

### Full-Text Search

```sql
-- Add search vector column
ALTER TABLE resources ADD COLUMN search_vector tsvector;

-- Update search vector
UPDATE resources SET search_vector =
  setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'B');

-- Create GIN index
CREATE INDEX idx_resources_search ON resources USING GIN(search_vector);

-- Search query
SELECT * FROM resources
WHERE search_vector @@ plainto_tsquery('english', 'search terms')
ORDER BY ts_rank(search_vector, plainto_tsquery('english', 'search terms')) DESC;
```

## Dependencies

- PostgreSQL 14+
- Node.js database drivers
- Migration tool (node-pg-migrate)
- Connection pooling (pg-pool)
- Query builder (optional)
- Monitoring tools
- Backup utilities
