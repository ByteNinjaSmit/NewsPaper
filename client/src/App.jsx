import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import About from "./About";
import Editions from "./Editions";
import Specials from "./Specials";
import Contact from "./ContactUs";
import Admin from "./Admin";
import "./App.css";

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

function AppContent() {
  const location = useLocation();
  // Check if current path starts with /admin
  const hideNavbar = location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
