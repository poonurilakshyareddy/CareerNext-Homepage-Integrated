# JobHub — Job Portal Project

A starter full-stack student project with a React + Vite frontend and a Java Spring Boot REST API backed by MySQL.

## Folder structure

```text
JobHub/
├── jobhub-frontend/   # React UI
├── jobhub-backend/    # Spring Boot REST API
└── README.md
```

## 1. Start the frontend

Requirements: Node.js and npm.

Open a terminal in `jobhub-frontend` and run:

```powershell
npm install
npm run dev
```

Open the local URL Vite prints (normally http://localhost:5173).

The homepage includes search/filter UI, sample job cards, save-job interactions, and a job-details modal. If the backend is unavailable, it intentionally displays demo listings.

## 2. Start the backend

Requirements: a supported JDK, Maven (or use the Maven wrapper if you add one), and MySQL Server.

1. Start MySQL.
2. Create the database, if needed:

```sql
CREATE DATABASE jobhub_db;
```

3. Set the database credentials. The default username is `root` and the default password is blank. If yours differs, set environment variables in the terminal before running the backend:

```powershell
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_mysql_password"
```

4. Open a terminal in `jobhub-backend` and run:

```powershell
mvn spring-boot:run
```

The API should run on http://localhost:8080. The first startup inserts sample jobs when the jobs table is empty.

## API endpoints

- `GET /api/jobs` — list jobs
- `GET /api/jobs?search=java` — search title/company/location
- `GET /api/jobs/{id}` — get one job
- `POST /api/jobs` — create a job (JSON request body)
- `DELETE /api/jobs/{id}` — delete a job
- `GET /api/applications` — list submitted applications
- `POST /api/applications` — submit an application

Example application request:

```json
{
  "applicantName": "Demo Student",
  "applicantEmail": "student@example.com",
  "jobId": 1
}
```

## Important project status

This is a starter project. Job listings can be read from the Spring Boot API when it is running; otherwise the React UI uses sample data so the homepage still opens. The login form is currently a UI preview, not real authentication. Job application submission in the current frontend is a demo interaction; the backend application endpoint is available but still needs to be connected to a real application form. Do not use this starter as a production hiring system without implementing authentication, authorization, security hardening, and proper validation.
