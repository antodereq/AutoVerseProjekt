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
    const [selectedCarId, setSelectedCarId] = useState(null);
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
            setCarList(data);
        }

        if (fieldEmpty) {
            fetchCarList();
        } else {
            fetchCarListByParameters();
        }
    }, [inpCarName, selectCarBrand, fieldEmpty]);

    async function fetchCarParams(id) {
        const response = await fetch(`${API_URL}/getCarParams.php`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ carID: id }),
        });

        // const text = await response.text();
        // const data = JSON.parse(text);
        const data = await response.json();

        setSelectedCarId(id);
        setCarParameters(data);
    }
        function closeOverlay() {
        setSelectedCarId(null);
        setCarParameters({});
    }

    function getYearsTab(years) {
        if (!years || years.length === 0) {
            return [];
        }

        let yearsTab = [];

        for (let i = 0; i <= years.length - 1; i++) {
            let yearSpan = `${years[i].rok_od} - ${years[i].rok_do}`;
            yearsTab.push(yearSpan);
        }

        return yearsTab;
    }

    function getDefault(arr) {
        if (arr.length === 1) {
            return arr[0].id;
        }

        return "";
    }

    function disableIfSingle(arr) {
        if (arr.length === 1) {
            return true;
        }

        return false;
    }

    function renderFiltersOnCard(car) {
        if (selectedCarId !== car.id) {
            return null;
        }

        if (!carParameters.silniki) {
            return null;
        }

        let yearsTab = getYearsTab(carParameters.roczniki);

        return (
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 rounded-3 p-3 d-flex align-items-center">
                <button
                    type="button"
                    className="btn btn-sm btn-light position-absolute top-0 end-0 m-2 rounded-circle"
                    onClick={(e) => {
                        e.stopPropagation();
                        closeOverlay();
                    }}
                    style={{
                        width: "32px",
                        height: "32px",
                        padding: "0",
                        lineHeight: "1",
                        zIndex: 2,
                    }}
                >
                    ✕
                </button>

                <div
                    className="w-100"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="text-white fw-semibold text-center mb-3">
                        {car.marka} {car.model}
                    </div>

                    <select className="form-select form-select-sm mb-2">
                        <option value="">Wybierz rocznik...</option>

                        {yearsTab.map((year, index) => {
                            return (
                                <option key={index} value={year}>
                                    {year}
                                </option>
                            );
                        })}
                    </select>

                    <select
                        className="form-select form-select-sm mb-2"
                        defaultValue={getDefault(carParameters.silniki)}
                        disabled={disableIfSingle(carParameters.silniki)}
                    >
                        <option value="">Wybierz silnik...</option>

                        {carParameters.silniki.map((engine) => (
                            <option key={engine.id} value={engine.id}>
                                {engine.kod} {engine.pojemnosc_cm3} cm3
                            </option>
                        ))}
                    </select>

                    <select
                        className="form-select form-select-sm mb-2"
                        defaultValue={getDefault(carParameters.nadwozia)}
                        disabled={disableIfSingle(carParameters.nadwozia)}
                    >
                        <option value="">Wybierz nadwozie...</option>

                        {carParameters.nadwozia.map((nadwozie) => (
                            <option key={nadwozie.id} value={nadwozie.id}>
                                {nadwozie.nazwa}
                            </option>
                        ))}
                    </select>

                    <select
                        className="form-select form-select-sm mb-2"
                        defaultValue={getDefault(carParameters.napedy)}
                        disabled={disableIfSingle(carParameters.napedy)}
                    >
                        <option value="">Wybierz napęd...</option>

                        {carParameters.napedy.map((naped) => (
                            <option key={naped.id} value={naped.id}>
                                {naped.nazwa}
                            </option>
                        ))}
                    </select>

                    <select
                        className="form-select form-select-sm"
                        defaultValue={getDefault(carParameters.skrzynie)}
                        disabled={disableIfSingle(carParameters.skrzynie)}
                    >
                        <option value="">Wybierz skrzynię...</option>

                        {carParameters.skrzynie.map((skrzynia) => (
                            <option key={skrzynia.id} value={skrzynia.id}>
                                {skrzynia.nazwa}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        );
    }

    function openCarList() {
        return (
            <div className="mt-3">
                <div className="row g-2 mb-3">
                    <div className="col-md-4">
                        <select
                            className="form-select form-select-sm"
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
                    </div>

                    <div className="col-md-8">
                        <input
                            type="text"
                            placeholder="Wyszukaj model..."
                            className="form-control form-control-sm"
                            id="car-search-input"
                            value={inpCarName}
                            onChange={(e) => setInpCarName(e.target.value)}
                        />
                    </div>
                </div>

                <div className="row g-3">
                    {carList.map((car) => {
                        return (
                            <div className="col-12 col-md-6 col-lg-4" key={`${car.marka}-${car.model}`}>
                                <div
                                    className="card h-100 shadow-sm border-0 position-relative overflow-hidden"
                                    onClick={() => fetchCarParams(car.id)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <img
                                        src={`/${car.sciezka}`}
                                        alt={`${car.marka} ${car.model}`}
                                        className="card-img-top"
                                        style={{
                                            height: "160px",
                                            objectFit: "cover",
                                        }}
                                    />

                                    <div className="card-body text-start">
                                        <div className="text-muted small">
                                            {car.marka}
                                        </div>

                                        <div className="fs-5 fw-semibold">
                                            {car.model}
                                        </div>
                                    </div>

                                    {renderFiltersOnCard(car)}
                                </div>
                            </div>
                        );
                    })}
                </div>
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

                                <th style={{ minWidth: "600px" }}>
                                    <button
                                        type="button"
                                        className="w-100 h-100 border-0 bg-transparent"
                                        style={{ padding: "16px" }}
                                        onClick={() => setShowCarList((prev) => !prev)}
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