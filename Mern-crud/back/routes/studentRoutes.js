const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// 1. GET: Fetch all students
router.get('/', async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

// 2. POST: Add new student
router.post('/', async (req, res) => {
    const newStudent = new Student(req.body);
    const savedStudent = await newStudent.save();
    res.json(savedStudent);
});

// 3. PUT: Update student by ID
router.put('/:id', async (req, res) => {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedStudent);
});

// 4. DELETE: Delete student by ID
router.delete('/:id', async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
});

module.exports = router;
