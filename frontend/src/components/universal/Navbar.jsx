import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {

    const location = useLocation();

    useEffect(() => {

        switch (location.pathname) {

            case "/":
                document.title = "AutoVerse - Strona główna";
                break;

            case "/RecommenderPage":
                document.title = "AutoVerse - Rekomendator";
                break;

            case "/ComparePage":
                document.title = "AutoVerse - Porównywarka";
                break;

            case "/login":
                document.title = "AutoVerse - Logowanie";
                break;

            case "/register":
                document.title = "AutoVerse - Rejestracja";
                break;

            default:
                document.title = "AutoVerse";
        }

    }, [location]);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
            <div className="container">

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