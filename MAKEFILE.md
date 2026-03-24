# Backend Make Targets

## Current State

No `Makefile` exists yet. The current command surface is npm-based:

- `npm run lint`
- `npm test`
- `npm run test:unit`
- `npm run test:integration`
- `npm run test:smoke`
- `npm run build`
- `npm run prisma:generate`
- `npm run prisma:migrate`

Shared container commands:

- from `/Users/vadimsduboiss/Codebase`: `docker compose up --build`
- from `/Users/vadimsduboiss/Codebase`: `docker compose down -v`

This document must be replaced or updated if a real `Makefile` is added.
