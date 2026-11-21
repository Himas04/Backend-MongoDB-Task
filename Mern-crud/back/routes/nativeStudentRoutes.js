const express = require('express');
const { ObjectId } = require('mongodb');
const { getDB } = require('../config/dbNative');

const router = express.Router();

// 1. GET: Fetch all students using Native MongoDB Driver
router.get('/', async (req, res) => {
    try {
        const db = getDB();
        const students = await db.collection('students').find({}).toArray();
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. POST: Add new student using Native MongoDB Driver
router.post('/', async (req, res) => {
    try {
        const db = getDB();
        const newStudent = {
            ...req.body,
            createdAt: new Date()
        };
        const result = await db.collection('students').insertOne(newStudent);
        res.status(201).json({ _id: result.insertedId, ...newStudent });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 3. PUT: Update student by ID using Native MongoDB Driver
router.put('/:id', async (req, res) => {
    try {
        const db = getDB();
        const { _id, ...updateData } = req.body;
        await db.collection('students').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updateData }
        );
        res.json({ _id: req.params.id, ...updateData });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 4. DELETE: Delete student by ID using Native MongoDB Driver
router.delete('/:id', async (req, res) => {
    try {
        const db = getDB();
        await db.collection('students').deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ message: 'Deleted successfully (Native Driver)' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
