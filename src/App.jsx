import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";
import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Reports from "./pages/Reports";

import "./App.css";

function App() {
const [theme, setTheme] = useState("light");

useEffect(() => {
  document.documentElement.setAttribute("data-theme", theme);
}, [theme]);

function toggleTheme() {
  setTheme((currentTheme) =>
    currentTheme === "light" ? "dark" : "light"
  );
}

  return (
    <BrowserRouter>
      <div className="app">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <div className="header-wrapper">
  <Header />

  <button
    type="button"
    className="theme-toggle"
    onClick={toggleTheme}
    aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
  >
    {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
  </button>
</div>

        <div className="app-layout">
          <Sidebar />

          <div className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </div>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;