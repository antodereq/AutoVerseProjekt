// src/components/pages/RecommendPage/RecommenderPage.jsx

import React, { useState, useEffect } from "react";
import Navbar from "../../universal/Navbar.jsx";
import RecommendForm from "./RecommendForm.jsx";
import RecommendResults from "./RecommendResults.jsx";
import { buildApiUrl } from "../../../config/api.js";
import "../../../styles/RecommenderPage.css";

function normalizeString(value) {
    return String(value || "").trim().toLowerCase();
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function scoreSoftRange(value, min, max) {
    const actual = Number(value);
    const lower = Number(min);
    const upper = Number(max);

    if (Number.isNaN(actual)) {
        return 0;
    }

    if (!Number.isNaN(lower) && !Number.isNaN(upper)) {
        if (actual >= lower && actual <= upper) {
            return 1;
        }

        const range = Math.max(upper - lower, 1);
        const delta = actual < lower ? lower - actual : actual - upper;
        const tolerance = Math.max(range * 0.6, range * 0.25, 5);
        return clamp(1 - delta / tolerance, 0, 1);
    }

    if (!Number.isNaN(lower)) {
        if (actual >= lower) {
            return 1;
        }
        const delta = lower - actual;
        const tolerance = Math.max(lower * 0.2, 10);
        return clamp(1 - delta / tolerance, 0, 1);
    }

    if (!Number.isNaN(upper)) {
        if (actual <= upper) {
            return 1;
        }
        const delta = actual - upper;
        const tolerance = Math.max(upper * 0.2, 5);
        return clamp(1 - delta / tolerance, 0, 1);
    }

    return 0;
}

function scoreYearRange(car, yearFrom, yearTo) {
    const prefFrom = Number(yearFrom);
    const prefTo = Number(yearTo);
    const carFrom = Number(car.yearFrom);
    const carTo = Number(car.yearTo);

    if (Number.isNaN(carFrom) || Number.isNaN(carTo)) {
        return 0;
    }

    const hasPrefFrom = !Number.isNaN(prefFrom);
    const hasPrefTo = !Number.isNaN(prefTo);

    if (!hasPrefFrom && !hasPrefTo) {
        return 0;
    }

    const effectiveFrom = hasPrefFrom ? prefFrom : carFrom;
    const effectiveTo = hasPrefTo ? prefTo : carTo;

    if (carTo >= effectiveFrom && carFrom <= effectiveTo) {
        return 1;
    }

    const gap = carTo < effectiveFrom ? effectiveFrom - carTo : carFrom - effectiveTo;
    const prefRange = Math.max((effectiveTo - effectiveFrom), 5);
    const tolerance = Math.max(prefRange * 0.6, 5);
    return clamp(1 - gap / tolerance, 0, 1);
}

function scoreLowerIsBetter(value, maxValue) {
    const actual = Number(value);
    const max = Number(maxValue);
    if (Number.isNaN(actual) || Number.isNaN(max)) {
        return 0;
    }

    if (actual <= max) {
        return 1;
    }

    const delta = actual - max;
    const tolerance = Math.max(max * 0.2, 2);
    return clamp(1 - delta / tolerance, 0, 1);
}

function buildExplanation(scoreDetails, totalScore) {
    const notes = [];

    if (scoreDetails.price !== undefined) {
        if (scoreDetails.price >= 0.9) {
            notes.push("Cena jest bardzo dobrze dopasowana");
        } else if (scoreDetails.price >= 0.6) {
            notes.push("Cena jest bliska oczekiwanej");
        } else {
            notes.push("Cena odbiega od preferowanego zakresu");
        }
    }

    if (scoreDetails.drive !== undefined) {
        notes.push(scoreDetails.drive ? "Wybrany napęd pasuje" : "Napęd różni się od preferowanego");
    }

    if (scoreDetails.transmission !== undefined) {
        notes.push(scoreDetails.transmission ? "Skrzynia biegów odpowiada preferencji" : "Skrzynia biegów jest inna niż wybrana");
    }

    if (scoreDetails.body !== undefined) {
        notes.push(scoreDetails.body ? "Typ nadwozia pasuje" : "Inny typ nadwozia niż preferowany");
    }

    if (scoreDetails.power !== undefined) {
        if (scoreDetails.power >= 0.9) {
            notes.push("Moc jest bardzo zbliżona do oczekiwanej");
        } else if (scoreDetails.power >= 0.5) {
            notes.push("Moc mieści się w przybliżonym zakresie");
        } else {
            notes.push("Moc znacząco różni się od oczekiwań");
        }
    }

    if (scoreDetails.year !== undefined) {
        if (scoreDetails.year >= 0.9) {
            notes.push("Rocznik bardzo dobrze pasuje do preferencji");
        } else if (scoreDetails.year >= 0.5) {
            notes.push("Rocznik jest bliski preferowanemu zakresowi");
        } else {
            notes.push("Rocznik jest wyraźnie poza preferowanym przedziałem");
        }
    }

    if (scoreDetails.fuel !== undefined) {
        notes.push(scoreDetails.fuel ? "Rodzaj paliwa jest zgodny" : "Rodzaj paliwa jest inny niż preferowany");
    }

    if (scoreDetails.architecture !== undefined) {
        notes.push(scoreDetails.architecture ? "Architektura silnika pasuje" : "Architektura silnika jest inna niż wybrana");
    }

    if (scoreDetails.capacity !== undefined) {
        if (scoreDetails.capacity >= 0.9) {
            notes.push("Pojemność silnika jest bardzo bliska preferowanej");
        } else if (scoreDetails.capacity >= 0.5) {
            notes.push("Pojemność silnika mieści się w przybliżonym zakresie");
        } else {
            notes.push("Pojemność silnika znacząco odbiega od oczekiwań");
        }
    }

    const summary = totalScore >= 85
        ? "Bardzo dobre dopasowanie." 
        : totalScore >= 65
            ? "Dobre dopasowanie." 
            : totalScore >= 40
                ? "Średnie dopasowanie." 
                : "Niskie dopasowanie.";

    return [summary, ...notes.slice(0, 3)].join(" ");
}

function calculateMatchScore(preferences, car) {
    // Filtry, które wykluczają ofertę
    if (preferences.brand !== "") {
        const prefBrand = normalizeString(preferences.brand);
        const carBrand = normalizeString(car.brand);
        if (!carBrand.includes(prefBrand)) {
            return { score: 0, explanation: "Marka nie pasuje do wybranej preferencji.", passed: false };
        }
    }

    if (preferences.model !== "") {
        const prefModel = normalizeString(preferences.model);
        const carModel = normalizeString(car.model);
        if (!carModel.includes(prefModel)) {
            return { score: 0, explanation: "Model nie pasuje do wybranej preferencji.", passed: false };
        }
    }

    if (preferences.countries.length > 0) {
        const hasMatchingCountry = preferences.countries.some(country =>
            normalizeString(country) === normalizeString(car.country)
        );
        if (!hasMatchingCountry) {
            return { score: 0, explanation: "Kraj pochodzenia nie znajduje się w wybranych opcjach.", passed: false };
        }
    }

    if (preferences.driveTypes.length > 0) {
        const hasMatchingDrive = preferences.driveTypes.some(drive =>
            normalizeString(drive) === normalizeString(car.drive)
        );
        if (!hasMatchingDrive) {
            return { score: 0, explanation: "Napęd nie pasuje do wybranych preferencji.", passed: false };
        }
    }

    if (preferences.transmission !== "any") {
        if (normalizeString(car.transmission) !== normalizeString(preferences.transmission)) {
            return { score: 0, explanation: "Skrzynia biegów nie pasuje do wybranej preferencji.", passed: false };
        }
    }

    if (preferences.bodyTypes.length > 0) {
        const hasMatchingBody = preferences.bodyTypes.some(body =>
            normalizeString(body) === normalizeString(car.bodyType)
        );
        if (!hasMatchingBody) {
            return { score: 0, explanation: "Typ nadwozia nie odpowiada wybranym preferencjom.", passed: false };
        }
    }

    if (preferences.fuelType !== "any") {
        if (normalizeString(car.fuelType) !== normalizeString(preferences.fuelType)) {
            return { score: 0, explanation: "Rodzaj paliwa nie odpowiada wybranej preferencji.", passed: false };
        }
    }

    if (preferences.engineLayout !== "") {
        if (normalizeString(car.engineLayout) !== normalizeString(preferences.engineLayout)) {
            return { score: 0, explanation: "Architektura silnika nie odpowiada wybranej preferencji.", passed: false };
        }
    }

    const categories = [];

    if (preferences.budgetMin !== "" || preferences.budgetMax !== "") {
        const priceScore = scoreSoftRange(
            (car.priceMin + car.priceMax) / 2,
            preferences.budgetMin !== "" ? Number(preferences.budgetMin) : NaN,
            preferences.budgetMax !== "" ? Number(preferences.budgetMax) : NaN
        );
        categories.push({ key: "price", score: priceScore, weight: 25 });
    }

    if (preferences.driveTypes.length > 0) {
        categories.push({ key: "drive", score: 1, weight: 16 });
    }

    if (preferences.transmission !== "any") {
        categories.push({ key: "transmission", score: 1, weight: 12 });
    }

    if (preferences.bodyTypes.length > 0) {
        categories.push({ key: "body", score: 1, weight: 12 });
    }

    if (preferences.powerMin !== "" || preferences.powerMax !== "") {
        const powerScore = scoreSoftRange(
            car.power,
            preferences.powerMin !== "" ? Number(preferences.powerMin) : NaN,
            preferences.powerMax !== "" ? Number(preferences.powerMax) : NaN
        );
        categories.push({ key: "power", score: powerScore, weight: 15 });
    }

    if (preferences.yearFrom !== "" || preferences.yearTo !== "") {
        const yearScore = scoreYearRange(car, preferences.yearFrom, preferences.yearTo);
        categories.push({ key: "year", score: yearScore, weight: 8 });
    }

    if (preferences.avgConsumptionMax !== "") {
        const consumptionScore = scoreLowerIsBetter(car.avgConsumptionLPer100, preferences.avgConsumptionMax);
        categories.push({ key: "consumption", score: consumptionScore, weight: 6 });
    }

    if (preferences.fuelType !== "any") {
        categories.push({ key: "fuel", score: 1, weight: 4 });
    }

    if (preferences.engineLayout !== "") {
        categories.push({ key: "architecture", score: 1, weight: 4 });
    }

    if (preferences.engineCapacityMin !== "" || preferences.engineCapacityMax !== "") {
        const capacityScore = scoreSoftRange(
            car.engineCapacityCc,
            preferences.engineCapacityMin !== "" ? Number(preferences.engineCapacityMin) : NaN,
            preferences.engineCapacityMax !== "" ? Number(preferences.engineCapacityMax) : NaN
        );
        categories.push({ key: "capacity", score: capacityScore, weight: 4 });
    }

    const activeCategories = categories.filter((category) => category.weight > 0);
    const totalWeight = activeCategories.reduce((sum, category) => sum + category.weight, 0);
    const totalScore = activeCategories.reduce(
        (sum, category) => sum + category.score * category.weight,
        0
    );

    if (totalWeight === 0) {
        return {
            score: 100,
            explanation: "Brak preferencji punktowanych – oferta spełnia wszystkie wybrane filtry.",
            passed: true
        };
    }

    const normalizedScore = Math.round((totalScore / totalWeight) * 100);
    const scoreDetails = activeCategories.reduce((details, category) => {
        details[category.key] = category.score;
        return details;
    }, {});

    return {
        score: normalizedScore,
        explanation: buildExplanation(scoreDetails, normalizedScore)
    };
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
                    fetch(buildApiUrl("/cars.php")),
                    fetch(buildApiUrl("/filters.php"))
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

                const { score, explanation, passed } = calculateMatchScore(
                    formValues,
                    car
                );

                return {
                    ...car,
                    matchScore: score,
                    matchExplanation: explanation,
                    matchPassed: passed !== false
                };
            })

            .filter(function (car) {

                return car.matchPassed;
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