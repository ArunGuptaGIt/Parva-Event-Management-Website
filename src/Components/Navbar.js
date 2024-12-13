import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ searchQuery, setSearchQuery }) {
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <nav className="main-nav">
            {/* Main Logo */}
            <div className="logo">
                <h3>
                    <Link to="/">
                        <span>P</span> A R V A
                    </Link>
                </h3>
            </div>

            {/* Search Bar */}
            <div className="search-bar">
                <input
                    type="text"
                    className="search"
                    placeholder="Search Venue / Events / Size"
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>

            {/* Login and SignUp Buttons */}
            <div className="register">
                <ul>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/signup">Sign Up</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}