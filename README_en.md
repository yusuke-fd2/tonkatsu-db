# Tonkatsu DB

A web application for managing tonkatsu restaurants and their menus. Menus can be entered manually or extracted from natural-language text with AI before registration.

## Features

- Collapsible menu lists grouped by restaurant
- Create, edit, and delete menus
- Store pork type, brand, price, and description
- Extract structured menu data from text using Gemini
- Review AI-parsed data before saving it

> AI registration matches the restaurant name exactly against an existing record in the `shops` table.

## Tech Stack

- Frontend: React 18, JavaScript, Fetch API
- Backend: Java 17, Spring Boot 4, Spring Web MVC, Spring Data JPA, Lombok
- AI: Gemini API
- Database: PostgreSQL / Amazon RDS

## Local Setup

### Prerequisites

- Java 17
- Node.js and npm
- PostgreSQL with a `trackdb` database containing the `shops` and `menus` tables
- A Gemini API key for AI-assisted registration

### Backend

Set these environment variables:

| Variable | Description | Default |
| --- | --- | --- |
| `DB_HOST` | PostgreSQL host | Required |
| `DB_USER` | PostgreSQL user | Required |
| `DB_PASSWORD` | PostgreSQL password | Required |
| `GEMINI_API_KEY` | Gemini API key | Required |
| `PORT` | Backend port | `8080` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins | Includes `http://localhost:3000` |

PowerShell example:

```powershell
$env:DB_HOST = "localhost"
$env:DB_USER = "postgres"
$env:DB_PASSWORD = "password"
$env:GEMINI_API_KEY = "your-api-key"
cd backend
.\mvnw.cmd spring-boot:run
```

Hibernate uses `ddl-auto=validate`, so the database schema must already exist.

### Frontend

In another terminal:

```powershell
cd frontend
npm install
npm start
```

The frontend runs at `http://localhost:3000` and calls `http://localhost:8080` by default. Set `REACT_APP_API_BASE_URL` to use another API base URL.

## API

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/hello` | Health check |
| `GET` | `/api/shops` | List restaurants |
| `GET` | `/api/menus` | List menus |
| `POST` | `/api/menus` | Create a menu |
| `PUT` | `/api/menus/{id}` | Update a menu |
| `DELETE` | `/api/menus/{id}` | Delete a menu |
| `POST` | `/api/ai/parse-menu` | Extract menu data from natural-language text |

Example AI parsing request:

```json
{
  "text": "Add a 2,000 yen cutlet curry to Tonkatsu Nozaki"
}
```
