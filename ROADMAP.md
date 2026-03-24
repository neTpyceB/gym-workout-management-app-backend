# Backend Roadmap

## Completed

- repository inspected
- mandatory documentation created
- backend `.gitignore` created
- screen 1 implementation plan defined
- NestJS backend scaffolded
- Prisma auth schema and migration added
- Google OAuth redirect start and callback implemented
- JWT issuance and protected auth lookup implemented
- screen 1 unit, integration, smoke, lint, and build validation completed
- backend Docker image added
- shared local Docker compose runtime added

## Current Step

- waiting for Google OAuth env configuration and the next backend scope

## Next Steps

- implement the next screenshot-defined backend scope only
- extend the relational model through Prisma migrations only
- keep auth enforcement strict on all protected routes

## Master Sequence

1. Setup repos + tooling
2. Backend base (NestJS + Prisma)
3. DB schema + migrations
4. Auth (Google)
5. Workout module
6. Availability module
7. Booking module
8. Frontend base
9. Screens implementation
10. Integration (frontend ↔ backend)
11. Full e2e tests
12. Dockerization
13. CI/CD
