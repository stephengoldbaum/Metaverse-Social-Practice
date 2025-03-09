# VR Scenario Manager

This application allows users to manage and customize VR scenarios. It provides a web interface for scenario selection, customization, and session management.

## Project Structure

```
App/
├── backend/           # Node.js + Express API server
│   └── src/
│       ├── types/    # TypeScript type definitions
│       ├── models/   # MongoDB models
│       ├── routes/   # API routes
│       └── services/ # Business logic
│
└── frontend/         # Next.js web application
    └── src/
        ├── app/     # Next.js app router
        ├── components/
        └── lib/     # Shared utilities
```

## Core Entities

1. **User**: Represents a user of the system
2. **Scenario**: A VR scenario template with customization options
3. **Session**: An instance of a scenario with specific customizations
4. **Interaction**: Records of interactions within a session

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development servers:
   ```bash
   npm run dev
   ```

This will start both the backend server and frontend development server concurrently.

## Technology Stack

- **Frontend**: Next.js, React, TailwindCSS, React Query
- **Backend**: Node.js, Express.js, MongoDB
- **Language**: TypeScript
- **API**: REST with JSON
- **Cloud Infrastructure**: Azure (see [infrastructure documentation](../docs/azure-infrastructure.md))
