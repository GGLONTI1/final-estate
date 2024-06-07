import axios from "axios"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.scss";


function Register() {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    const { username, email, password } = Object.fromEntries(new FormData(e.target))

    if (!username || !email || !password) {
      setError("All fields are required!")
      setIsLoading(false)
      return
    }
    try {
      const res = await axios.post("http://localhost:5005/api/auth/register", {
        username,
        email,
        password,
      })
      setError(res.data.message)
      setTimeout(() => {
        navigate("/login")
      }, 2000)

    } catch (error) {
      setError(error.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="register">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>
          <input name="username" type="text" placeholder="Username" />
          <input name="email" type="text" placeholder="Email" />
          <input name="password" type="password" placeholder="Password" />
          {error && <span>{error}</span>}
          <button disabled={isLoading}>
            {isLoading ? "Loading..." : "Register"}
          </button>
          <Link to="/login">Do you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Register;
