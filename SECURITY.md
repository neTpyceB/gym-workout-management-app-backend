# Backend Security

## Current State

No backend security controls are implemented yet because no application code exists.

## Required Security Model

- Google OAuth authentication entry
- Short-lived JWT authentication only
- No refresh fallback logic
- Strict DTO validation on every endpoint
- Authorization by role and resource ownership
- No insecure public mutation endpoints
- No permissive defaults for protected resources

## Verification Requirements

Once implementation starts, validate:

- Google auth flow
- JWT issuance and rejection paths
- public vs protected endpoints
- role restrictions
- ownership restrictions
- booking and availability input validation

## Constraint

Security documentation must track the real implementation state and not describe controls that are not yet present.
