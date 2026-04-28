// src/components/pages/RecommendPage/RecommendResults.jsx
import React from "react";

export default function RecommendResults({ preferences, results }) {
    const hasPreferences = preferences !== null;

    if (hasPreferences === false) {
        return (
            <div className="recommend-results-placeholder">
                <p className="text-muted">
                    Wypełnij formularz po lewej, a tutaj pojawią się proponowane samochody.
                </p>
            </div>
        );
    }

    if (results.length === 0) {
        return (
            <div className="recommend-results-placeholder">
                <h5 className="fw-semibold mb-2">Brak idealnych dopasowań</h5>
                <p className="text-muted mb-0">
                    Spróbuj poluzować trochę wymagania – zwiększ budżet, pozwól na więcej typów nadwozia,
                    albo usuń część filtrów technicznych.
                </p>
            </div>
        );
    }

    return (
        <div className="recommend-results">
            <h5 className="fw-semibold mb-3">
                Propozycje dopasowane do Twoich preferencji
            </h5>

            <div className="d-flex flex-column gap-3">
                {results.map(function (car) {
                    const barWidth = car.matchScore + "%";
                    const title = car.brand + " " + car.model + " (" + car.yearFrom + "–" + car.yearTo + ")";

                    return (
                        <div
                            key={car.id}
                            className="card border-0 shadow-sm recommend-result-card"
                        >
                            {car.imageUrl && (
                                <img
                                    src={car.imageUrl}
                                    alt={title}
                                    className="recommend-car-image"
                                />
                            )}

                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <h6 className="mb-0 fw-semibold">{title}</h6>
                                    <span className="badge bg-orange-soft text-orange">
                                        {car.matchScore}% dopasowania
                                    </span>
                                </div>

                                <div className="small text-muted mb-2">
                                    {car.bodyType.toUpperCase()} • {car.power} KM •{" "}
                                    {car.transmission === "manual" ? "Manual" : "Automat"} •{" "}
                                    {car.drive.toUpperCase()} • {car.fuelType} • {car.country}
                                </div>

                                <div className="small text-muted mb-2">
                                    Poj. silnika: {car.engineCapacityCc} cm³ • Architektura: {car.engineLayout} •
                                    Śr. spalanie: {car.avgConsumptionLPer100.toFixed(1)} l/100 km
                                </div>

                                <div className="small text-muted mb-2">
                                    Szacowany zakres cen:{" "}
                                    <strong>
                                        {car.priceMin.toLocaleString("pl-PL")} –{" "}
                                        {car.priceMax.toLocaleString("pl-PL")} zł
                                    </strong>
                                </div>

                                <div className="progress" style={{ height: "0.7rem" }}>
                                    <div
                                        className="progress-bar bg-orange"
                                        role="progressbar"
                                        style={{ width: barWidth }}
                                        aria-valuenow={car.matchScore}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
