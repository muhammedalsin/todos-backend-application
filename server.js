const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const Todo = require("./models/Todo");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log(err));

// Get all todos
app.get("/", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// Add new todo
app.post("/add", async (req, res) => {
  const newTodo = new Todo({
    text: req.body.text,
    paragraph: req.body.paragraph,
    completed: req.body.completed,
  });
  await newTodo.save();
  res.json(newTodo);
});

// Toggle todo completed
app.put("/toggle/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.completed = !todo.completed;
  await todo.save();
  res.json(todo);
});

// Edit todo
app.put("/edit/:id", async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(
    req.params.id,
    {
      text: req.body.text,
      paragraph: req.body.paragraph,
    },
    { new: true }
  );
  

  res.json(todo);
});

// Delete todo
app.delete("/delete/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
