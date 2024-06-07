import express from "express"
import authRouter from "./routes/auth.route.js"
import cors from "cors"


const app = express()
const PORT = "5005"

//utilities
app.use(express.json())
app.use(cors({ credentials: true }))

//routes
app.use("/api/auth", authRouter)



//server
app.listen(PORT, () => {
    console.log(`Server is Running on port ${PORT}`);
})