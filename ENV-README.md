# ACOT Environment Configuration

This document explains how to use the environment configuration and build system for ACOT frontend.

## Environment Files

ACOT uses environment variables for configuration. The following environment files are available:

- `.env` - Default environment variables loaded in all cases
- `.env.development` - Development environment variables (loaded when running in development mode)
- `.env.production` - Production environment variables (loaded when running in production mode)

## Available Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Base URL for API requests | `/api` (development), `https://api.acot-app.com` (production) |
| `VITE_ENV` | Current environment | `development` or `production` |
| `VITE_ENABLE_MOCK_API` | Whether to use mock API implementations | `true` (development), `false` (production) |
| `VITE_LOG_LEVEL` | Logging level | `debug` (development), `error` (production) |

## Build Commands

The following npm scripts are available for building and running the application:

### Development

```bash
# Start development server with hot reloading
npm run dev

# Build for development environment
npm run build:dev

# Preview development build
npm run preview:dev
```

### Production

```bash
# Build for production environment
npm run build:prod
# or
npm run build  # Default is production

# Preview production build
npm run preview:prod
# or
npm run preview  # Default is production
```

## API Configuration

The application uses a dynamic API configuration system that can switch between mock implementations and real API calls based on the `VITE_ENABLE_MOCK_API` environment variable.

### Mock API

When `VITE_ENABLE_MOCK_API` is set to `true`, the application will use mock implementations that simulate API responses without making actual network requests. This is useful for development and testing.

### Real API

When `VITE_ENABLE_MOCK_API` is set to `false`, the application will make real API requests to the URL specified in `VITE_API_BASE_URL`.

## Adding Custom Environment Variables

To add new environment variables:

1. Add the variable to the appropriate `.env` files
2. Update the type definitions in `src/types/env.d.ts`
3. Access the variable in your code using `import.meta.env.VITE_YOUR_VARIABLE`

Note: All environment variables must be prefixed with `VITE_` to be exposed to the client-side code. 