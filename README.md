# ScreenAPI - Professional Screenshot API Service

A production-ready screenshot API service built with Next.js, TypeScript, Playwright, and Prisma. Capture high-quality screenshots of any website with a simple REST API call.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)

## 🚀 Features

- **High-Quality Screenshots** - Powered by Playwright for pixel-perfect captures
- **Multiple Formats** - Support for PNG, JPEG, and WebP
- **Flexible Viewports** - Desktop, Mobile, Tablet, or Custom dimensions
- **Advanced Options** - Full-page capture, element hiding, selector waiting
- **Smart Cookie Blocking** - Automatically removes cookie banners
- **API Key Authentication** - Secure access with API key management
- **Rate Limiting** - Built-in Redis-based rate limiting
- **Credit System** - Flexible subscription plans with credit tracking
- **Usage Analytics** - Detailed logging and performance metrics
- **Beautiful Dashboard** - Monitor usage and manage API keys

## 📋 Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running Locally](#running-locally)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Pricing Plans](#pricing-plans)

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Client    │─────▶│  Next.js API │─────▶│  Playwright │
│  (HTTP/S)   │      │   /api/v1/*  │      │   Browser   │
└─────────────┘      └──────────────┘      └─────────────┘
                            │
                            ├─────▶ ┌──────────────┐
                            │       │  PostgreSQL  │
                            │       │   / SQLite   │
                            │       └──────────────┘
                            │
                            └─────▶ ┌──────────────┐
                                    │    Redis     │
                                    │ (Rate Limit) │
                                    └──────────────┘
```

### Key Components

1. **API Layer** (`/app/api/v1/screenshot`)
   - Request validation with Zod
   - API key authentication
   - Rate limiting
   - Credit management
   - Response streaming

2. **Screenshot Engine** (`/lib/screenshot.ts`)
   - Browser pool management
   - Headless Chromium automation
   - Memory optimization
   - Timeout handling

3. **Database Layer** (`/lib/prisma.ts`)
   - User management
   - API key storage
   - Usage logging
   - Subscription tracking

4. **Rate Limiter** (`/lib/rate-limit.ts`)
   - Sliding window algorithm
   - Redis-backed storage
   - Per-key rate limits

## 🛠️ Tech Stack

### Core Technologies
- **Next.js 15** - React framework with App Router
- **TypeScript 5** - Type-safe development
- **Playwright** - Browser automation for screenshots
- **Prisma** - Type-safe ORM
- **Tailwind CSS** - Utility-first CSS

### Infrastructure
- **Database**: PostgreSQL (production) / SQLite (development)
- **Cache/Rate Limiting**: Redis (optional, falls back to in-memory)
- **Storage**: Local filesystem (can be extended to S3/R2)

### Additional Libraries
- **Zod** - Runtime validation
- **Radix UI** - Accessible UI components
- **Lucide Icons** - Icon library
- **ioredis** - Redis client

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Redis (optional, for production rate limiting)
- PostgreSQL (optional, SQLite works for development)

### Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd screenapi

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium

# Install system dependencies (Linux only)
npx playwright install-deps chromium
```

## ⚙️ Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

**Required Variables:**

```env
# Database
DATABASE_URL="file:./dev.db"  # SQLite for dev
# DATABASE_URL="postgresql://user:pass@localhost:5432/screenapi"  # PostgreSQL for production

# NextAuth
NEXTAUTH_URL="http://localhost:43210"
NEXTAUTH_SECRET="your-secret-key-change-in-production"

# Application
NEXT_PUBLIC_APP_NAME="ScreenAPI"
NEXT_PUBLIC_APP_URL="http://localhost:43210"
```

**Optional Variables:**

```env
# Redis (for production rate limiting)
REDIS_URL="redis://localhost:6379"

# Stripe (for payments)
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxx"

# Storage (S3-compatible)
STORAGE_ENDPOINT=""
STORAGE_ACCESS_KEY_ID=""
STORAGE_SECRET_ACCESS_KEY=""
STORAGE_BUCKET_NAME="screenshots"
```

## 💾 Database Setup

### Development (SQLite)

```bash
# Generate Prisma client
npx prisma generate

# Create database and tables
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### Production (PostgreSQL)

```bash
# Update DATABASE_URL in .env to PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/screenapi"

# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

## 🚀 Running Locally

### 1. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:43210`

### 2. Create a Demo User and API Key

```bash
curl -X POST http://localhost:43210/api/admin/setup
```

This will return:

```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "demo@screenapi.dev",
    "name": "Demo User"
  },
  "apiKey": "sk_live_abc123...",
  "subscription": {
    "plan": "FREE",
    "creditsTotal": 100,
    "creditsRemaining": 100
  }
}
```

**Copy the API key** - you'll need it for requests!

### 3. Test the API

```bash
curl -X POST http://localhost:43210/api/v1/screenshot \
  -H "x-api-key: YOUR_API_KEY_FROM_STEP_2" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "format": "PNG"
  }' \
  --output test-screenshot.png
```

If successful, you'll have a `test-screenshot.png` file!

## 📖 API Documentation

### Authentication

All requests require an API key in the header:

```
x-api-key: sk_live_your_api_key_here
```

### POST /api/v1/screenshot

Capture a screenshot of a webpage.

**Request Body:**

```typescript
{
  url: string;                    // Required: URL to capture
  format?: 'PNG' | 'JPEG' | 'WEBP';  // Default: PNG
  quality?: number;               // 1-100, JPEG only
  viewportType?: 'DESKTOP' | 'MOBILE' | 'TABLET' | 'CUSTOM';
  viewportWidth?: number;         // Required if viewportType is CUSTOM
  viewportHeight?: number;        // Required if viewportType is CUSTOM
  fullPage?: boolean;             // Default: false
  waitForSelector?: string;       // CSS selector to wait for
  waitForTimeout?: number;        // Default: 30000ms
  hideElements?: string[];        // CSS selectors to hide
  blockCookies?: boolean;         // Default: true
  blockAds?: boolean;             // Default: false
}
```

**Response:**

- Binary image data (PNG/JPEG/WEBP)
- Headers include metadata:
  - `X-Screenshot-Width`
  - `X-Screenshot-Height`
  - `X-Processing-Time-Ms`
  - `X-Credits-Used`
  - `X-Credits-Remaining`
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`

**Examples:**

```bash
# Basic screenshot
curl -X POST http://localhost:43210/api/v1/screenshot \
  -H "x-api-key: sk_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}' \
  --output screenshot.png

# Mobile viewport
curl -X POST http://localhost:43210/api/v1/screenshot \
  -H "x-api-key: sk_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "viewportType": "MOBILE"
  }' \
  --output mobile.png

# Full page with custom dimensions
curl -X POST http://localhost:43210/api/v1/screenshot \
  -H "x-api-key: sk_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "fullPage": true,
    "format": "WEBP",
    "viewportType": "CUSTOM",
    "viewportWidth": 1280,
    "viewportHeight": 720
  }' \
  --output fullpage.webp
```

### Error Responses

```typescript
// 401 Unauthorized
{
  "error": "Invalid API key",
  "message": "The provided API key is invalid, expired, or inactive"
}

// 402 Payment Required
{
  "error": "Insufficient credits",
  "message": "You have used all your credits...",
  "creditsUsed": 100,
  "creditsTotal": 100,
  "creditsRemaining": 0
}

// 429 Too Many Requests
{
  "error": "Rate limit exceeded",
  "message": "You have exceeded the rate limit...",
  "retryAfter": 42
}

// 500 Internal Server Error
{
  "error": "Screenshot failed",
  "message": "Timeout: page.goto: Timeout 30000ms exceeded"
}
```

Visit `/docs` in your browser for interactive documentation.

## 🌐 Deployment

### Option 1: Vercel (Recommended)

Vercel is ideal for Next.js applications:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Important Notes for Vercel:**

1. **Playwright Requirements**: Add to `package.json`:
   ```json
   {
     "scripts": {
       "vercel-build": "npx playwright install chromium && next build"
     }
   }
   ```

2. **Environment Variables**: Set in Vercel dashboard
   - `DATABASE_URL` (use Vercel Postgres or external PostgreSQL)
   - `REDIS_URL` (use Upstash Redis)
   - All other variables from `.env.example`

3. **Function Timeout**: Increase to 60s for Pro plans

### Option 2: AWS Lambda with Serverless

```bash
# Install serverless
npm i -g serverless

# Deploy
serverless deploy
```

### Option 3: Fly.io

Excellent for long-running processes:

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Launch app
fly launch

# Deploy
fly deploy
```

### Option 4: Docker

```dockerfile
FROM node:18-alpine

# Install Chromium dependencies
RUN apk add --no-cache chromium

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser

CMD ["npm", "start"]
```

### Database Recommendations

**Production Databases:**
- [Neon](https://neon.tech) - Serverless PostgreSQL
- [PlanetScale](https://planetscale.com) - Serverless MySQL
- [Supabase](https://supabase.com) - PostgreSQL with real-time
- [Railway](https://railway.app) - PostgreSQL hosting

**Redis Services:**
- [Upstash](https://upstash.com) - Serverless Redis
- [Redis Cloud](https://redis.com/cloud) - Managed Redis
- [Railway](https://railway.app) - Redis hosting

## 📁 Project Structure

```
screenapi/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   └── screenshot/
│   │   │       └── route.ts          # Main screenshot endpoint
│   │   └── admin/
│   │       └── setup/
│   │           └── route.ts          # Dev setup endpoint
│   ├── dashboard/
│   │   └── page.tsx                  # User dashboard
│   ├── docs/
│   │   └── page.tsx                  # API documentation
│   ├── layout.tsx
│   └── page.tsx                      # Landing page
├── components/
│   └── ui/                           # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       └── input.tsx
├── lib/
│   ├── prisma.ts                     # Database client
│   ├── redis.ts                      # Redis client with mock fallback
│   ├── rate-limit.ts                 # Rate limiting logic
│   ├── api-key.ts                    # API key management
│   ├── screenshot.ts                 # Screenshot capture engine
│   └── utils.ts                      # Utility functions
├── prisma/
│   └── schema.prisma                 # Database schema
├── .env                              # Environment variables
├── .env.example                      # Environment template
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS config
├── tsconfig.json                     # TypeScript config
└── package.json
```

## 💰 Pricing Plans

### Database Schema

The credit system is implemented in the `Subscription` model:

```prisma
model Subscription {
  plan                Plan    // FREE, PRO, ENTERPRISE
  creditsTotal        Int     // Monthly credits
  creditsUsed         Int     // Used this period
  creditsRemaining    Int     // Remaining credits
  // ... Stripe integration fields
}
```

### Default Plans

| Plan       | Credits/Month | Rate Limit    | Price/Month |
|------------|---------------|---------------|-------------|
| Free       | 100           | 10 req/min    | $0          |
| Pro        | 5,000         | 60 req/min    | $29         |
| Enterprise | 50,000        | 300 req/min   | $199        |

### Stripe Integration

To enable payments:

1. Create Stripe Price IDs
2. Add to `.env`:
   ```env
   STRIPE_SECRET_KEY="sk_test_xxx"
   STRIPE_WEBHOOK_SECRET="whsec_xxx"
   STRIPE_PRICE_ID_PRO="price_xxx"
   STRIPE_PRICE_ID_ENTERPRISE="price_xxx"
   ```
3. Implement webhook handler in `/app/api/webhooks/stripe`

## 🔒 Security Best Practices

1. **API Keys**: Never expose in client-side code
2. **Rate Limiting**: Enabled by default, uses Redis
3. **Validation**: All inputs validated with Zod
4. **Database**: Parameterized queries via Prisma
5. **CORS**: Configure in `next.config.ts` for production
6. **Timeouts**: 30s default for screenshot captures

## 🐛 Troubleshooting

### Playwright Installation Issues

```bash
# Linux: Install system dependencies
npx playwright install-deps chromium

# macOS: Ensure Xcode CLI tools
xcode-select --install

# Windows: Run as administrator
```

### Database Connection Issues

```bash
# Check database
npx prisma studio

# Reset database (development only!)
npx prisma migrate reset
```

### Port Already in Use

Change the port in `package.json`:

```json
{
  "scripts": {
    "dev": "next dev -p 3001"
  }
}
```

## 📊 Performance Optimization

1. **Browser Pooling**: Reuses browser instances
2. **Memory Management**: Automatic cleanup after 5min idle
3. **Concurrency**: Single-process mode for Lambda
4. **Caching**: Redis for rate limiting
5. **Response Streaming**: Direct binary response

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - feel free to use for commercial projects.

## 🙋 Support

- Documentation: Visit `/docs` in your running app
- Issues: GitHub Issues
- Email: support@screenapi.dev

## 🎯 Roadmap

- [ ] Bulk screenshot endpoints
- [ ] Webhook notifications
- [ ] Screenshot scheduling
- [ ] Video recording
- [ ] PDF generation
- [ ] Custom JavaScript injection
- [ ] Screenshot comparison/diffing
- [ ] Team management
- [ ] Usage dashboards
- [ ] Zapier integration

## ⭐ Credits

Built with:
- [Next.js](https://nextjs.org)
- [Playwright](https://playwright.dev)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://radix-ui.com)

---

**Made with ❤️ for developers who need reliable screenshots**
