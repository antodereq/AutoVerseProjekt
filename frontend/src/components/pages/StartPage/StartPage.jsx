// src/components/pages/StartPage/StartPage.jsx
import React from "react";
import "../../../styles/StartPage.css";

import Navbar from "../../universal/Navbar.jsx";
import Hero from "./Hero.jsx";
import Modules from "./Modules.jsx";
import Why from "./Why.jsx";
import Numbers from "./Numbers.jsx";
import Footer from "./Footer.jsx";

export default function StartPage() {
    return (
        <div className="start-page d-flex flex-column min-vh-100 bg-light">
            <Navbar />
            <Hero />
            <Modules />
            <Why />
            <Numbers />
            <Footer />
        </div>
    );
}
