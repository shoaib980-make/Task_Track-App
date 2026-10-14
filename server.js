require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");
const User = require("./models/User");
const Task = require("./models/Task");
// Create an Express application.
const express = require("express");
// The app object is used to define routes, middleware, and server behavior.
const app = express();
// Define the port number on which the server will run.
const PORT = 3000;
// Middleware: allows Express to read JSON request bodies.
app.use(express.json());
app.use("/api/auth", authRoutes);


app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Profile error:", error.message);

    return res.status(500).json({
      message: "Server error",
    });
  }
});


//First route
app.get("/",(req, res)=>{
    res.status(200).json({
    message: "Welcome to TaskTrack API",
  });
});


const isValidTaskId = (id) => /^[a-f\d]{24}$/i.test(id);

// GET /api/tasks
// Get only the logged-in user's tasks.
app.get("/api/tasks", authMiddleware, async (req, res) => {
  try {
    const { status } = req.query;

    const allowedStatuses = ["pending", "in-progress", "completed"];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const filter = { user: req.user.id };

    if (status) {
      filter.status = status;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve tasks",
    });
  }
});

// GET /api/tasks/:id
// Get one task belonging to the logged-in user.
app.get("/api/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidTaskId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("Get task error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve task",
    });
  }
});

// POST /api/tasks
// Create a task for the logged-in user.
app.post("/api/tasks", authMiddleware, async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;
    const allowedStatuses = ["pending", "in-progress", "completed"];

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title must be a non-empty string",
      });
    }

    if (
      status !== undefined &&
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    if (
      description !== undefined &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Description must be a string",
      });
    }

    if (
      dueDate !== undefined &&
      dueDate !== null &&
      (typeof dueDate !== "string" ||
        dueDate.trim() === "" ||
        Number.isNaN(Date.parse(dueDate)))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid due date",
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description || "",
      status: status || "pending",
      dueDate: dueDate || null,
      user: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create task error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
});

// PATCH /api/tasks/:id
// Update selected fields of a task.
app.patch("/api/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidTaskId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "status",
      "dueDate",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (Object.hasOwn(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one valid field to update",
      });
    }

    if (
      Object.hasOwn(updates, "title") &&
      (typeof updates.title !== "string" ||
        !updates.title.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Task title must be a non-empty string",
      });
    }

    if (
      Object.hasOwn(updates, "description") &&
      typeof updates.description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Description must be a string",
      });
    }

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

    if (
      Object.hasOwn(updates, "dueDate") &&
      updates.dueDate !== null &&
      (typeof updates.dueDate !== "string" ||
        updates.dueDate.trim() === "" ||
        Number.isNaN(Date.parse(updates.dueDate)))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid due date",
      });
    }

    if (Object.hasOwn(updates, "title")) {
      updates.title = updates.title.trim();
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("Update task error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
});

// PUT /api/tasks/:id
// Replace a task's editable fields.
app.put("/api/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidTaskId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const { title, description, status, dueDate } = req.body;
    const allowedStatuses = ["pending", "in-progress", "completed"];

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    if (
      status !== undefined &&
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    if (
      description !== undefined &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Description must be a string",
      });
    }

    if (
      dueDate !== undefined &&
      dueDate !== null &&
      (typeof dueDate !== "string" ||
        dueDate.trim() === "" ||
        Number.isNaN(Date.parse(dueDate)))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid due date",
      });
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user.id },
      {
        $set: {
          title: title.trim(),
          description: description || "",
          status: status || "pending",
          dueDate: dueDate || null,
        },
      },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task replaced successfully",
      task,
    });
  } catch (error) {
    console.error("Replace task error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to replace task",
    });
  }
});

// DELETE /api/tasks/:id
// Delete only a task belonging to the logged-in user.
app.delete("/api/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidTaskId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      task,
    });
  } catch (error) {
    console.error("Delete task error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
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

const startServer = async () => {
  await connectDB();

  app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port 3000");
  });
};

startServer();