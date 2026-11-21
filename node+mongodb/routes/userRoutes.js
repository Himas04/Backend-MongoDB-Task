import express from "express";
import User from "../models/user.js";

const router = express.Router();

//Get All Users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//Post New User

router.post("/", async (req, res) => {
  try {
    const { name, email, contact } = req.body;

    const newUser = new User({
      name,
      email,
      contact,
    });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Edit User
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not Found",
      });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Delete User
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not Found",
      });
    }

    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;
