import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css"; 
import blueLock from "./components/assets/blueLock.jpg";
import dandadan from "./components/assets/dandadan.jpg";
import anime from "./components/assets/anime.jpg";
import anime3 from "./components/assets/anime3.jpg";
import anime2 from "./components/assets/anime2.jpg";
import anime4 from "./components/assets/anime4.jpg";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("http://localhost:3000/auth/sessions", {
      username,
      password
    });
    
    const token = response.data.token;
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    alert("Login successful!");
    navigate("/home");

  } catch (error) {
    alert("Login failed: " + error.response.data.error);
    console.error(error);
  }
};

  return (
    <div className="login-page">
      <div className="anime-left">
        <img src={blueLock} alt="anime" className="carta carta-1" />
        <img src={dandadan} alt="anime" className="carta carta-2" />
        <img src={anime} alt="anime" className="carta carta-3" />
      </div>
      <div className="login-container">
        <h2>Login</h2>
        <form className="form-login" onSubmit={handleLogin}>
          <div>
            <input
              type="text"
              id="username"
              value={username}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              id="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <span>Don't have an account?<a href="Register"> Sign up</a></span>
          <button type="submit">Log In</button>
        </form>
      </div>
      <div className="anime-right">
        <img src={anime2} alt="anime" className="carta carta-4" />
        <img src={anime3} alt="anime" className="carta carta-5" />
        <img src={anime4} alt="anime" className="carta carta-6" />
      </div>
    </div>
    
  );
}

export default Login;