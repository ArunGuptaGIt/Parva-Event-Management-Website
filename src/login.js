import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './login.css';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user.admin_or_not) {
                navigate('/firstpage');
            }
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/parva_website/admins/login/", {
                email,
                password,
            });
    
            if (response.status === 200) {
                const userData = {
                    email: response.data.email,
                    admin_or_not: response.data.admin_or_not,
                    firstName: response.data.first_name,  // Save first name here
                };
                localStorage.setItem("user", JSON.stringify(userData));
    
                if (response.data.admin_or_not) {
                    navigate('/firstpage');
                } else {
                    navigate('/addEvent');
                }
            }
        } catch (error) {
            console.error("Error:", error.response || error.message);
            if (error.response) {
                alert(`Error: ${error.response.data.error || "Invalid credentials"}`);
            } else if (error.request) {
                alert("No response from server. Please try again later.");
            } else {
                alert(`Error: ${error.message}`);
            }
        }
    };
    

    return (
        <div className="main-box">
            <div className="rightside">
                <img src="Banner.png" alt="Logo" />
                <h2 className="signin">Sign In</h2>
                <form className="formMenu" onSubmit={handleSubmit}>
                    <div className="inputwrap">
                        <span>Email Address</span>
                        <input
                            type="email"
                            placeholder="Something@gmail.com"
                            required
                            className="inputfield"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <i className="material-symbols-outlined">mail</i>
                    </div>
                    <div className="inputwrap">
                        <span>Password</span>
                        <input
                            type="password"
                            required
                            className="inputfield"
                            placeholder="Must be 8 characters long"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <i className="material-symbols-outlined">lock</i>
                    </div>
                    <a href="home">Forget password?</a>
                    <br />
                    <center>
                        <button className="loginbutton" type="submit">Log In</button>
                    </center>
                </form>
                <p className="signup">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
