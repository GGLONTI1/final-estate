import prisma from "../lib/prisma";

export const getPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany()
        res.status(200).json(posts)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to Get Posts!" })
    }
}
export const getPost = async (req, res) => {

    const id = req.params
    
    try {
        const post = await prisma.post.findUnique({
            where: { id }
        })
        res.status(200).json(post)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to Get Post!" })
    }
}
export const addPost = async (req, res) => {

    const body = req.body
    const tokenUserId = req.userId

    try {
        const newPost = await prisma.post.create({
            data: {
                ...body,
                userId: tokenUserId,
            },
        });
        res.status(200).json(newPost)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to Create Post!" })
    }
}
export const updatePost = async (req, res) => {

    const tokenUserId = req.userId
    const postId = req.params.id
    const body = req.body

    try {
        const post = await prisma.post.findUnique({
            where: {
                id: postId
            }
        })
        if (post.userId !== tokenUserId) {
            return res.status(403).json({ message: "Unauthorised User!" })
        }
        const updatedPost = await prisma.post.update(
            {
                where: {
                    id: postId,
                },
                data: {
                    ...body
                }
            }
        )
        res.status(200).json(updatedPost)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to Update Post!" })
    }
}
export const deletePost = async (req, res) => {

    const id = req.params.id
    const tokenUserId = req.userId

    try {
        const post = await prisma.post.findUnique({
            where: { id },
        })
        if (post.userId !== tokenUserId) {
            return res.status(403).json({ message: "Not Authorized!" })
        }
        await prisma.post.delete({
            where: { id },
        })
        res.status(200).json({ message: "Post Succesfully Deleted!" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to Delete Post!" })
    }
}