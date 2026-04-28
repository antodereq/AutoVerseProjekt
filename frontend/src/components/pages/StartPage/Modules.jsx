// src/components/pages/StartPage/Modules.jsx
import React from "react";
import { Link } from "react-router-dom";
import CarsDleLogo from "../../../assets/CarsDle-LOGO.svg";


export default function Modules() {
    return (
        <section id="modules" className="py-5 bg-white">
            <div className="container">
                <div className="text-center mb-4">
                    <h2 className="fw-bold mb-2">Moduły AutoVerse</h2>
                    <p className="text-muted mb-0">
                        Jeden system, trzy różne sposoby na ogarnięcie świata samochodów.
                    </p>
                </div>

                <div className="row gy-4">

                    {/* 1 */}
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm card-hover">
                            <div className="card-body">
                                <div className="icon-circle mb-3">🚗</div>
                                <h5 className="card-title fw-semibold mb-2">Porównywarka samochodów</h5>

                                <p className="text-muted mb-3">
                                    Szczegółowe dane techniczne i statystyki gotowe do porównań.
                                </p>

                                <ul className="small text-muted mb-3">
                                    <li>Porównanie parametrów</li>
                                    <li>Zakres roczników i generacje</li>
                                    <li>Zaawansowane konfiguracje</li>
                                </ul>

                                <Link to="/ComparePage" className="btn btn-sm btn-outline-orange">
                                    Uruchom porównywarkę
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* 2 */}
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm card-hover">
                            <div className="card-body">
                                <div className="icon-circle mb-3">🎯</div>
                                <h5 className="card-title fw-semibold mb-2">Rekomendator aut</h5>

                                <p className="text-muted mb-3">
                                    Dopasowane rekomendacje na podstawie budżetu i preferencji.
                                </p>

                                <ul className="small text-muted mb-3">
                                    <li>Preferencje (marka, model, skrzynia, napęd itp.)</li>
                                    <li>Wiele wersji silnikowych</li>
                                    <li>Analiza kosztów</li>
                                </ul>

                                <Link to="/RecommenderPage" className="btn btn-sm btn-outline-orange">
                                    Uruchom rekomendator
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* 3 */}
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm card-hover">
                            <div className="card-body">
                                <div className="icon-circle mb-3">
                                    <img
                                        src={CarsDleLogo}
                                        alt="CarsDle logo"
                                        className="img-fluid mb-2"
                                        style={{ maxHeight: "40px" }}
                                    />
                                </div>
                                <h5 className="card-title fw-semibold mb-2">CarsDle</h5>

                                <p className="text-muted mb-3">
                                    Typuj modele na podstawie podpowiedzi i zgadnij wylosowany samochód!
                                </p>

                                <ul className="small text-muted mb-3">
                                    <li>Kolorystyczne wskazówki</li>
                                    <li>Tryb endless</li>
                                    <li>Codzienne losowanie</li>
                                </ul>

                                <a href="/carsdle" className="btn btn-sm btn-outline-orange">
                                    Zagraj w CarsDle
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
