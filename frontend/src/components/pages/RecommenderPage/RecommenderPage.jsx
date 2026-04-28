// src/components/pages/RecommendPage/RecommenderPage.jsx
import React, { useState } from "react";
import Navbar from "../../universal/Navbar.jsx";
import RecommendForm from "./RecommendForm.jsx";
import RecommendResults from "./RecommendResults.jsx";
import "../../../styles/RecommenderPage.css";

function calculateMatchScore(preferences, car) {
    let score = 0;
    let maxScore = 0;

    // Budżet – 25 pkt
    maxScore = maxScore + 25;
    if (preferences.budgetMin !== "" && preferences.budgetMax !== "") {
        const prefMin = Number(preferences.budgetMin);
        const prefMax = Number(preferences.budgetMax);

        if (car.priceMax >= prefMin && car.priceMin <= prefMax) {
            score = score + 25;
        } else {
            const carCenter = (car.priceMin + car.priceMax) / 2;
            if (carCenter >= prefMin * 0.8 && carCenter <= prefMax * 1.2) {
                score = score + 15;
            }
        }
    } else {
        score = score + 10;
    }

    // Styl jazdy – 20 pkt
    maxScore = maxScore + 20;
    if (preferences.usageType !== "") {
        if (car.usageTags.includes(preferences.usageType)) {
            score = score + 20;
        }
    } else {
        score = score + 10;
    }

    // Nadwozie – 15 pkt
    maxScore = maxScore + 15;
    if (preferences.bodyTypes.length > 0) {
        let matchesBody = false;
        for (const body of preferences.bodyTypes) {
            if (car.bodyType === body) {
                matchesBody = true;
            }
        }
        if (matchesBody === true) {
            score = score + 15;
        }
    } else {
        score = score + 8;
    }

    // Skrzynia – 15 pkt
    maxScore = maxScore + 15;
    if (preferences.transmission !== "any") {
        if (car.transmission === preferences.transmission) {
            score = score + 15;
        }
    } else {
        score = score + 10;
    }

    // Napęd – 15 pkt
    maxScore = maxScore + 15;
    if (preferences.driveTypes.length > 0) {
        maxScore += 15;

        if (preferences.driveTypes.includes(car.drive)) {
            score += 15;
        } else {
            return 0;
        }
    } else {
        score += 10;
    }

    // Paliwo – 10 pkt
    maxScore = maxScore + 10;
    if (preferences.fuelType !== "any") {
        if (car.fuelType === preferences.fuelType) {
            score = score + 10;
        }
    } else {
        score = score + 7;
    }

    // ====== DODATKOWE „TWARDE” FILTRY ======
    // Te pola mocno zawężają wyniki – jeśli nie pasują, auto dostaje 0%

    // Marka
    if (preferences.brand !== "") {
        const prefBrand = preferences.brand.trim().toLowerCase();
        const carBrand = car.brand.trim().toLowerCase();
        if (carBrand.indexOf(prefBrand) === -1) {
            return 0;
        } else {
            score = score + 5;
            maxScore = maxScore + 5;
        }
    }

    // Model
    if (preferences.model !== "") {
        const prefModel = preferences.model.trim().toLowerCase();
        const carModel = car.model.trim().toLowerCase();
        if (carModel.indexOf(prefModel) === -1) {
            return 0;
        } else {
            score = score + 5;
            maxScore = maxScore + 5;
        }
    }

    // Architektura silnika
    if (preferences.engineLayout !== "") {
        maxScore = maxScore + 5;
        if (car.engineLayout === preferences.engineLayout) {
            score = score + 5;
        }
    }

    // Pojemność silnika (zakres)
    if (preferences.engineCapacityMin !== "" || preferences.engineCapacityMax !== "") {
        maxScore = maxScore + 8;
        const minCc = preferences.engineCapacityMin !== "" ? Number(preferences.engineCapacityMin) : 0;
        const maxCc = preferences.engineCapacityMax !== "" ? Number(preferences.engineCapacityMax) : 99999;

        if (car.engineCapacityCc >= minCc && car.engineCapacityCc <= maxCc) {
            score = score + 8;
        } else {
            return 0;
        }
    }

    // Moc (zakres)
    if (preferences.powerMin !== "" || preferences.powerMax !== "") {
        maxScore = maxScore + 8;
        const minHp = preferences.powerMin !== "" ? Number(preferences.powerMin) : 0;
        const maxHp = preferences.powerMax !== "" ? Number(preferences.powerMax) : 99999;

        if (car.power >= minHp && car.power <= maxHp) {
            score = score + 8;
        } else {
            return 0;
        }
    }

    // Średnie spalanie – max
    if (preferences.avgConsumptionMax !== "") {
        maxScore = maxScore + 6;
        const maxCons = Number(preferences.avgConsumptionMax);
        if (car.avgConsumptionLPer100 <= maxCons) {
            score = score + 6;
        } else {
            return 0;
        }
    }

    // Roczniki
    if (preferences.yearFrom !== "" || preferences.yearTo !== "") {
        maxScore = maxScore + 8;

        const prefFrom = preferences.yearFrom !== "" ? Number(preferences.yearFrom) : 1900;
        const prefTo = preferences.yearTo !== "" ? Number(preferences.yearTo) : 2100;

        const carFrom = car.yearFrom;
        const carTo = car.yearTo;

        const overlaps =
            carTo >= prefFrom &&
            carFrom <= prefTo;

        if (overlaps === true) {
            score = score + 8;
        } else {
            return 0;
        }
    }

    // Kraj pochodzenia
    if (preferences.countries.length > 0) {
        maxScore += 5;

        if (preferences.countries.includes(car.country)) {
            score += 5;
        } else {
            return 0;
        }
    }


    if (maxScore === 0) {
        return 0;
    }

    const percent = Math.round((score / maxScore) * 100);
    return percent;
}

