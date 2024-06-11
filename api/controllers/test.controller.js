import jwt from "jsonwebtoken"

export const shouldBeLoggedIn = (req, res) => {

    const token = req.cookies.token

    const id = req.userId
    
    console.log(id);
    if (!token) return res.status(401).json({ message: "Not authenticated!" })

    jwt.verify(token, process.env.JWT_TOKEN_SECRET, async (error, payload) => {
        if (error) return res.status(403).json({ message: "Token is not valid!" })
    })
    res.status(200).json({ message: "You are authenticated!" })
}
export const shouldBeAdmin = async (req, res) => {
    res.send("It works!")
}   