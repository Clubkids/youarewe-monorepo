# Perth Music Community Forum

A desktop-focused music community forum for Perth using Next.js, Strapi, and PostgreSQL.

## Project Structure

This project uses a monorepo architecture with Turborepo:

- `apps/web`: Next.js frontend
- `apps/api`: Strapi backend
- `packages/ui`: Shared UI components
- `packages/utils`: Shared utilities
- `packages/api-client`: Shared API client

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and update variables
4. Start development server: `npm run dev`

## Development Commands

- `npm run dev`: Start development servers
- `npm run build`: Build all packages and applications
- `npm run start`: Start all applications
- `npm run lint`: Run linting
- `npm run format`: Format code with Prettier

## Deployment

- Frontend: `npm run deploy:web`
- Backend: `npm run deploy:api`
