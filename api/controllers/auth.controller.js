import bcrypt from "bcrypt"
import prisma from "../lib/prisma.js"
import jwt from "jsonwebtoken"


export const register = async (req, res) => {
    const { username, email, password } = req.body
    try {
        //HASH THE PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10)
        //SAVE TO DB
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            }
        })
        res.status(201).json({ message: "User created successfully!" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to create User!" })
    }
}
export const login = async (req, res) => {
    const { username, password } = req.body
    try {
        //FIND USERNAME
        const user = await prisma.user.findUnique({
            where: {
                username
            }
        })
        if (!user) {
            return res.status(401).json({ message: "Invalid Credentials" })
        }

        //CHECK PASSWORD

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) return res.status(401).json({ message: "Invalid Credentials" })


        //CREATE TOKEN

        const age = 1000 * 60 * 60 * 24 * 3
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_TOKEN_SECRET,
            {
                expiresIn: age,
            })

        //SEND COOKIE WITH TOKEN

        const { password: userPassword, ...userSafeInfo } = user

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: age,
        })
            .status(200)
            .json(userSafeInfo)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to create user!" })
    }

}
export const logout = async (req, res) => {
    res.clearCookie("token").status(200).json({ message: "Logout successfully" })
}