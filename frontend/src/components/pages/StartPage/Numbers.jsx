// src/components/pages/StartPage/Numbers.jsx
import React from "react";

export default function Numbers() {
    return (
        <section id="numbers" className="py-4 bg-orange-gradient text-white">
            <div className="container">
                <div className="row text-center gy-3">

                    <div className="col-6 col-md-3">
                        <div className="fw-bold fs-3">20+</div>
                        <div className="small">marek w bazie</div>
                    </div>

                    <div className="col-6 col-md-3">
                        <div className="fw-bold fs-3">271&nbsp;000</div>
                        <div className="small">rekordów samochodów*</div>
                    </div>

                    <div className="col-6 col-md-3">
                        <div className="fw-bold fs-3">3</div>
                        <div className="small">główne moduły</div>
                    </div>

                    <div className="col-6 col-md-3">
                        <div className="fw-bold fs-3">∞</div>
                        <div className="small">możliwości rozwoju</div>
                    </div>

                </div>

                <p className="small text-center mt-3 mb-0 opacity-75">
                    Pozdrowienia do więzienia
                </p>
            </div>
        </section>
    );
}