// Mock – rozszerzony o markę, model, lata, architekturę, pojemność, spalanie i obrazek
const mockCars = [
    {
        id: 1,
        brand: "Toyota",
        model: "GR Yaris",
        yearFrom: 2020,
        yearTo: 2024,
        priceMin: 130000,
        priceMax: 180000,
        usageTags: ["miasto", "mieszany", "tor"],
        bodyType: "hatchback",
        transmission: "manual",
        drive: "awd",
        fuelType: "benzyna",
        engineLayout: "R3",
        engineCapacityCc: 1618,
        power: 261,
        avgConsumptionLPer100: 8.5,
        country: "Japonia",
        imageUrl: "https://via.placeholder.com/600x350?text=Toyota+GR+Yaris"
    },
    {
        id: 2,
        brand: "BMW",
        model: "M240i xDrive (G42)",
        yearFrom: 2021,
        yearTo: 2024,
        priceMin: 220000,
        priceMax: 300000,
        usageTags: ["trasa", "mieszany", "tor"],
        bodyType: "coupe",
        transmission: "automat",
        drive: "awd",
        fuelType: "benzyna",
        engineLayout: "R6",
        engineCapacityCc: 2998,
        power: 374,
        avgConsumptionLPer100: 8.0,
        country: "Niemcy",
        imageUrl: "https://via.placeholder.com/600x350?text=BMW+M240i+G42"
    },
    {
        id: 3,
        brand: "Mazda",
        model: "MX-5 ND",
        yearFrom: 2015,
        yearTo: 2024,
        priceMin: 90000,
        priceMax: 160000,
        usageTags: ["miasto", "mieszany"],
        bodyType: "roadster",
        transmission: "manual",
        drive: "rwd",
        fuelType: "benzyna",
        engineLayout: "R4",
        engineCapacityCc: 1998,
        power: 184,
        avgConsumptionLPer100: 7.0,
        country: "Japonia",
        imageUrl: "https://via.placeholder.com/600x350?text=Mazda+MX-5+ND"
    },
    {
        id: 4,
        brand: "Volkswagen",
        model: "Golf 8 1.5 TSI",
        yearFrom: 2019,
        yearTo: 2024,
        priceMin: 90000,
        priceMax: 150000,
        usageTags: ["miasto", "mieszany", "trasa"],
        bodyType: "hatchback",
        transmission: "automat",
        drive: "fwd",
        fuelType: "benzyna",
        engineLayout: "R4",
        engineCapacityCc: 1498,
        power: 150,
        avgConsumptionLPer100: 6.5,
        country: "Niemcy",
        imageUrl: "https://via.placeholder.com/600x350?text=VW+Golf+8+1.5+TSI"
    },
    {
        id: 5,
        brand: "Skoda",
        model: "Octavia 2.0 TDI",
        yearFrom: 2020,
        yearTo: 2024,
        priceMin: 100000,
        priceMax: 170000,
        usageTags: ["trasa", "mieszany"],
        bodyType: "kombi",
        transmission: "automat",
        drive: "fwd",
        fuelType: "diesel",
        engineLayout: "R4",
        engineCapacityCc: 1968,
        power: 150,
        avgConsumptionLPer100: 5.0,
        country: "Czechy",
        imageUrl: "https://via.placeholder.com/600x350?text=Skoda+Octavia+2.0+TDI"
    }
];

export default function RecommenderPage() {
    const [preferences, setPreferences] = useState(null);
    const [results, setResults] = useState([]);

    function handleRecommend(formValues) {
        setPreferences(formValues);

        const scored = mockCars
            .map(function (car) {
                const score = calculateMatchScore(formValues, car);
                return { ...car, matchScore: score };
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
                            Rekomendator <span className="text-orange">AutoVerse</span>
                        </h1>
                        <p className="text-muted mb-4">
                            Wypełnij formularz, a spróbujemy dobrać samochody pasujące do Twoich wymagań.
                            Im więcej pól wypełnisz, tym bardziej zawężone wyniki otrzymasz.
                        </p>

                        <div className="row gy-4">
                            <div className="col-lg-5 col-xl-4">
                                <RecommendForm onRecommend={handleRecommend} />
                            </div>
                            <div className="col-lg-7 col-xl-8">
                                <RecommendResults preferences={preferences} results={results} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
