import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./register.css"
import blueLock from "./components/assets/blueLock.jpg";
import dandadan from "./components/assets/dandadan.jpg";
import anime from "./components/assets/anime.jpg";
import anime3 from "./components/assets/anime3.jpg";
import anime2 from "./components/assets/anime2.jpg";
import anime4 from "./components/assets/anime4.jpg";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/register", {
        username,
        password
      });

      alert("Registered successfully!");
      navigate("/login");

    } catch (error) {
      alert("Registration failed: " + error.response.data.error);
      console.error(error);
    }
  };

  return (
    <div className="register-page">
      <div className="anime-left">
        <img src={blueLock} alt="anime" className="carta carta-1" />
        <img src={dandadan} alt="anime" className="carta carta-2" />
        <img src={anime} alt="anime" className="carta carta-3" />
      </div>
      <div className="register-container">
        <h2>Sign Up</h2>
        <form className="form-register" onSubmit={handleLogin}>
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
              type="email"
              id="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
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
          <span>Already have an account?<a href="Login"> Sign in</a></span>
          <button type="submit">Sign Up</button>
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

export default Register;