import "./page.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import React from "react";
import ReactDOM from "react-dom/client";
import Level from "./components/Level.tsx";
import App from "./pages/index.tsx";
import Levels from "./pages/levels/index.tsx";
import Login from "./pages/login/index.tsx";
import Signup from "./pages/signup/index.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/levels" element={<Levels />} />
        <Route path="/levels/:index" element={<Level />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
