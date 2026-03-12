# Sprint 5 – AI Chatbot Backend Testing

## Summary

In Sprint 5, we focused on **unit and integration testing** for the AI chatbot backend. The main goals were to ensure the chatbot logic and API route behave correctly under all expected and edge-case scenarios.

## What was done

### 1. Unit Testing (`executeFunctionCall`)
- Verified **retrieving available therapists**, including:
  - Returning all therapists
  - Filtering by specialty
  - Returning alternatives when no exact match exists
- Verified **retrieving available slots**, including:
  - Returning slots when they exist
  - Returning "no slots" messages when none are available
- Tested **error handling**, including:
  - Database errors
  - Unknown function calls

### 2. API Route Testing (`POST /api/chatbot`)
- Verified normal chat requests with valid JWT and history.
- Handled edge cases:
  - Missing history
  - Invalid JSON tool arguments
  - Expired/invalid JWT
  - Valid JWT but user not found
  - Tool calls returning empty arrays
  - Unknown functions

### 3. Code Coverage
- Achieved **over 90% coverage** for statements, branches, and functions.
- Ensures future code changes are safe and well-tested.

## Purpose
- Guarantees **chatbot stability** for real users.
- Provides a **reference for new developers** on how chatbot logic should behave.
- Makes it easier to **extend functionality** and **refactor code safely**.

---

*Author: Phathisa Ndaliso – Sprint 5*