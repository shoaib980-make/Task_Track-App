// Create an Express application.
const express = require("express");
// The app object is used to define routes, middleware, and server behavior.
const app = express();
// Define the port number on which the server will run.
const PORT = 3000;
// Middleware: allows Express to read JSON request bodies.
app.use(express.json());

//First route
app.get("/",(req, res)=>{
    res.status(200).json({
    message: "Welcome to TaskTrack API",
  });
});

// Get all tasks (temporary in-memory data)
const tasks = [
  {
    id: 1,
    title: "Learn Express",
    description: "Understand routing and HTTP methods",
    status: "pending",
  },
];


app.get("/api/tasks", (req, res) => {
  const { status } = req.query;

  // If a status filter is provided, filter the tasks.
  const filteredTasks = status
    ? tasks.filter((task) => task.status === status)
    : tasks;

  res.status(200).json({
    success: true,
    count: filteredTasks.length,
    tasks: filteredTasks,
  });
});



app.get("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  res.status(200).json({
    success: true,
    task: task,
  });
});



app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  const deletedTask = tasks.splice(index, 1)[0];

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
    task: deletedTask,
  });
});



app.patch("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  const allowedFields = ["title", "description", "status", "dueDate"];
  const updates = {};

  // Copy only fields that are allowed to be updated.
  for (const field of allowedFields) {
    if (Object.hasOwn(req.body, field)) {
      updates[field] = req.body[field];
    }
  }

  // Validate title before changing the original task.
  if (
    Object.hasOwn(updates, "title") &&
    (typeof updates.title !== "string" || !updates.title.trim())
  ) {
    return res.status(400).json({
      success: false,
      message: "Task title must be a non-empty string",
    });
  }

  // Validate status before changing the original task.
  const allowedStatuses = ["pending", "in-progress", "completed"];

  if (
    Object.hasOwn(updates, "status") &&
    !allowedStatuses.includes(updates.status)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid status",
    });
  }

  // Validate description.
  if (
    Object.hasOwn(updates, "description") &&
    typeof updates.description !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Description must be a string",
    });
  }

  // Clean the title, if provided.
  if (Object.hasOwn(updates, "title")) {
    updates.title = updates.title.trim();
  }

  // Apply changes only after validation succeeds.
  Object.assign(task, updates);

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    task,
  });
});



app.put("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  const { title, description, status, dueDate } = req.body;
  const allowedStatuses = ["pending", "in-progress", "completed"];

  if (status !== undefined && !allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status",
    });
  }

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: "Task title is required",
    });
  }

  const updatedTask = {
    id,
    title: title.trim(),
    description: description || "",
    status: status || "pending",
    dueDate: dueDate || null,
  };

  tasks[index] = updatedTask;

  res.status(200).json({
    success: true,
    message: "Task replaced successfully",
    task: updatedTask,
  });
});

app.post("/api/tasks", (req, res) => {
  const { title, description, status, dueDate } = req.body;
  const allowedStatuses = ["pending", "in-progress", "completed"];

  if (status !== undefined && !allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status",
    });
  }

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: "Task title must be a non-empty string",
    });
  }

  const newTask = {
    id: tasks.length
      ? Math.max(...tasks.map((task) => task.id)) + 1
      : 1,
    title: title.trim(),
    description: description || "",
    status: status || "pending",
    dueDate: dueDate || null,
  };

  tasks.push(newTask);

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    task: newTask,
  });
});


app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  // Invalid JSON sent by the client
  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    "body" in err
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON in request body",
    });
  }

  // Unexpected server error
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});