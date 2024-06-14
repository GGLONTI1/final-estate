import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext"
import apiRequest from "../../lib/apiRequest";
import "./profileUpdatePage.scss";

function ProfileUpdatePage() {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { currentUser, updateUser } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    const inputs = Object.fromEntries(new FormData(e.target))
    const { newPassword, currentPassword, username, email } = inputs
    try {
      const updatedUser = await apiRequest.put("/users/" + currentUser.id, {
        currentPassword,
        newPassword,
        username,
        email,
      })
      setError("Update Succesfully!")
      updateUser(updatedUser.data)
    } catch (error) {
      console.log(error.response.data.message);
      setError(error.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser.username}
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              defaultValue={currentUser.email}
            />
          </div>
          <div className="item">
            <label htmlFor="currentPassword">Current Password</label>
            <input id="currentPassword" name="currentPassword" type="password" />
          </div>
          <div className="item">
            <label htmlFor="newPassword">New Password</label>
            <input id="newPassword" name="newPassword" type="password" />
          </div>
          {error && <span>{error}</span>}
          <button disabled={isLoading}>
            {isLoading ? "Loading..." : "Update"}
          </button>
        </form>
      </div>
      <div className="sideContainer">
        <img src="" alt="" className="avatar" />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
