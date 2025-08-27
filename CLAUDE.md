# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Authelia Admin interface built with SvelteKit, TypeScript, and Tailwind CSS. The application provides a web interface for managing Authelia authentication services and integrates with LLDAP for user management.

## Tech Stack

- **Framework**: SvelteKit with Svelte 5
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS v4 with shadcn-svelte components
- **Build Tool**: Vite
- **Deployment**: Node adapter, builds to `build/` directory
- **Container**: Docker with multi-stage build

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (port 5173)
npm run dev

# Type checking with hot reload
npm run check:watch

# Single type check
npm run check

# Build for production
npm run build

# Preview production build (port 9093)
npm run preview
```

## Make Commands

The project includes a comprehensive Makefile:

```bash
make dev           # Start development server
make build         # Build for production  
make test          # Run type checking
make preview       # Preview production build
make clean         # Remove dist and node_modules
make rebuild       # Clean install and build

# Docker commands
make docker-build  # Build Docker image
make docker-run    # Run container on port 9093
make docker        # Build and run

# Docker Compose with test environment
make docker-compose-run    # Run full test stack with Authelia, LLDAP, Traefik
make docker-compose-run-d  # Run in detached mode
```

## Architecture

### Directory Structure

- `/src/routes/` - SvelteKit pages and layouts
- `/src/lib/` - Shared utilities and components
  - `utils.ts` - Utility functions including `cn()` for class names
- `/src/app.css` - Global styles with Tailwind imports
- `/test-configs/` - Configuration files for test environment
  - `authelia/` - Authelia configuration
  - `lldap/` - LLDAP configuration and bootstrap scripts
  - `traefik/` - Traefik reverse proxy configuration

### Key Configuration

- **Production Port**: 9093 (set in Dockerfile and preview script)
- **Build Output**: `build/` directory (Node adapter)
- **Path Aliases**: `$lib` maps to `./src/lib`

### Test Environment

The project includes a complete Docker Compose setup for testing:
- **Authelia**: Authentication service on port 9091
- **LLDAP**: LDAP server on ports 3890 (LDAP) and 17170 (web UI)
- **Traefik**: Reverse proxy on port 443
- Test data is stored in `.test-data/` directory

### Styling System

- Uses Tailwind CSS v4 with custom variants
- shadcn-svelte component library integrated
- `cn()` utility function for merging class names with clsx and tailwind-merge

## Important Notes

- TypeScript strict mode is enabled - ensure all types are properly defined
- The project uses Svelte 5 with new runes syntax (`$props()`, `@render`)
- Docker builds use multi-stage process for optimized production images
- Health checks are configured for all services in Docker Compose