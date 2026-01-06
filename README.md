# Smart Office Asset Manager

This project is a full-stack microservices ecosystem that implements a "Smart Office" management system that let you display and manage assests according to roles ("Admin", "Member"). 
It's architecture is composed of PostgreSQL-backed Auth Service that handles secure identity via JWT and a MongoDB-backed Resource Service that manages office assets through protected NoSQL data structures all using .NET 9.
The frontend is composed of TypeScript-based React dashboard with MobX state management and Material UI.

Contents
- `AuthService` - ASP.NET Core 9 API using Identity + PostgreSQL for user and auth data.
- `ResourceService` - ASP.NET Core 9 API using MongoDB to store assets.
- `frontend-client` - React + Vite front-end (MobX + MUI) communicating with the APIs.

Quick start (from Git)

1. Clone the repo:

```powershell
git clone https://github.com/shenhars/Smart-Office.git
cd Smart-Office
```

2. Run the full stack with Docker Compose (build images then start):

```powershell
docker compose up --build -d
```

3. Open the frontend in the browser: http://localhost:3000

Default service ports (compose mappings)
- Frontend (nginx): http://localhost:3000
- AuthService: container 8080 → host 5000 (check compose if changed)
- ResourceService: container 8080 → host 5002 (check compose if changed)

Notes and tips
- To rebuild a single service: `docker compose build --no-cache <service-name>`.
- To view logs: `docker compose logs -f <service-name>`.
- To stop and remove containers: `docker compose down`.

Environment & configuration
- The services read config from their `appsettings.json` and environment variables. When running in Docker Compose the provided service definitions set required variables.

Quick manual test
- Open the frontend and register a user (choose `Admin` or `Member`).
- Login and exercise the dashboard; admins can add assets which are saved by `ResourceService`.
