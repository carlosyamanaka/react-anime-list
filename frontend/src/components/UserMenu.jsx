import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function UserMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const username = localStorage.getItem("username")

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.delete("http://localhost:3000/auth/sessions", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error("Erro no logout:", error);
    } finally {
      localStorage.clear();
      navigate("/");
    }
  };

  return (
    <div className="user-menu" ref={menuRef}>
      <div className="user-toggle" onClick={() => setOpen(!open)}>
        <FontAwesomeIcon icon={faCircleUser} /> {username} <FontAwesomeIcon icon={faCaretDown} />
      </div>
      {open && (
        <div className="dropdown-user">
          <button onClick={() => navigate("/mylist")}>My List</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
