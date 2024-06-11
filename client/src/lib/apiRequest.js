import axios from "axios"

const apiRequest = axios.create({
    baseURL: "http://localhost:5005/api",
    withCredentials: true,
})

export default apiRequest;