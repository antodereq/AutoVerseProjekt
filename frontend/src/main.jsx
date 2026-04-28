import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "flag-icons/css/flag-icons.min.css";


// Bootstrap zawsze pierwszy
import "bootstrap/dist/css/bootstrap.min.css";

// Globalne style dostępne w całym projekcie
import "./styles/Global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter basename="/">
            <App />
        </BrowserRouter>
    </React.StrictMode>
);