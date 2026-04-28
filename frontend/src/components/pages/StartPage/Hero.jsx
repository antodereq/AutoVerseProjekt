// src/components/pages/StartPage/Hero.jsx
import React from "react";
import CarsDleLogo from "../../../assets/CarsDle-LOGO.svg";

export default function Hero() {
    return (
        <header className="flex-grow-1 d-flex align-items-center py-5 hero-section">
            <div className="container">
                <div className="row align-items-center gy-4">

                    {/* LEWA STRONA */}
                    <div className="col-lg-6">
                        <span className="badge bg-orange-soft text-orange fw-semibold mb-3">
                            Nowa generacja narzędzi dla fanów motoryzacji
                        </span>

                        <h1 className="display-5 fw-bold mb-3 text-dark">
                            AutoVerse – Twoje centrum
                            <span className="text-orange"> samochodowych danych</span>
                        </h1>

                        <p className="lead text-muted mb-4">
                            Porównuj samochody, odkrywaj rekomendacje dopasowane do Ciebie
                            i baw się w zgadywanie modeli w CarsDle – wszystko w jednym miejscu.
                        </p>

                        <div className="d-flex flex-wrap gap-3 mb-4">
                            <a href="/appClient" className="btn btn-orange btn-lg">Przejdź do aplikacji</a>
                            <a href="#modules" className="btn btn-outline-orange btn-lg">Poznaj moduły</a>
                        </div>

                        <div className="d-flex flex-wrap gap-4 small text-muted">
                            <div className="d-flex align-items-center gap-2"><span className="bullet-orange"></span>Dane techniczne</div>
                            <div className="d-flex align-items-center gap-2"><span className="bullet-orange"></span>Inteligentne rekomendacje</div>
                            <div className="d-flex align-items-center gap-2"><span className="bullet-orange"></span>Zgadnij samochód – CarsDle</div>
                        </div>
                    </div>

                    {/* PRAWA STRONA — KAFELKI */}
                    <div className="col-lg-6">
                        <div className="hero-cards-wrapper">

                            {/* GŁÓWNY */}
                            <div className="hero-card main shadow-lg">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="mb-0 fw-semibold">Porównanie samochodów</h5>
                                    <span className="badge bg-orange-soft text-orange">Ostatnio popularne</span>
                                </div>

                                <div className="hero-car-row mb-3">
                                    <div>
                                        <div className="hero-car-title">Toyota Supra MK4</div>
                                        <div className="hero-car-sub">3.0 Turbo • RWD • Manual</div>
                                    </div>
                                    <div className="hero-car-spec">330 KM</div>
                                </div>

                                <div className="hero-car-row mb-3">
                                    <div>
                                        <div className="hero-car-title">BMW M3 E92</div>
                                        <div className="hero-car-sub">4.0 V8 wolnossące • RWD • Manual</div>
                                    </div>
                                    <div className="hero-car-spec">420 KM</div>
                                </div>


                            </div>

                            {/* CARSdle */}
                            <div className="hero-card side shadow-sm">
                                <img
                                    src={CarsDleLogo}
                                    alt="CarsDle logo"
                                    className="img-fluid mb-2"
                                    style={{ maxHeight: "40px" }}
                                />

                                <h6 className="fw-semibold mb-2">Zgadnij auto</h6>
                                <p className="small mb-2 text-muted">
                                    Kto był na wyspie Epsztyna?
                                </p>
                                <p className="small text-orange fw-semibold mb-0">
                                    Nie czekaj, zagraj teraz!
                                </p>
                            </div>

                            {/* REKOMENDATOR */}
                            <div className="hero-card side shadow-sm">
                                <h6 className="fw-semibold mb-2">Rekomendator</h6>
                                <p className="small text-muted mb-1">
                                    <strong>Nazwa:</strong> Samochody firmowe
                                </p>
                                <p className="small text-muted mb-1">
                                    Budżet: 60 000 – 120 000 zł
                                </p>
                                <p className="small text-orange fw-semibold mb-0">
                                    Propozycja: hot hatch / sportowe coupe
                                </p>
                                <div className="progress-wrapper">
                                    <span className="small text-muted">Dopasowanie do Twoich preferencji</span>
                                    <div className="progress mt-1">
                                        <div className="progress-bar bg-orange" style={{ width: "78%" }}>
                                            78%
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </header>
    );
}
