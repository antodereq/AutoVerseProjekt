// src/components/pages/StartPage/Why.jsx
import React from "react";

export default function Why() {
    return (
        <section id="why" className="py-5 bg-light">
            <div className="container">
                <div className="row gy-4 align-items-center">

                    <div className="col-lg-6">
                        <h2 className="fw-bold mb-3">Dlaczego warto korzystać z AutoVerse?</h2>

                        <p className="text-muted mb-3">
                            Tworzysz projekty, uczysz się, planujesz zakup auta albo po prostu jarasz się motoryzacją?
                            AutoVerse porządkuje dane tak, abyś nie musiał przeklikiwać się przez milion zakładek.
                        </p>

                        <ul className="list-unstyled text-muted mb-0">
                            <li className="mb-2">✅ Spójna baza danych</li>
                            <li className="mb-2">✅ Wygodny i nowoczesny interfejs</li>
                            <li className="mb-2">✅ Projekt rozwojowy i modułowy</li>
                        </ul>
                    </div>

                    <div className="col-lg-6">
                        <div className="why-box shadow-sm">
                            <h5 className="fw-semibold mb-3">Na co jest nastawione AutoVerse?</h5>

                            <div className="d-flex flex-column gap-3 small">
                                <div><span className="fw-semibold text-orange">Edukacja & developerka:</span> API, SQL, analizy.</div>
                                <div><span className="fw-semibold text-orange">Rzetelne informacje:</span> prawdziwe dane samochodów.</div>
                                <div><span className="fw-semibold text-orange">Gry przeglądarkowe:</span> CarsDle i grywalizacja.</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
