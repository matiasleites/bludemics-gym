import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Home from "./components/home/Home";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthProvider from "./context/authContext";
import ErrorBoundary from "./errorBoundary";

const root = ReactDOM.createRoot(document.getElementById("root"));
export const AuthContext = React.createContext();

root.render(
  <ErrorBoundary>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </ErrorBoundary>
);

reportWebVitals();
