// Using Express
const express = require("express");
const mongoose = require("mongoose");

// Create an instance of express
const app = express();
app.use(express.json());

// Connect to Database
const DB_Link = require("./temp");
mongoose
  .connect(DB_Link)
  .then(() => {
    console.log("DB Connected");
  })
  .catch(() => {
    console.error;
  });

// DataBase collection Schema
const taskSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  description: String,
});

const taskModel = mongoose.model("Task", taskSchema);

// Create a new task item route
app.post("/tasks", async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTask = new taskModel({ title, description });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Get all Tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await taskModel.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a task item
app.put("/tasks/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const id = req.params.id;
    const updateTask = await taskModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
      },
      { new: true }
    );

    if (!updateTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(updateTask);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Delete a task item
app.delete("/tasks/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await taskModel.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log("Server running in port number 3000");
});
