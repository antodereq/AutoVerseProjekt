import React from "react";
import { Link } from "react-router-dom";
import "./StartPage.css"

export default function Hero() {
    return (
        <section className="hero-section">

            <img
                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920&auto=format&fit=crop"
                alt="Background car"
                className="hero-bg-image"
            />

            <div className="hero-overlay"></div>

            <div className="container hero-content">
                <div className="row min-vh-100 align-items-center">

                    <div className="col-lg-7">

                        <span className="hero-badge mb-3 d-inline-flex">
                            AutoVerse
                        </span>

                        <h1 className="display-3 fw-bold mb-4 hero-title">
                            AutoVerse – Twoje centrum samochodowych danych
                        </h1>

                        <p className="hero-description mb-4">
                            Porównuj samochody, odkrywaj rekomendacje dopasowane do Ciebie
                            i baw się w zgadywanie modeli w CarsDle – wszystko w jednym miejscu.
                        </p>

                        <div className="d-flex flex-wrap gap-3 mb-5">

                            <div className="hero-feature">
                                Dane techniczne
                            </div>

                            <div className="hero-feature">
                                Inteligentne rekomendacje
                            </div>

                            <div className="hero-feature">
                                Zgadnij samochód – CarsDle
                            </div>

                        </div>

                        <div className="d-flex flex-wrap gap-3">

                            <Link
                                to="/ComparePage"
                                className="btn btn-orange btn-lg px-4"
                            >
                                Zacznij porównywać
                            </Link>

                            <a
                                href="https://carsDle.pl"
                                target="_blank"
                                className="btn btn-outline-light btn-lg px-4"
                            >
                                Zagraj w CarsDle
                            </a>

                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}