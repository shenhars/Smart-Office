# Smart Office Asset Manager

This repository contains a complete microservice stack prepared for the Full-Stack assignment.

Run Guide (Development)
1. Prerequisites
	- Docker & Docker Compose
	- Node 18+ and npm (optional for local frontend development)

2. Start the full stack (build images and run containers)

```powershell
docker compose up --build
# or detach
docker compose up --build -d
```

3. Ports
	- Frontend (nginx): http://localhost:3000
	- AuthService: http://localhost:5000
	- ResourceService: http://localhost:5002

4. Quick manual smoke test
	- Open http://localhost:3000 and register a new user (choose role Admin or Member).
	- Login and, if Admin, add an asset from the dashboard.


Reflections (short)
- Implemented secure, role-based authentication using ASP.NET Core Identity and JWT tokens.
- Used Postgres for AuthService and MongoDB for ResourceService to demonstrate DB isolation.
- Added validation (data annotations) on DTOs and models and `ModelState` validation in controllers.
- Encapsulated resource business rules in `ResourceService.Services.AssetService` (SOLID: single responsibility, DI).

Tooling Disclosure
- AI assistance: Code-refactor and editing assistance was used: gemini pro and copilot.
- Libraries: ASP.NET Core Identity, Entity Framework Core, Npgsql (Postgres), MongoDB.Driver, React, MobX, MUI.
