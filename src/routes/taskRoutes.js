import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware
router.use(authMiddleware);

// POST /api/tasks
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Please provide a task title" });
    }

    const task = new Task({
      title,
      description,
      owner: req.user._id
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id });
    res.json(tasks);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check ownership
    if (task.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await task.deleteOne();
    res.json({ message: "Task removed" });

  } catch (error) {
    console.error(error.message);
    // If it's an invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

export default router;