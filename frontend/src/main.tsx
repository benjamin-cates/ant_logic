import "./page.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import App from "./pages/index.tsx";
import LevelOne from "./pages/levels/1.tsx";
import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/levels/1" element={<LevelOne />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
