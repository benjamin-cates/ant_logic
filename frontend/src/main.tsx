import "./page.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import App from "./pages/index.tsx";
import LevelOne from "./pages/levels/1.tsx";
import React from "react";
import ReactDOM from "react-dom/client";
import Levels from "./pages/levels/index.tsx";
import Level from "./components/Level.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/levels" element={<Levels />} />
        <Route path="/levels/:index" element={<Level />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
