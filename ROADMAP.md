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
- workout schema added
- workout create/list APIs implemented
- workout persistence linked to the authenticated trainer
- workout create API now accepts partially empty fields and zero values
- workout integration coverage added
- availability slot schema and migration added
- availability create API implemented with required:
  - dates
  - start time
  - end time
  - session name
- repeat-session backend creation implemented through multiple selected dates
- screen 1 unit, integration, smoke, lint, and build validation completed
- backend Docker image added
- shared local Docker compose runtime added

## Current Step

- implement the booking data model and booking APIs needed by the next screen

## Next Steps

- add relational models for bookings
- implement booking APIs for:
  - list bookable slots
  - create booking
  - list bookings
- keep auth enforcement strict on all protected routes
- extend the relational model through Prisma migrations only

## Master Sequence

1. Setup repos + tooling
2. Backend base (NestJS + Prisma)
3. DB schema + migrations
4. Auth (Google)
5. Workout schema
6. Workout APIs
7. Availability schema
8. Availability APIs
9. Booking schema
10. Booking APIs
11. Frontend ↔ backend integration
12. Full e2e coverage for the shown flows
13. Docker validation
14. CI/CD

## Bare-Minimum Backend Functional List From Current Screens

1. Protected auth session for all post-login screens
2. Workout data model:
   - workout plans
   - workout days
   - exercises
3. Workout functionality:
   - list workout plans
   - create workout plan
   - persist workouts per authenticated trainer
4. Exercise fields:
   - name
   - sets
   - reps
5. Availability data model:
   - date
   - start time
   - end time
   - repeat flag
   - session name
6. Availability functionality:
   - create slots
   - repeat-session expansion in backend
7. Booking data model:
   - booking linked to user and slot
   - slot status
8. Booking functionality:
   - list bookable slots
   - create booking
   - list bookings
9. No extra backend scope beyond the shown screens
