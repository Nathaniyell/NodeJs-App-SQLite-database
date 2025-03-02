import express from "express";
import db from "../db.js";
import prisma from "../prismaClient.js";

const router = express.Router()

//Get all todos for login user
router.get('/', async (req, res) => {
    const todos = await prisma.todo.findMany({
        where: {
            userId: req.userId
        }
    })
    res.json(todos)
})

//Create a new todo
router.post('/', async (req, res) => {
    const { task } = req.body;
    const todo = await prisma.todo.create({
        data: {
            task,
            userId: req.userId
        }
    })
    res.json(todo)
})

//Update a todo
router.put('/:id', async (req, res) => {
    const { completed, task } = req.body;
    //The id on the url is gotten from the url params
    const { id } = req.params;

    try {
        const updatedTodo = await prisma.todo.update({
            where: {
                id: parseInt(id),
                userId: req.userId
            },
            data: {
                completed: !!completed
            }
        })
        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while updating the todo" });
    }
});

//Delete a todo
router.delete('/:id', async (req, res) => {
    const { id } = req.params
    await prisma.todo.delete({
        where: {
            id: parseInt(id),
            userId: req.userId
        }
    })

    res.send({ message: "Todo Deleted" })
})



export default router