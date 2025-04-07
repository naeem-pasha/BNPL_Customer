import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./index.css";
import Home from "./Pages/home.tsx";
import ProtectedRoute from "./lib/protectedRoute.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/status" element={<Home />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
