import express from "express"
import path, { dirname } from "path"
import { fileURLToPath } from "url"
import authRoutes from "./src/routes/authRoutes.js"
import todoRoutes from "./src/routes/todoRoutes.js"

const app = express()
const PORT = process.env.PORT || 5007

// Get the file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Middlewares
app.use(express.json())
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));


// Serve the HTML file from the public directory
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

//ROUTES
app.use('/auth', authRoutes)
app.use('/todo', todoRoutes)


app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})