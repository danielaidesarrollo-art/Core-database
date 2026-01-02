# Daniel_AI Data Core

## Overview
Independent data management kernel for medical and clinical records. Designed with modularity as a first principle, featuring structural validation, immutable version control, and future-ready connectivity ports.

## Architecture
- **Core Engine**: Orchestrates the lifecycle of data objects.
- **Schema Registry**: Enforces medical data standards (FHIR-lite).
- **Versioning System**: Maintains an immutable trail of data evolution.
- **Ports**: Standardized API surface for external orchestration (e.g., SafeCore).

## Project Structure
- `src/core`: Internal logic for data handling.
- `src/api`: Connectivity layer (The "Ports").
- `data/vault`: Current state of data objects.
- `data/history`: Immutable versions of data.
