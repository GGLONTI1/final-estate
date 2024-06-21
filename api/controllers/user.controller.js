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
    const { currentPassword,
        newPassword,
        username,
        email,
        avatar, } = req.body

    if (!currentPassword) return res.status(500).json({ message: "Current password required!" })

    // verify user is owner

    if (id !== tokenUserId) return res.status(403).json({ message: "Not authorized!" })

    try {

        //get user

        const user = await prisma.user.findUnique({
            where: {
                id,
            }
        })
        if (!user) return res.status(500).json({ message: "No User!" })

        //compare new password to a db password

        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password)
        console.log(isPasswordCorrect);
        if (!isPasswordCorrect) return res.status(403).json({ message: "Not Authorised!" })

        //hash new password
        
        let hashedPassword = null
        if (newPassword) {
            hashedPassword = await bcrypt.hash(newPassword, 10)
        }

        //updated user 

        const updatedUser = await prisma.user.update({
            where: {
                id,
            },
            data: {
                username,
                email,
                ...(avatar && avatar),
                ...(hashedPassword && { password: hashedPassword })
            }
        })
        if (!updatedUser) return res.status(500).json({ message: "Error Updating User!" })
        const { password: hidePassword, ...safeUserData } = updatedUser
        res.status(200).json(safeUserData)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Cannot update User!" })
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
