import React from "react";
import { Link } from "react-router-dom";
import CarsDleLogo from "../../../assets/CarsDle-LOGO.svg";

export default function Modules() {
    return (
        <section id="modules" className="py-5 bg-white">
            <div className="container">

                <div className="text-center mb-5">
                    <h2 className="fw-bold display-6 mb-3">
                        Główne moduły
                    </h2>

                    <p className="text-secondary modules-subtitle mx-auto">
                        Wszystko skupione wokół samochodów — od danych technicznych,
                        przez porównania, aż po grywalizację.
                    </p>
                </div>

                <div className="row gy-4">

                    {/* Compare */}
                    <div className="col-lg-4">
                        <div className="module-card h-100">

                            <div className="module-icon">
                                🚗
                            </div>

                            <h4 className="fw-bold mb-3">
                                Porównywarka samochodów
                            </h4>

                            <p className="text-secondary mb-4">
                                Porównuj konfiguracje, silniki, napędy,
                                osiągi oraz dane techniczne wielu aut jednocześnie.
                            </p>

                            <ul className="module-list">
                                <li>Różne generacje i konfiguracje</li>
                                <li>Filtrowanie parametrów</li>
                                <li>Nowoczesny widok porównania</li>
                            </ul>

                            <Link
                                to="/ComparePage"
                                className="btn btn-orange mt-auto"
                            >
                                Otwórz porównywarkę
                            </Link>

                        </div>
                    </div>

                    {/* Recommender */}
                    <div className="col-lg-4">
                        <div className="module-card h-100">

                            <div className="module-icon">
                                🎯
                            </div>

                            <h4 className="fw-bold mb-3">
                                Rekomendator aut
                            </h4>

                            <p className="text-secondary mb-4">
                                Szukasz auta pod budżet albo konkretne wymagania?
                                System pomoże dobrać odpowiednie konfiguracje.
                            </p>

                            <ul className="module-list">
                                <li>Budżet i preferencje</li>
                                <li>Typ nadwozia, napęd, skrzynia</li>
                                <li>Różne wersje silnikowe</li>
                            </ul>

                            <Link
                                to="/RecommenderPage"
                                className="btn btn-orange mt-auto"
                            >
                                Otwórz rekomendator
                            </Link>

                        </div>
                    </div>

                    {/* CarsDle */}
                    <div className="col-lg-4">
                        <div className="module-card h-100">

                            {/*<div className="module-icon">*/}
                            {/*    <img*/}
                            {/*        src={CarsDleLogo}*/}
                            {/*        alt="CarsDle"*/}
                            {/*        className="img-fluid"*/}
                            {/*        style={{ maxHeight: "42px" }}*/}
                            {/*    />*/}
                            {/*</div>*/}
                            <div className="module-icon">
                                🎯
                            </div>

                            <h4 className="fw-bold mb-3">
                                CarsDle
                            </h4>

                            <p className="text-secondary mb-4">
                                Odkrywaj modele samochodów na podstawie podpowiedzi
                                i sprawdzaj swoją wiedzę motoryzacyjną.
                            </p>

                            <ul className="module-list">
                                <li>Kolorystyczne wskazówki</li>
                                <li>Tryb endless</li>
                                <li>Codzienne wyzwania</li>
                            </ul>

                            <a
                                href="/carsdle"
                                className="btn btn-orange mt-auto"
                            >
                                Zagraj teraz
                            </a>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}