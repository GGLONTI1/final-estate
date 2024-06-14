import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt"

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany()
        res.status(200).json(users)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Cannot get Users!" })
    }
}
export const getUser = async (req, res) => {
    const id = req.params.id
    try {
        const user = await prisma.user.findUnique({
            where: {
                id,
            }
        })
        res.status(200).json(user)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Cannot get User!" })
    }
}
export const updateUser = async (req, res) => {
    const id = req.params.id
    const tokenUserId = req.userId
    const { newPassword, currentPassword, ...inputs } = req.body

    //hash current password and check in db


    let hashedPassword = null
    if (id !== tokenUserId) return res.status(403).json({ message: "Unauthorised User!" })
    if (!newPassword || !currentPassword) return res.status(500).json({ message: "Invalid fields!" })
    try {
        const user = await prisma.user.findUnique({
            where: {
                id,
            }
        })
        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password)
        if (!isPasswordCorrect) return res.status(403).json({ message: "Unauthorised!" })

        hashedPassword = await bcrypt.hash(newPassword, 10)

        const updatedUser = await prisma.user.update({
            where: {
                id,
            },
            data: {
                ...inputs,
                ...(hashedPassword && { password: hashedPassword })
            }

        })

        const { password: hidePassword, ...userData } = updatedUser
        res.status(200).json(userData)
    } catch (error) {
        console.log(error);
    }
}
export const deleteUser = async (req, res) => {
    const id = req.params.id
    const tokenUserId = req.userId
    // verify user is owner

    if (id !== tokenUserId) return res.status(403).json({ message: "Not authorized!" })
    try {
        await prisma.user.delete({
            where: {
                id,
            }
        })
        res.status(200).json({ message: "User suffesfully deleted!" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Cannot delete User!" })
    }
}
