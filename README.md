# TaskTrack — Full-Stack Task Management App

TaskTrack is a full-stack task management application built as part of my backend and full-stack development learning journey. It allows users to register, log in, and manage their personal tasks through a React frontend connected to a Node.js and Express.js API with MongoDB Atlas for persistent storage.

## Features

### Authentication
- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Protected API routes
- User-specific task management

### Task Management
- Create new tasks
- Retrieve all tasks
- Retrieve a task by ID
- Filter tasks by status
- Update tasks using PUT and PATCH
- Delete tasks
- Validate task titles and statuses
- Store tasks persistently in MongoDB Atlas

### Frontend
- React components and hooks
- Login and registration forms
- Create and display tasks
- Update task status
- Delete tasks
- Filter tasks by status
- Authentication Context for global state
- Loading and error handling
- Responsive user interface

### API and Error Handling
- RESTful API architecture
- Appropriate HTTP status codes
- Request validation and error handling
- JSON request and response handling

## Technologies

**Frontend**
- React
- Vite
- JavaScript
- HTML and CSS

**Backend**
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt

**Development and Testing**
- Git and GitHub
- Postman
- npm
- VS Code

## Prerequisites

- Node.js and npm installed
- A MongoDB Atlas account and database
- Git installed
- Postman (optional, for API testing)

## Installation

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

Create a `.env` file in the project root and add the environment variables required by your backend:

```env
PORT=3000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_secret_key
```

Replace the placeholder values with your actual configuration. Keep `.env` out of GitHub and never commit database credentials or JWT secrets.

### 4. Start the backend

```bash
npm start
```

The API runs at:

`http://localhost:3000`

### 5. Install and start the frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL displayed by Vite, usually:

`http://localhost:5173`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Get the authenticated user's information |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Retrieve the authenticated user's tasks |
| GET | `/api/tasks?status=pending` | Filter tasks by status |
| GET | `/api/tasks/:id` | Retrieve a task by ID |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Replace a task |
| PATCH | `/api/tasks/:id` | Partially update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

**Note:** Task endpoints require a valid JWT access token. Send it in the request header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## Example Request

Create a task using `POST /api/tasks` with the following JSON body:

```json
{
  "title": "Learn React",
  "description": "Practice useState and useEffect",
  "status": "pending"
}
```

Valid task statuses:

- `pending`
- `in-progress`
- `completed`

## Database

TaskTrack uses MongoDB Atlas to store user and task data persistently. Mongoose schemas define the structure and validation rules for users and tasks.

Each task is associated with its owner, allowing authenticated users to manage their own tasks.

## Project Structure

```text
Task_Track-App/
├── client/
│   └── src/
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── services/
│       │   └── api.js
│       ├── App.jsx
│       ├── Dashboard.jsx
│       └── index.css
├── models/
│   ├── User.js
│   └── Task.js
├── server.js
├── db.js
├── package.json
├── .env
├── .gitignore
└── README.md
```

*The structure above describes the main files; your repository may contain additional files.*

## Learning Progress

- **Day 1:** Project setup, development environment, Git, and GitHub.
- **Day 2:** Express.js, REST APIs, CRUD operations, validation, and error handling.
- **Day 3:** MongoDB Atlas integration, Mongoose models, and persistent data storage.
- **Day 4:** React fundamentals, components, hooks, forms, API integration, and Context for authentication state.

## Future Improvements

- Edit task titles and descriptions through the frontend
- Add task statistics and dashboard summaries
- Improve automated testing
- Add deployment and production configuration

## Author

**Shoaib Asghar**

Computer Science Graduate | Python Developer | Full-Stack AI Enthusiast

GitHub: https://github.com/shoaib980-make
