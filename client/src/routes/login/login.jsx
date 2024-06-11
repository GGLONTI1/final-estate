import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import "./login.scss";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { updateUser } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const { username, password } = Object.fromEntries(new FormData(e.target))

    if (!username || !password) {
      setError("All fields are required!")
      return
    }
    try {
      const res = await apiRequest.post("/auth/login", {
        username,
        password,
      })
      setError(res.data.message)

      updateUser(res.data)

      setTimeout(() => {
        navigate("/")
      }, 2000)
    } catch (error) {
      setError(error.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input name="username" type="text" placeholder="Username" />
          <input name="password" type="password" placeholder="Password" />
          <button disabled={isLoading}>
            {isLoading ? "Loading..." : "Login"}
          </button>
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;
