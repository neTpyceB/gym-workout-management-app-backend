# Backend Agent Instructions

## Purpose

Persist project instructions for future AI and human contributors.

## Non-Negotiable Rules

- create a plan before implementing anything
- keep [`ROADMAP.md`](./ROADMAP.md) updated at all times
- implement only screenshot-defined scope
- do not add extra features
- keep code minimal and strict
- functionality must fully work or fail clearly

## Current Repository State

This repository contains the currently implemented backend:

- Google OAuth redirect flow
- `Trainer` role assignment
- short-lived JWT issuance
- protected current-user lookup
- relational workout persistence for workout plans, days, and exercises
- protected workout create/list endpoints scoped to the authenticated trainer
- Dockerized runtime with Prisma migration deploy
- validated unit, integration, smoke, lint, and build commands
