// src/components/pages/ComparePage/ComparePage.jsx
import { useEffect, useState } from "react";
import Navbar from "../../universal/Navbar.jsx";
import { API_URL } from "../../../config/api";

const MAX_SLOTS = 9;

export default function ComparePage() {
    const [inpCarName, setInpCarName] = useState("");
    const [selectCarBrand, setSelectCarBrand] = useState("");
    const [brands, setBrands] = useState([]);
    const [carList, setCarList] = useState([]);
    const [showCarList, setShowCarList] = useState(false);

    const [carID, setCarID] = useState(null);
    const [carParameters, setCarParameters] = useState({});

    const fieldEmpty = inpCarName === "" && selectCarBrand === "";

    useEffect(() => {
        async function fetchBrands() {
            const response = await fetch(`${API_URL}/getBrands.php`);
            const data = await response.json();
            setBrands(data);
        }

        fetchBrands();
    }, []);

    useEffect(() => {
        async function fetchCarList() {
            const response = await fetch(`${API_URL}/distinctModels.php`);
            const data = await response.json();
            setCarList(data);
        }

        async function fetchCarListByParameters() {
            const response = await fetch(`${API_URL}/modelsByParams.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: inpCarName,
                    brand: selectCarBrand,
                }),
            });

            const data = await response.json();
            console.log("PARAMS:", inpCarName, selectCarBrand);
            console.log("DATA Z PHP:", data);
            setCarList(data);
        }

        if (fieldEmpty) {
            fetchCarList();
        } else {
            fetchCarListByParameters();
        }
    }, [inpCarName, selectCarBrand, fieldEmpty]);

    function openCarList() {
        return (
            <div className="mt-3">
                <select
                    className="form-select mb-3"
                    id="car-brand-select"
                    value={selectCarBrand}
                    onChange={(e) => setSelectCarBrand(e.target.value)}
                >
                    <option value="">Wybierz markę...</option>

                    {brands.map((brand) => {
                        return (
                            <option key={brand.nazwa} value={brand.nazwa}>
                                {brand.nazwa}
                            </option>
                        );
                    })}
                </select>

                <input
                    type="text"
                    placeholder="Wyszukaj samochód..."
                    className="form-control mb-3"
                    id="car-search-input"
                    value={inpCarName}
                    onChange={(e) => setInpCarName(e.target.value)}
                />

                {carList.map((car) => {
                    return (
                        <div key={`${car.marka}-${car.model}`} className="border rounded p-2 mb-2" onClick={() => fetchCarParams(car.id)}>
                            <div>{car.marka} {car.model}</div>

                            <div>
                                <img
                                    src={`/${car.sciezka}`}
                                    alt={`${car.marka} ${car.model}`}
                                    style={{ width: "120px" }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
    async function fetchCarParams(id) {
        const response = await fetch(`${API_URL}/getCarParams.php`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ carID: id }),
        });

        const text = await response.text();
        const data = JSON.parse(text);

        setCarID(id);
        setCarParameters(data);
    }
    function renderSpecPage() {
        if (!carParameters.silniki) return null;

        return (
            <div className="border rounded p-2 mb-2">
                <select className="form-select mb-3">
                    <option value="">Wybierz silnik...</option>

                    {carParameters.silniki.map((engine) => (
                        <option key={engine.id} value={engine.id}>
                            {engine.kod} {engine.pojemnosc_cm3} cm3
                        </option>
                    ))}
                </select>
                <select className="form-select mb-3">
                    <option value="">Wybierz nadwozie...</option>
                    {carParameters.nadwozia.map((nadwozie) => (
                        <option key={nadwozie.id} value={nadwozie.id}>
                            {nadwozie.nazwa}
                        </option>
                    ))}
                </select>
                <select className="form-select mb-3">
                    <option value="">Wybierz napęd...</option>
                    {carParameters.napedy.map((naped) => (
                        <option key={naped.id} value={naped.id}>
                            {naped.nazwa}
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    return (
        <div className="bg-light min-vh-100">
            <Navbar />

            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h1 className="fw-bold mb-1">
                            Porównywarka <span className="text-orange">AutoVerse</span>
                        </h1>

                        <p className="text-muted mb-0">
                            Wybierz samochody do porównania. Maksymalnie{" "}
                            <strong>{MAX_SLOTS} aut</strong>.
                        </p>
                    </div>
                </div>

                <div className="table-responsive mb-4">
                    <table className="table table-bordered align-middle text-center">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: "160px" }}>Parametr</th>

                                <th style={{ minWidth: "220px" }}>
                                    <button
                                        type="button"
                                        className="w-100 h-100 border-0 bg-transparent"
                                        style={{ padding: "16px" }}
                                        onClick={() => setShowCarList(prev => !prev)} //drugie kliknięcie "dodaj samochód" zamyka okno
                                    >
                                        <div className="border rounded-3 p-3 h-100 d-flex flex-column justify-content-center">
                                            <div style={{ fontSize: "32px", lineHeight: "1" }}>
                                                +
                                            </div>

                                            <div className="mt-2 fw-semibold">
                                                Dodaj samochód
                                            </div>

                                            <div className="small text-muted">
                                                Slot 1 z {MAX_SLOTS}
                                            </div>
                                        </div>
                                    </button>

                                    {showCarList && openCarList()}
                                    {renderSpecPage()}
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <th scope="row">Marka</th>
                                <td>—</td>
                            </tr>

                            <tr>
                                <th scope="row">Model</th>
                                <td>—</td>
                            </tr>

                            <tr>
                                <th scope="row">Generacja</th>
                                <td>—</td>
                            </tr>

                            <tr>
                                <th scope="row">Lata produkcji</th>
                                <td>—</td>
                            </tr>

                            <tr>
                                <th scope="row">Silnik</th>
                                <td>—</td>
                            </tr>

                            <tr>
                                <th scope="row">Moc [KM]</th>
                                <td>—</td>
                            </tr>

                            <tr>
                                <th scope="row">Moment [Nm]</th>
                                <td>—</td>
                            </tr>

                            <tr>
                                <th scope="row">Nadwozie</th>
                                <td>—</td>
                            </tr>

                            <tr>
                                <th scope="row">Napęd</th>
                                <td>—</td>
                            </tr>

                            <tr>
                                <th scope="row">Skrzynia</th>
                                <td>—</td>
                            </tr>

                            <tr>
                                <th scope="row">Paliwo</th>
                                <td>—</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p className="text-muted small mt-2">
                    Wybierz pierwszy samochód klikając w kafelek z „+ Dodaj samochód”.
                </p>
            </div>
        </div>
    );
}