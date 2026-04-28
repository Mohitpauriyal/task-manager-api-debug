# Task Manager API

A RESTful API for managing tasks, built with Node.js and Express.

## Setup

```bash
npm install
npm start
```

The server runs on `http://localhost:3000`.

For development with auto-reload:
```bash
npm run dev
```

## Endpoints

| Method | Endpoint       | Description                          |
|--------|----------------|--------------------------------------|
| GET    | /tasks         | List all tasks (supports filters)    |
| POST   | /tasks         | Create a new task                    |
| GET    | /tasks/stats   | Get task statistics                  |
| GET    | /tasks/:id     | Get a single task by ID              |
| PUT    | /tasks/:id     | Update a task                        |
| DELETE | /tasks/:id     | Delete a task                        |

## Query Parameters

**GET /tasks**
- `status` — filter by status: `pending` or `completed`
- `priority` — filter by priority level: `1` to `5`

## Request Body

**POST /tasks**
```json
{
  "title": "Fix login bug",
  "description": "Users can't log in with Google OAuth",
  "priority": 4
}
```

**PUT /tasks/:id** — any subset of task fields:
```json
{
  "status": "completed",
  "priority": 2
}
```

## Data Model

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "priority": 1,
  "status": "pending | completed",
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

## Tech Stack

- Node.js
- Express 4.x
- UUID v9 (in-memory store, no database)
