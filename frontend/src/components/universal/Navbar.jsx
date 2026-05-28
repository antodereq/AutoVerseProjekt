import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function Navbar() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        async function checkUser() {

            try {

                const res = await fetch(
                    "http://localhost/AutoVerseProjekt/backend/me.php",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                const data = await res.json();

                if (data.loggedIn) {
                    setUser(data.user);
                }

            } catch (error) {
                console.error(error);
            }
        }

        checkUser();
    }, []);

    async function handleLogout() {

        try {

            await fetch(
                "http://localhost/AutoVerseProjekt/backend/logout.php",
                {
                    method: "POST",
                    credentials: "include"
                }
            );

            setUser(null);

            window.location.href = "/login";

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-3">
            <div className="container">

                {/* LOGO */}
                <Link
                    className="navbar-brand fw-bold fs-3"
                    to="/"
                    style={{ color: "#ff6b00" }}
                >
                    AutoVerse
                </Link>

                {/* MOBILE BUTTON */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarMain"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* NAVBAR CONTENT */}
                <div className="collapse navbar-collapse" id="navbarMain">

                    {/* LINKS */}
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-2">

                        <li className="nav-item">
                            <Link to="/" className="nav-link fw-semibold">
                                Strona główna
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                to="/RecommenderPage"
                                className="nav-link fw-semibold"
                            >
                                Rekomendator
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                to="/ComparePage"
                                className="nav-link fw-semibold"
                            >
                                Porównywarka
                            </Link>
                        </li>

                        <li className="nav-item">
                            <a
                                className="nav-link fw-semibold"
                                href="https://carsDle.pl"
                                target="_blank"
                            >
                                CarsDle
                            </a>
                        </li>
                    </ul>

                    {/* AUTH */}
                    <div className="ms-lg-3 mt-3 mt-lg-0 d-flex align-items-center gap-2">

                        {user ? (

                            <>
                                <Link
                                    to="/ClientPage"
                                    className="text-decoration-none fw-bold d-flex align-items-center"
                                    style={{
                                        color: "#1f2937",
                                        fontSize: "15px"
                                    }}
                                >
                                    {user.login}
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="btn btn-outline-danger d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "42px",
                                        height: "42px",
                                        borderRadius: "12px"
                                    }}
                                    title="Wyloguj"
                                >
                                    <LogOut size={18} />
                                </button>
                            </>

                        ) : (

                            <>
                                <Link
                                    to="/login"
                                    className="btn btn-outline-orange px-4"
                                    style={{
                                        borderRadius: "12px",
                                        fontWeight: "600"
                                    }}
                                >
                                    Zaloguj
                                </Link>

                                <Link
                                    to="/register"
                                    className="btn btn-orange px-4"
                                    style={{
                                        borderRadius: "12px",
                                        fontWeight: "600",
                                        background: "linear-gradient(135deg, #ff7a00, #ff5a00)",
                                        border: "none",
                                        color: "white"
                                    }}
                                >
                                    Rejestracja
                                </Link>
                            </>

                        )}

                    </div>
                </div>
            </div>
        </nav>
    );
}