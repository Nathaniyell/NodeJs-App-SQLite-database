import express from "express"
import path, { dirname } from "path"
import { fileURLToPath } from "url"
import authRoutes from "./routes/authRoutes.js"
import todoRoutes from "./routes/todoRoutes.js"
import authMiddleware from "./middleware/authMIddleWare.js"

const app = express()
const PORT = process.env.PORT || 5007

// Get the file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Middlewares
app.use(express.json())
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "../public")));


// Serve the HTML file from the public directory
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

//ROUTES
app.use('/auth', authRoutes)
app.use('/todos', authMiddleware, todoRoutes)


app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})