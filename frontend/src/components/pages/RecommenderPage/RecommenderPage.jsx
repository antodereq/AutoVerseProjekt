// src/components/pages/RecommendPage/RecommenderPage.jsx

import React, { useState, useEffect } from "react";
import Navbar from "../../universal/Navbar.jsx";
import RecommendForm from "./RecommendForm.jsx";
import RecommendResults from "./RecommendResults.jsx";
import { API_URL } from "../../../config/api.js";
import "../../../styles/RecommenderPage.css";

function calculateMatchScore(preferences, car) {

    let score = 0;
    let maxScore = 0;

    // Najpierw sprawdź, czy samochód spełnia wszystkie wybrane kryteria
    // Jeśli nie, zwróć 0 (samochód nie jest brany pod uwagę)

    // Marka - jeśli wybrana, musi pasować
    if (preferences.brand !== "") {
        const prefBrand = preferences.brand.trim().toLowerCase();
        const carBrand = car.brand.trim().toLowerCase();
        if (carBrand.indexOf(prefBrand) === -1) {
            return 0;
        }
    }

    // Model - jeśli wybrany, musi pasować
    if (preferences.model !== "") {
        const prefModel = preferences.model.trim().toLowerCase();
        const carModel = car.model.trim().toLowerCase();
        if (carModel.indexOf(prefModel) === -1) {
            return 0;
        }
    }

    // Napęd - jeśli wybrane, przynajmniej jeden musi pasować
    if (preferences.driveTypes.length > 0) {
        const hasMatchingDrive = preferences.driveTypes.some(drive =>
            car.drive && car.drive.toLowerCase() === drive.toLowerCase()
        );
        if (!hasMatchingDrive) {
            return 0;
        }
    }

    // Kraj - jeśli wybrane, przynajmniej jeden musi pasować
    if (preferences.countries.length > 0) {
        const hasMatchingCountry = preferences.countries.some(country =>
            car.country && car.country.toLowerCase() === country.toLowerCase()
        );
        if (!hasMatchingCountry) {
            return 0;
        }
    }

    // Pojemność - jeśli zakres wybrany, musi pasować
    if (preferences.engineCapacityMin !== "" || preferences.engineCapacityMax !== "") {
        const minCc = preferences.engineCapacityMin !== "" ? Number(preferences.engineCapacityMin) : 0;
        const maxCc = preferences.engineCapacityMax !== "" ? Number(preferences.engineCapacityMax) : 99999;
        if (car.engineCapacityCc < minCc || car.engineCapacityCc > maxCc) {
            return 0;
        }
    }

    // Moc - jeśli zakres wybrany, musi pasować
    if (preferences.powerMin !== "" || preferences.powerMax !== "") {
        const minHp = preferences.powerMin !== "" ? Number(preferences.powerMin) : 0;
        const maxHp = preferences.powerMax !== "" ? Number(preferences.powerMax) : 99999;
        if (car.power < minHp || car.power > maxHp) {
            return 0;
        }
    }

    // Spalanie - jeśli max wybrane, musi pasować
    if (preferences.avgConsumptionMax !== "") {
        const maxCons = Number(preferences.avgConsumptionMax);
        if (car.avgConsumptionLPer100 > maxCons) {
            return 0;
        }
    }

    // Roczniki - jeśli zakres wybrany, musi pasować
    if (preferences.yearFrom !== "" || preferences.yearTo !== "") {
        const prefFrom = preferences.yearFrom !== "" ? Number(preferences.yearFrom) : 1900;
        const prefTo = preferences.yearTo !== "" ? Number(preferences.yearTo) : 2100;
        const carFrom = car.yearFrom;
        const carTo = car.yearTo;
        const overlaps = carTo >= prefFrom && carFrom <= prefTo;
        if (!overlaps) {
            return 0;
        }
    }

    // Skrzynia biegów - jeśli wybrana, musi pasować
    if (preferences.transmission !== "any") {
        const prefTransmission = preferences.transmission.trim().toLowerCase();
        const carTransmission = car.transmission ? car.transmission.trim().toLowerCase() : "";
        if (carTransmission !== prefTransmission) {
            return 0;
        }
    }

    // Samochód przeszedł wszystkie filtry, teraz licz score

    // Budżet
    maxScore += 25;
    if (preferences.budgetMin !== "" && preferences.budgetMax !== "") {
        const prefMin = Number(preferences.budgetMin);
        const prefMax = Number(preferences.budgetMax);
        if (car.priceMax >= prefMin && car.priceMin <= prefMax) {
            score += 25;
        } else {
            const carCenter = (car.priceMin + car.priceMax) / 2;
            if (carCenter >= prefMin * 0.8 && carCenter <= prefMax * 1.2) {
                score += 15;
            }
        }
    } else {
        score += 10;
    }

    // Styl jazdy
    maxScore += 20;
    if (preferences.usageType !== "") {
        if (car.usageTags.includes(preferences.usageType)) {
            score += 20;
        }
    } else {
        score += 10;
    }

    // Nadwozie
    maxScore += 15;
    if (preferences.bodyTypes.length > 0) {
        const matchesBody = preferences.bodyTypes.some(body =>
            car.bodyType && car.bodyType.toLowerCase() === body.toLowerCase()
        );
        if (matchesBody) {
            score += 15;
        }
    } else {
        score += 8;
    }

    // Skrzynia
    maxScore += 15;
    if (preferences.transmission !== "any") {
        if (car.transmission && car.transmission.toLowerCase() === preferences.transmission.toLowerCase()) {
            score += 15;
        }
    } else {
        score += 10;
    }

    // Paliwo
    maxScore += 10;
    if (preferences.fuelType !== "any") {
        if (car.fuelType && car.fuelType.toLowerCase() === preferences.fuelType.toLowerCase()) {
            score += 10;
        }
    } else {
        score += 7;
    }

    // Architektura silnika
    if (preferences.engineLayout !== "") {
        maxScore += 5;
        if (car.engineLayout && car.engineLayout.toLowerCase() === preferences.engineLayout.toLowerCase()) {
            score += 5;
        }
    }

    if (maxScore === 0) {
        return 0;
    }

    return Math.round((score / maxScore) * 100);
}

