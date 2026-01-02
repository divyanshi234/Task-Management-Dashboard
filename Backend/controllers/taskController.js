
import { trusted } from "mongoose";
import Task from "../models/taskModel.js";

// CREATE TASK
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, completed } = req.body;
    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      completed: completed === 'Yes' || completed === true,
      owner: req.user.id,
    });
    const saved = await task.save();
    res.status(201).json({ success: true, task: saved });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET ALL TASKS FOR LOGGED-IN USER
export const getTask = async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET TASK BY ID
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });
    if (!task)
      return res.status(400).json({
        success: false,
        message: "Task not found",
      });
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE TASK
export const updateTask = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.completed !== undefined) {
      data.completed = data.completed === 'Yes' || data.completed === true;
    }

    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      data,
      { new: true, runValidators: true }
    );

    if (!updated)
      return res.status(400).json({
        success: false,
        message: "Task not found or not yours",
      });

    res.json({ success: true, task: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE TASK
export const deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!deleted)
      return res.status(400).json({
        success: false,
        message: "Task not found or not yours",
      });

    res.json({ success: true, message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
