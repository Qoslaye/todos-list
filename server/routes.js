const express = require("express");
const router = express.Router();
const { getConnectedClient } = require("./database");
const { ObjectId } = require("mongodb");

const getCollection = () => {
    const client = getConnectedClient();
    return client.db("todosdb").collection("todos");
};

// GET /todos
router.get("/todos", async (req, res) => {
    const collection = getCollection();
    const todos = await collection.find({}).toArray();
    res.status(200).json(todos);
});

// POST /todos
router.post("/todos", async (req, res) => {
    const collection = getCollection();
    let { todo } = req.body;

    if (!todo) {
        return res.status(400).json({ mssg: "No todo provided" });
    }

    todo = (typeof todo === "string") ? todo : JSON.stringify(todo);
    const newTodo = await collection.insertOne({ todo, status: false });

    res.status(201).json({ todo, status: false, _id: newTodo.insertedId });
});

// DELETE /todos/:id
router.delete("/todos/:id", async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);
    const deletedTodo = await collection.deleteOne({ _id });

    res.status(200).json(deletedTodo);
});

// PUT /todos/:id
router.put("/todos/:id", async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);
    const { status } = req.body;

    console.log('Received PUT request:', { _id, status });

    if (typeof status !== "boolean") {
        console.error('Invalid status:', status);
        return res.status(400).json({ mssg: "Invalid status" });
    }

    try {
        const updatedTodo = await collection.updateOne({ _id }, { $set: { status: status } });
        console.log('Update result:', updatedTodo);
        res.status(200).json(updatedTodo);
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ mssg: "Internal server error" });
    }
});

// PUT /todos/:id
router.put("/todos/:id", async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);
    const { status, todo } = req.body;

    const updateFields = {};
    if (typeof status === "boolean") {
        updateFields.status = status;
    }
    if (typeof todo === "string") {
        updateFields.todo = todo;
    }

    const updatedTodo = await collection.updateOne({ _id }, { $set: updateFields });

    res.status(200).json(updatedTodo);
});


module.exports = router;