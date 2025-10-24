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

let tasks = [];

const taskSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  description: String,
});

const taskModel = mongoose.model("Task", taskSchema);

// Create a Task item route
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

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log("Server running in port number 3000");
});
