const express = require("express");
const router = express.Router();
const Todo = require("./../models/Todo");
const fetchUser = require("../middleware/fetchUser");
const { body, validationResult } = require("express-validator");

router.get("/get", fetchUser, async (req, res) => {
  try {
    const todo = await Todo.find({ user: req.user.id });
    res.status(200).json(todo);
  } catch (err) {
    res.status(500);
    console.log(error);
  }
});
router.post(
  "/add",
  [body("name").isLength({ min: 3 })],
  fetchUser,
  async (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const { name, tag, date } = req.body;
      try {
        const newItem = new Todo({ name, user: req.user.id, tag, date });
        await newItem.save();
        return res.status(200).json(newItem);
      } catch (err) {
        return res.status(500).json({ msg: "internal server error" });
      }
    }

    return res.send({ error: result.array() });
  }
);

router.delete("/delete/:id", fetchUser, async (req, res) => {
  try {
    let deletedItem = await Todo.findById(req.params.id);
    if (!deletedItem) {
      return res.status(500);
    }
    await Todo.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "done" });
  } catch (err) {
    console.error("error in deleting", err);
    res.status(500);
  }
});

router.put("/update/:id", fetchUser, async (req, res) => {
  try {
    const { date, name, tag } = req.body;
    let updatedTodo = {};
    if (name) updatedTodo.name = name;
    if (date) updatedTodo.date = date;
    if (tag) updatedTodo.tag = tag;
    let todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(500).json({ msg: " NOT FOUND " });
    }

    if (req.user.id != todo.user.toString()) {
      return res.status(401).json("Not found");
    }

    await Todo.findByIdAndUpdate(req.params.id, updatedTodo, { new: true });
    res.status(200).json({ msg: " done " });
  } catch (err) {
    console.error("error in deleting", err);
    res.status(500);
  }
});

module.exports = router;
