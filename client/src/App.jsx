
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import About from "./About";
import Editions from "./Editions";
import Specials from "./Specials";
import Contact from "./ContactUs";
import Admin from "./Admin";
import "./App.css";

// A wrapper for homepage that contains all sections in one scrollable page
function HomePage() {
    return (
        <div>
            <div id="home"><Home /></div>
            <div id="about"><About /></div>
            <div id="editions"><Editions /></div>
            <div id="specials"><Specials /></div>
            <div id="contact"><Contact /></div>
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                {/* Scrollable one-page homepage */}
                <Route path="/" element={<HomePage />} />

                {/* Separate pages */}
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </Router>
    );
}
