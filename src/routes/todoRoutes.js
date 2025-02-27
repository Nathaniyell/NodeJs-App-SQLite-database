import express from "express";
import db from "../db.js";

const router = express.Router()

//Get all todos for login user
router.get('/', (req, res) => {
    const getTodos = db.prepare('SELECT * FROM todos WHERE user_id = ?')
    const todos = getTodos.all(req.userId)
    res.json(todos)
})

//Create a new todo
router.post('/', (req, res) => {
    const { task } = req.body;
    const insertTodo = db.prepare(`INSERT into todos (user_id, task) VALUES (?, ?)`)
    //the user_id specifies which user's table the task should be added to and not just any random user on the data base or all the users on the db
    const result = insertTodo.run(req.userId, task)
    res.json({ id: result.lastInsertRowid, task, completed: 0 })
})

//Update a todo
router.put('/:id', (req, res) => {
    
})


//Delete a todo
router.delete('/:id', (req, res) => {

})





export default router