import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css"; 
import blueLock from "./assets/blueLock.jpg";
import dandadan from "./assets/dandadan.jpg";
import anime from "./assets/anime.jpg";
import anime3 from "./assets/anime3.jpg";
import anime2 from "./assets/anime2.jpg"; 
import anime4 from "./assets/anime4.jpg";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Username:", username);
    console.log("Password:", password);
    
    navigate("/");
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