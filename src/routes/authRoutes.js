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
        const insertUser = db.prepare(`INSEERT INTO users(username, password) VALUES {?, ?}`)
        const result = insertUser.run(username, hashedpassword)
        res.sendStatus(201)
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
})

router.post('/login', (req, res) => {
    const { username, password } = req.body
    console.log(username, password)
    res.sendStatus(201)
})





export default router