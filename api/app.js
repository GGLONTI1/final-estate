import express from "express"
import authRouter from "./routes/auth.route.js"


const app = express()
const PORT = "5005"


//routes

app.use(express.json())
app.use("/api/auth", authRouter)

//server
app.listen(PORT, () => {
    console.log(`Server is Running on port ${PORT}`);
})