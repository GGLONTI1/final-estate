import prisma from "../lib/prisma.js";

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
export const updateUser = (req, res) => {
    const id = req.params.id
    const tokenUserId = req.userId
    // verify user is owner

    if (id !== tokenUserId) return res.status(403).json({ message: "Not authorized!" })
    try {

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
