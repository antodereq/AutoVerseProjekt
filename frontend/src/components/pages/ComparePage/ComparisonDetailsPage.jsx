import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../universal/Navbar.jsx";
import { API_URL } from "../../../config/api.js";
import "./ComparePage.css";

export default function ComparisonDetailsPage() {
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [comparison, setComparison] = useState(null);
    const [cars, setCars] = useState([]);
    const [message, setMessage] = useState("");

    const compareRows = [
        { label: "Marka", field: "marka" },
        { label: "Model", field: "model" },
        { label: "Generacja", field: "generacja" },
        {
            label: "Lata produkcji",
            value: (car) => `${car.rok_od} - ${car.rok_do}`,
        },
        { label: "Silnik", field: "silnik_kod" },
        { label: "Nazwa silnika", field: "silnik_nazwa" },
        { label: "Pojemność", field: "pojemnosc_cm3", suffix: " cm3" },
        { label: "Liczba cylindrów", field: "liczba_cylindrow" },
        { label: "Układ cylindrów", field: "uklad_cylindrow" },
        { label: "Moc [KM]", field: "moc_km", suffix: " KM" },
        { label: "Moment [Nm]", field: "moment_nm", suffix: " Nm" },
        { label: "Nadwozie", field: "nadwozie" },
        { label: "Napęd", field: "naped" },
        { label: "Skrzynia", field: "skrzynia" },
        { label: "Liczba biegów", field: "ilosc_biegow" },
        { label: "Paliwo", field: "typ_paliwa" },
        { label: "Doładowanie", field: "doladowanie" },
        { label: "0-100 km/h", field: "przyspieszenie_0_100", suffix: " s" },
        { label: "Prędkość maks.", field: "predkosc_max", suffix: " km/h" },
        { label: "Spalanie średnie", field: "spalanie_srednie", suffix: " l/100km" },
        { label: "Masa własna", field: "masa_wlasna_kg", suffix: " kg" },
    ];

    useEffect(() => {
        async function fetchComparison() {
            try {
                const response = await fetch(
                    `${API_URL}/getComparisonDetails.php?id=${id}`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                const data = await response.json();

                if (data.success) {
                    setComparison(data.comparison);
                    setCars(data.cars);
                } else {
                    setMessage(data.message || "Nie udało się pobrać porównania.");
                }
            } catch (error) {
                setMessage("Wystąpił błąd podczas pobierania porównania.");
            } finally {
                setLoading(false);
            }
        }

        fetchComparison();
    }, [id]);

    function getValue(car, row) {
        let value;

        if (row.value) {
            value = row.value(car);
        } else {
            value = car[row.field];
        }

        if (value === null || value === undefined || value === "") {
            return "—";
        }

        if (row.suffix) {
            return `${value}${row.suffix}`;
        }

        return value;
    }

    if (loading) {
        return (
            <div className="bg-light min-vh-100">
                <Navbar />
                <div className="container py-4">
                    <div className="alert alert-info">Ładowanie porównania...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-light min-vh-100">
            <Navbar />

            <div className="container py-4">
                {message && (
                    <div className="alert alert-danger">
                        {message}
                    </div>
                )}

                {comparison && (
                    <>
                        <div className="compare-hero mb-4">
                            <div>
                                <h1 className="fw-bold mb-1">
                                    {comparison.nazwa}
                                </h1>

                                <p className="text-muted mb-0">
                                    Zapisane porównanie z dnia{" "}
                                    <strong>{comparison.data_utworzenia}</strong>
                                </p>
                            </div>
                        </div>

                        <div className="mb-3">
                            <a href="/ClientPage" className="btn btn-outline-secondary btn-sm">
                                Wróć do profilu
                            </a>
                        </div>

                        <div className="compare-selected-cars my-4">
                            {cars.map((car) => {
                                return (
                                    <div className="compare-selected-card" key={car.compareID}>
                                        <div className="small text-muted">{car.marka}</div>
                                        <div className="fw-bold">{car.model}</div>
                                        <div className="small text-muted">
                                            {car.generacja}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="compare-desktop-table d-none d-lg-block">
                            <div className="table-responsive compare-table-wrapper">
                                <table className="table align-middle text-center compare-table mb-0">
                                    <thead>
                                        <tr>
                                            <th className="compare-param-col">Parametr</th>

                                            {cars.map((car) => {
                                                return (
                                                    <th key={car.compareID}>
                                                        <div className="fw-bold">
                                                            {car.marka} {car.model}
                                                        </div>
                                                        <div className="small text-muted">
                                                            {car.generacja}
                                                        </div>
                                                    </th>
                                                );
                                            })}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {compareRows.map((row) => {
                                            return (
                                                <tr key={row.label}>
                                                    <th scope="row" className="compare-param-col">
                                                        {row.label}
                                                    </th>

                                                    {cars.map((car) => {
                                                        return (
                                                            <td key={car.compareID}>
                                                                {getValue(car, row)}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="compare-mobile-list d-lg-none">
                            {compareRows.map((row) => {
                                return (
                                    <div className="compare-mobile-row" key={row.label}>
                                        <div className="compare-mobile-title">{row.label}</div>

                                        <div className="compare-mobile-values">
                                            {cars.map((car) => {
                                                return (
                                                    <div
                                                        className="compare-mobile-value"
                                                        key={car.compareID}
                                                    >
                                                        <div className="small text-muted">
                                                            {car.marka} {car.model}
                                                        </div>

                                                        <div className="fw-semibold">
                                                            {getValue(car, row)}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}