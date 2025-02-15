import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

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
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        const getUser = db.prepare('SELECT * FROM users WHERE username = ?');
        const user = getUser.get(username);

        //If we cannot find a user associated with the entered username, stop function execution and throw an error 
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        //Compare the entered password with the hashed password in the db
        const passwordIsValid = bcrypt.compareSync(password, user.password)

        //If the password does not match, stop function execution and throw an error 
        if (!passwordIsValid) {
            return res.status(401).send({ message: "Invalid Password" });
        }
        //If password is correct then we have a successful login
        console.log(user);
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "24h" })
        res.json({ token });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

export default router