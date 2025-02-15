import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../../db.js";

const router = express.Router()

router.post('/register', (req, res) => {
    const { username, password } = req.body

    //encrypt the password
    const hashedpassword = bcrypt.hashSync(password, 8)
    try {
        //1. Register the user in the db
        const insertUser = db.prepare(`INSERT INTO users(username, password) VALUES (?, ?)`)
        const result = insertUser.run(username, hashedpassword)

        //2. Add a todo to the list of todos automatically to guide the user on how to use the app
        const defaultTodo = `Hello :) Add your first todo!`
        const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`)
        insertTodo.run(result.lastInsertRowid, defaultTodo)

        //3. create a token which will be used to confirm that the user is an authenticated user
        const token = jwt.sign({ id: result.lastInsertRowid }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
        // res.sendStatus(201)
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
})

router.post('/login', (req, res) => {
    const { username, password } = req.body
    try {
        const getUser = db.prepare('SELECT * FROM users WHERE username = ?')
        const user = getUser.get(username)
          // if we cannot find a user associated with that username, return out from the function
          if (!user) { return res.status(404).send({ message: "User not found" }) }
          
    } catch (error) {
        console.log(error.message)
        res.sendStatus(503)
    }
    console.log(username, password)
    // res.sendStatus(201)
})





export default router