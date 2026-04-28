// src/components/pages/StartPage/Footer.jsx
import React from "react";

export default function Footer() {
    return (
        <footer className="py-3 bg-dark text-white-50">
            <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 small">
                <div>© {new Date().getFullYear()} AutoVerse. Wszystkie prawa zastrzeżone.</div>
                <div><span className="fi fi-eu"></span> Nienawidzimy Unii Europejskiej</div>
                <div><span className="fi fi-pl"></span> Wielka Polska Narodowa!</div>
                <div className="d-flex gap-3">
                    <a href="#top" className="link-light text-decoration-none">Wróć na górę</a>
                    <a href="#" className="link-light text-decoration-none">Polityka prywatności</a>
                </div>
            </div>
        </footer>
    );
}
