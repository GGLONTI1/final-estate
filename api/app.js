import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.route.js"
import testRouter from "./routes/test.route.js"
import userRouter from "./routes/user.route.js"


const app = express()
const PORT = "5005"

//utilities
app.use(express.json())
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(cookieParser())

//routes
app.use("/api/auth", authRouter)
app.use("/api/users", userRouter)
app.use("/api/test", testRouter)


//server
app.listen(PORT, () => {
    console.log(`Server is Running on port ${PORT}`);
})