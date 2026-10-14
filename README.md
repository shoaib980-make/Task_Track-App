# TaskTrack API

A RESTful Task Management API built with Node.js and Express.js. This project is part of my backend development learning journey.

## Features

- Create a new task
- Retrieve all tasks
- Retrieve a task by ID
- Filter tasks by status
- Update tasks using PUT and PATCH
- Delete tasks
- Validate task titles and statuses
- Handle invalid JSON and errors
- Return appropriate HTTP status codes

## Technologies

- Node.js
- Express.js
- JavaScript
- Postman for API testing

## Prerequisites

- Node.js and npm installed
- Postman or another API testing tool

## Installation

Clone the repository and enter the project directory:

```bash
git clone https://github.com/shoaib980-make/Task_Track-App.git
cd Task_Track-App
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

The API runs at:

`http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Welcome message |
| GET | `/api/tasks` | Retrieve all tasks |
| GET | `/api/tasks?status=pending` | Filter tasks by status |
| GET | `/api/tasks/:id` | Retrieve a task by ID |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Replace a task |
| PATCH | `/api/tasks/:id` | Partially update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

## Example Request

Create a task using `POST /api/tasks` with the JSON body:

```json
{
  "title": "Learn Express",
  "description": "Practice REST API development",
  "status": "pending"
}
```

Valid task statuses:

- `pending`
- `in-progress`
- `completed`

## Current Limitations

- Tasks are stored in memory, so they reset when the server restarts.
- MongoDB persistence and user authentication are not implemented yet.

## Learning Progress

- Day 1: Project setup and development environment
- Day 2: Express.js, REST APIs, CRUD operations, validation, and error handling

More features will be added as the project progresses.