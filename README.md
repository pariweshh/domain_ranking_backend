# Domain Ranking API

A NestJS backend API to look up website rankings using the Tranco list.

## What is Tranco?

Tranco is a research-oriented ranking of the top 1 million websites. It combines data from multiple sources to create a more reliable ranking than any single source.

## Features

- 🔍 **Domain Lookup** - Get the rank of any domain
- 📊 **Top Domains** - Browse the highest-ranked websites
- 🔎 **Search** - Find domains containing a keyword
- 🛡️ **Rate Limiting** - Prevents API abuse (20 requests/minute)
- 📝 **Logging** - Structured logs for debugging

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (with auto-reload)
npm run start:dev

# Or start production server
npm run build
npm run start:prod
```

Server runs on http://localhost:3000

## API Endpoints

| Method | Endpoint            | Description          | Example                       |
| ------ | ------------------- | -------------------- | ----------------------------- |
| GET    | `/api/rank/:domain` | Get rank of a domain | `/api/rank/google.com`        |
| GET    | `/api/top`          | Get top domains      | `/api/top?limit=10`           |
| GET    | `/api/search`       | Search domains       | `/api/search?q=goog&limit=10` |
| GET    | `/api/health`       | Health check         | `/api/health`                 |

## Example Responses

### Get Domain Rank

```bash
curl http://localhost:3000/api/rank/google.com
```

```json
{
  "domain": "google.com",
  "rank": 1
}
```

### Get Top Domains

```bash
curl "http://localhost:3000/api/top?limit=3"
```

```json
[
  { "rank": 1, "domain": "google.com" },
  { "rank": 2, "domain": "facebook.com" },
  { "rank": 3, "domain": "microsoft.com" }
]
```

### Search Domains

```bash
curl "http://localhost:3000/api/search?q=goog&limit=3"
```

```json
[
  { "rank": 1, "domain": "google.com" },
  { "rank": 42, "domain": "googleapis.com" },
  { "rank": 156, "domain": "googlevideo.com" }
]
```

## Project Structure

```
domain-ranking-api/
├── src/
│   ├── main.ts              # Entry point - starts the server
│   ├── app.module.ts        # Root module - wires everything together
│   └── tranco/
│       ├── tranco.module.ts     # Feature module
│       ├── tranco.controller.ts # HTTP request handlers
│       ├── tranco.service.ts    # Business logic
│       └── tranco.dto.ts        # Data Transfer Objects (validation)
├── package.json
├── tsconfig.json
├── nest-cli.json
├── .env                     # Environment variables
└── .gitignore
```

## Architecture

```
HTTP Request
     │
     ▼
┌─────────────────┐
│   Controller    │  ← Handles HTTP, extracts parameters
│  (tranco.controller.ts)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Service      │  ← Business logic, data storage
│  (tranco.service.ts)
│                 │
│  ┌───────────┐  │
│  │   Map     │  │  ← In-memory storage for fast lookups
│  │ (domains) │  │
│  └───────────┘  │
└─────────────────┘
```

## Key NestJS Concepts

### 1. Modules

Organize code into feature groups. `AppModule` is the root that imports everything.

### 2. Controllers

Handle HTTP requests using decorators like `@Get()`, `@Param()`, `@Query()`.

### 3. Services

Contain business logic. Marked with `@Injectable()` for dependency injection.

### 4. Dependency Injection

NestJS automatically creates and provides class instances:

```typescript
constructor(private trancoService: TrancoService) {}
// NestJS creates TrancoService and passes it here
```

### 5. Lifecycle Hooks

`onModuleInit()` runs when the module starts - perfect for loading data.

### 6. Guards (Throttler)

Rate limiting to prevent API abuse. Applied globally in `AppModule`.

### 7. DTOs (Data Transfer Objects)

Define and validate incoming data:

```typescript
class GetTopDomainsDto {
  @IsInt() // Must be integer
  @Min(1) // At least 1
  @Max(100) // At most 100
  @IsOptional() // Not required
  limit?: number = 10;
}
```

### 8. ValidationPipe

Automatically validates requests against DTOs:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // Strip unknown properties
    transform: true, // Convert types automatically
  }),
);
```

## Environment Variables

| Variable         | Description             | Default                               |
| ---------------- | ----------------------- | ------------------------------------- |
| `PORT`           | Server port             | 3000                                  |
| `TRANCO_CSV_URL` | Tranco data URL         | https://tranco-list.eu/top-1m.csv.zip |
| `THROTTLE_LIMIT` | Max requests per window | 20                                    |
| `THROTTLE_TTL`   | Time window (seconds)   | 60                                    |

## Technologies

- **NestJS** - Node.js framework with TypeScript
- **Express** - HTTP server (used internally by NestJS)
- **Axios** - HTTP client for downloading data
- **csv-parse** - CSV parsing
- **@nestjs/throttler** - Rate limiting

## License

MIT