export default function RecommenderPage() {

    const [preferences, setPreferences] = useState(null);

    const [results, setResults] = useState([]);

    const [cars, setCars] = useState([]);

    const [filters, setFilters] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function fetchData() {
            try {
                const [carsResponse, filtersResponse] = await Promise.all([
                    fetch(`${API_URL}/api/cars`),
                    fetch(`${API_URL}/api/filters`)
                ]);

                if (!carsResponse.ok || !filtersResponse.ok) {
                    throw new Error("Błąd serwera podczas pobierania danych");
                }

                const carsData = await carsResponse.json();
                const filtersData = await filtersResponse.json();

                setCars(carsData);
                setFilters(filtersData);
            } catch (error) {
                console.error(
                    "Błąd pobierania danych:",
                    error
                );
                setError("Nie udało się pobrać opcji filtrów z bazy danych.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();

    }, []);

    function handleRecommend(formValues) {

        setPreferences(formValues);

        const scored = cars

            .map(function (car) {

                const score = calculateMatchScore(
                    formValues,
                    car
                );

                return {
                    ...car,
                    matchScore: score
                };
            })

            .filter(function (car) {

                return car.matchScore > 0;
            })

            .sort(function (a, b) {

                return b.matchScore - a.matchScore;
            });

        setResults(scored);
    }

    return (

        <div className="bg-light min-vh-100">

            <Navbar />

            <div className="recommend-page">

                <div className="container-fluid recommend-container">

                    <div className="recommend-inner">

                        <h1 className="fw-bold mb-3">
                            Rekomendator{" "}
                            <span className="text-orange">
                                AutoVerse
                            </span>
                        </h1>

                        <p className="text-muted mb-4">
                            Wypełnij formularz,
                            a spróbujemy dobrać
                            samochody pasujące
                            do Twoich wymagań.
                            Im więcej pól wypełnisz,
                            tym bardziej zawężone
                            wyniki otrzymasz.
                        </p>

                        {loading || filters === null ? (

                            error ? (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            ) : (
                                <div className="alert alert-info">
                                    Ładowanie opcji filtrów z bazy danych...
                                </div>
                            )

                        ) : (

                            <div className="row gy-4">

                                <div className="col-lg-5 col-xl-4">

                                    <RecommendForm
                                        onRecommend={handleRecommend}
                                        filters={filters}
                                    />

                                </div>

                                <div className="col-lg-7 col-xl-8">

                                    <RecommendResults
                                        preferences={preferences}
                                        results={results}
                                    />

                                </div>

                            </div>
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}