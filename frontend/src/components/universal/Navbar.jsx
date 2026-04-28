import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
            <div className="container">
                {/* Logo jako SPA-link */}
                <Link className="navbar-brand fw-bold text-orange" to="/">
                    AutoVerse
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarMain"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarMain">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

                        <li className="nav-item">
                            <Link to="/" className="nav-link">
                                Strona główna
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link to="/RecommenderPage" className="nav-link">
                                Rekomendator
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link to="/ComparePage" className="nav-link">
                                Porównywarka
                            </Link>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link" href="/">
                                CarsDle
                            </a>
                        </li>
                    </ul>

                    <div className="ms-lg-3 mt-3 mt-lg-0 d-flex gap-2">
                        <Link to="/login" className="btn btn-outline-orange">
                            Zaloguj
                        </Link>
                        <Link to="/register" className="btn btn-orange">
                            Rejestracja
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
