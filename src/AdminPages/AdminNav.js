import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import "./AdminNav.css";

function AdminNav() {
  const [searched, savesearched] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.firstName); // Retrieve the first name from local storage
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserName(""); // Clear the userName state
    navigate("/"); // Redirect to first page
  };

  return (
    <div>
      <nav className="main-nav-bar">
        {/* Main Logo */}
        <div className="logo">
          <h3>
            <Link to="/">
              <span>P</span> A R V A
            </Link>
          </h3>
        </div>

        {/* User Info and Logout */}
        <div className="registered">
          <ul>
            {userName ? (
              <>
                <li className="LoginInfo">{userName}</li>
                
                  <li onClick={handleLogout} className="logout-btn">
                    Logout
                  </li>
               
              </>
            ) : (
              <li>
                <Link to="/"></Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default AdminNav;
