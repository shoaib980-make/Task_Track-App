# TaskTrack — Full-Stack Task Management App

TaskTrack is a full-stack task management application built with React, Node.js, Express.js, and MongoDB Atlas. It allows users to register, log in, and manage their personal tasks through a React frontend connected to a REST API.

The project also includes a separate **Python FastAPI service**, developed as part of my backend development and API learning journey.

## Features

### Authentication
- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Protected API routes
- User-specific task management

### Task Management
- Create and retrieve tasks
- Retrieve a task by ID
- Filter tasks by status
- Update tasks using PUT and PATCH
- Delete tasks
- Validate task data
- Store application data persistently in MongoDB Atlas

### React Frontend
- React components and hooks
- Login and registration forms
- Create and display tasks
- Update task status
- Delete and filter tasks
- Authentication Context for global state
- Loading and error handling
- Responsive user interface

### Python FastAPI Service
- REST API built with FastAPI
- Health-check endpoint
- Retrieve tasks
- Create tasks using POST
- Request validation using Pydantic
- Automatic interactive API documentation
- Dependency management using `requirements.txt`

**Note:** The Python service currently uses in-memory task data. It is separate from the main Express and MongoDB application.

## Technologies

**Frontend**
- React
- Vite
- JavaScript
- HTML and CSS

**Main Backend**
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt

**Python API**
- Python
- FastAPI
- Uvicorn
- Pydantic

**Development Tools**
- Git and GitHub
- npm
- Postman
- VS Code

## Prerequisites

Install the following tools before running the project:

- Node.js and npm
- Python 3.11 or a compatible Python version
- Git
- A MongoDB Atlas account and database
- Postman (optional)

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/shoaib980-make/Task_Track-App.git
cd Task_Track-App
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_secret_key
```

Replace the example values with your actual configuration. Use the variable names expected by your application.

**Security:** Never commit `.env` files, database credentials, or JWT secrets to GitHub.

### 4. Start the main backend

From the project root:

```bash
npm start
```

The API is expected to run at:

`http://localhost:3000`

### 5. Start the React frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

`http://localhost:5173`

### 6. Run the Python FastAPI service

Open another terminal at the project root.

Create a virtual environment if you haven't already:

```bash
cd python-service
python -m venv .venv
```

Activate it in Git Bash on Windows:

```bash
source .venv/Scripts/activate
```

Install the dependencies:

```bash
python -m pip install -r requirements.txt
```

Start the service:

```bash
python -m uvicorn main:app --reload
```

The Python API runs at:

`http://127.0.0.1:8000`

Interactive API documentation:

`http://127.0.0.1:8000/docs`

### Python API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Welcome message |
| GET | `/health` | Health check |
| GET | `/api/tasks` | Retrieve tasks |
| POST | `/api/tasks` | Create a task with validation |

The FastAPI service validates incoming task data using Pydantic. Invalid requests return HTTP `422`, while successful task creation returns HTTP `201`.

## Main Application API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Retrieve the authenticated user's information, if implemented |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Retrieve tasks |
| GET | `/api/tasks?status=pending` | Filter tasks by status |
| GET | `/api/tasks/:id` | Retrieve a task by ID |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Replace a task |
| PATCH | `/api/tasks/:id` | Partially update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

Protected endpoints require a valid JWT access token when authentication middleware is applied. The typical header format is:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Check the project's route files for the exact endpoints supported by your current implementation.

## Example Task Request

Example JSON body for creating a task:

```json
{
  "title": "Learn React",
  "description": "Practice useState and useEffect",
  "status": "pending"
}
```

Supported task statuses depend on the corresponding backend model and validation rules. The Python service currently accepts:

- `pending`
- `in progress`
- `completed`

## Database

The main application uses MongoDB Atlas for persistent storage and Mongoose to define user and task schemas.

Tasks are associated with their owners so that authenticated users can manage their own data.

The separate Python FastAPI service currently stores tasks in memory for demonstration and learning purposes.

## Project Structure

```text
Task_Track-App/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Dashboard.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── config/
│   └── db.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── User.js
│   └── Task.js
├── routes/
│   └── auth.js
├── python-service/
│   ├── main.py
│   ├── requirements.txt
│   └── .venv/             # Local environment; not committed
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
├── .env                   # Local configuration; not committed
└── README.md
```

## Learning Progress

- **Day 1:** Development environment setup, Git, GitHub, and project workflow.
- **Day 2:** Express.js, REST APIs, CRUD operations, validation, and error handling.
- **Day 3:** MongoDB Atlas, Mongoose schemas, authentication, and JWT concepts.
- **Day 4:** React components, props, hooks, forms, API integration, and Context.
- **Day 5:** Python fundamentals, FastAPI, Pydantic validation, API documentation, and dependency management.

## Future Improvements

- Connect the Python service to persistent storage.
- Add automated backend and frontend tests.
- Improve task editing and dashboard statistics.
- Add deployment and production configuration.
- Improve API security and error handling.

## Author

**Shoaib Asghar**

Computer Science Graduate | Python Developer | Full-Stack AI Enthusiast

GitHub: https://github.com/shoaib980-make
