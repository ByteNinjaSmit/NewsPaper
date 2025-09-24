import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
    const [active, setActive] = useState("home");
    const navigate = useNavigate();

    const handleNavigation = (id, e) => {
        e.preventDefault();
        setActive(id.toLowerCase());
        if (id.toLowerCase() === "admin") {
            navigate("/admin"); // Navigate to Admin page
        } else {
            // Scroll to section for other links
            const section = document.getElementById(id.toLowerCase());
            if (section) {
                section.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <a
                    href="#home"
                    className="brand"
                    onClick={(e) => handleNavigation("home", e)}
                >
                    PharmaCare
                </a>
            </div>

            <div className="navbar-center">
                {["Home", "About", "Editions", "Specials", "Contact"].map(
                    (id) => (
                        <a
                            key={id}
                            href={`#${id.toLowerCase()}`}
                            className={active === id.toLowerCase() ? "active-link" : ""}
                            onClick={(e) => handleNavigation(id, e)}
                        >
                            {id}
                        </a>
                    )
                )}
            </div>

            <div className="navbar-right">
                <button
                    className="admin-btn"
                    onClick={(e) => handleNavigation("admin", e)}
                >
                    Admin
                </button>
            </div>
        </nav>
    );
}
