import { useEffect, useState } from "react";
import Navbar from "../../universal/Navbar.jsx";
import { API_URL } from "../../../config/api";
import "./ComparePage.css";

import {
    ChangeFilter,
    GetGenerations,
    GetYears,
    GetEngines,
    GetBodies,
    GetDrives,
    GetGearboxes,
} from "./ParamsFilters.js";

const MAX_SLOTS = 5;

export default function ComparePage() {
    const [inpCarName, setInpCarName] = useState("");
    const [selectCarBrand, setSelectCarBrand] = useState("");
    const [brands, setBrands] = useState([]);
    const [carList, setCarList] = useState([]);
    const [showCarList, setShowCarList] = useState(false);
    const [selectedCarId, setSelectedCarId] = useState(null);
    const [carParameters, setCarParameters] = useState({});
    const [showDifferences, setShowDifferences] = useState(false);

    const [saveName, setSaveName] = useState("");
    const [saveMessage, setSaveMessage] = useState("");

    const [modelConfig, setModelConfig] = useState({
        generation: "",
        year: "",
        engine: "",
        body: "",
        drive: "",
        gearbox: "",
    });

    const [comparedCars, setComparedCars] = useState([]);
    const [nextCompareID, setNextCompareID] = useState(1);

    const fieldEmpty = inpCarName === "" && selectCarBrand === "";

    const compareRows = [
        { label: "Marka", field: "marka" },
        { label: "Model", field: "model" },
        { label: "Generacja", field: "generacja" },
        { label: "Rocznik", field: "selectedYear" },
        {
            label: "Lata produkcji",
            customClass: getProductionYearsDifferenceClass,
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

        const data = await response.json();

        setSelectedCarId(id);
        setCarParameters(data);

        setModelConfig({
            generation: "",
            year: "",
            engine: "",
            body: "",
            drive: "",
            gearbox: "",
        });
    }

    function closeOverlay() {
        setSelectedCarId(null);
        setCarParameters({});

        setModelConfig({
            generation: "",
            year: "",
            engine: "",
            body: "",
            drive: "",
            gearbox: "",
        });
    }

    function handleChangeFilter(name, value) {
        ChangeFilter(modelConfig, setModelConfig, name, value);
    }

    function AddCarToTable() {
        if (
            modelConfig.body === "" ||
            modelConfig.drive === "" ||
            modelConfig.engine === "" ||
            modelConfig.year === "" ||
            modelConfig.generation === "" ||
            modelConfig.gearbox === ""
        ) {
            return;
        }

        let selectedConfig = carParameters.konfiguracje.find((config) => {
            let sameBody = modelConfig.body == config.nadwozie_id;
            let sameDrive = modelConfig.drive == config.naped_id;
            let sameEngine = modelConfig.engine == config.silnik_id;

            let correctYear =
                Number(modelConfig.year) >= Number(config.rok_od) &&
                Number(modelConfig.year) <= Number(config.rok_do);

            let sameGeneration = modelConfig.generation == config.generacja_id;
            let sameGearbox = modelConfig.gearbox == config.skrzynia_id;

            return (
                sameBody &&
                sameDrive &&
                sameEngine &&
                correctYear &&
                sameGeneration &&
                sameGearbox
            );
        });

        if (!selectedConfig) {
            return;
        }

        let carToCompare = {
            ...selectedConfig,
            compareID: nextCompareID,
            marka: carParameters.marka,
            model: carParameters.model,
            selectedYear: modelConfig.year,
        };

        setComparedCars([...comparedCars, carToCompare]);
        setNextCompareID(nextCompareID + 1);

        closeOverlay();
        setShowCarList(false);
    }

    function RemoveCarFromTable(compareID) {
        setComparedCars(comparedCars.filter((car) => car.compareID !== compareID));
    }

    function getDifferenceClass(fieldName) {
        if (showDifferences === false) {
            return "";
        }

        if (comparedCars.length < 2) {
            return "";
        }

        const firstValue = comparedCars[0][fieldName];
        const isDifferent = comparedCars.some((car) => car[fieldName] !== firstValue);

        if (isDifferent) {
            return "compare-different";
        }

        return "";
    }

    function getProductionYearsDifferenceClass() {
        if (showDifferences === false) {
            return "";
        }

        if (comparedCars.length < 2) {
            return "";
        }

        const firstValue = `${comparedCars[0].rok_od}-${comparedCars[0].rok_do}`;

        const isDifferent = comparedCars.some((car) => {
            return `${car.rok_od}-${car.rok_do}` !== firstValue;
        });

        if (isDifferent) {
            return "compare-different";
        }

        return "";
    }

    function getRowClass(row) {
        if (row.customClass) {
            return row.customClass();
        }

        return getDifferenceClass(row.field);
    }

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

    function rendermodelConfigOnCard(car) {
        if (selectedCarId !== car.id) {
            return null;
        }

        if (!carParameters.konfiguracje) {
            return null;
        }

        let generations = GetGenerations(carParameters.konfiguracje, modelConfig);
        let years = GetYears(carParameters.konfiguracje, modelConfig);
        let engines = GetEngines(carParameters.konfiguracje, modelConfig);
        let bodies = GetBodies(carParameters.konfiguracje, modelConfig);
        let drives = GetDrives(carParameters.konfiguracje, modelConfig);
        let gearboxes = GetGearboxes(carParameters.konfiguracje, modelConfig);

        return (
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 rounded-4 p-3 overflow-auto">
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

                <div className="w-100" onClick={(e) => e.stopPropagation()}>
                    <div className="text-white fw-semibold text-center mb-3 pe-4">
                        {car.marka} {car.model}
                    </div>

                    <select
                        className="form-select form-select-sm mb-2"
                        value={modelConfig.generation}
                        onChange={(e) => handleChangeFilter("generation", e.target.value)}
                    >
                        <option value="">Wybierz generację...</option>

                        {generations.map((generation) => {
                            return (
                                <option key={generation.id} value={generation.id}>
                                    {generation.name}
                                </option>
                            );
                        })}
                    </select>

                    <select
                        className="form-select form-select-sm mb-2"
                        value={modelConfig.year}
                        onChange={(e) => handleChangeFilter("year", e.target.value)}
                    >
                        <option value="">Wybierz rocznik...</option>

                        {years.map((year) => {
                            return (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            );
                        })}
                    </select>

                    <select
                        className="form-select form-select-sm mb-2"
                        value={modelConfig.engine}
                        onChange={(e) => handleChangeFilter("engine", e.target.value)}
                    >
                        <option value="">Wybierz silnik...</option>

                        {engines.map((engine) => {
                            return (
                                <option key={engine.id} value={engine.id}>
                                    {engine.kod} {engine.pojemnosc} cm3
                                </option>
                            );
                        })}
                    </select>

                    <select
                        className="form-select form-select-sm mb-2"
                        value={modelConfig.body}
                        onChange={(e) => handleChangeFilter("body", e.target.value)}
                    >
                        <option value="">Wybierz nadwozie...</option>

                        {bodies.map((body) => {
                            return (
                                <option key={body.id} value={body.id}>
                                    {body.name}
                                </option>
                            );
                        })}
                    </select>

                    <select
                        className="form-select form-select-sm mb-2"
                        value={modelConfig.drive}
                        onChange={(e) => handleChangeFilter("drive", e.target.value)}
                    >
                        <option value="">Wybierz napęd...</option>

                        {drives.map((drive) => {
                            return (
                                <option key={drive.id} value={drive.id}>
                                    {drive.name}
                                </option>
                            );
                        })}
                    </select>

                    <select
                        className="form-select form-select-sm"
                        value={modelConfig.gearbox}
                        onChange={(e) => handleChangeFilter("gearbox", e.target.value)}
                    >
                        <option value="">Wybierz skrzynię...</option>

                        {gearboxes.map((gearbox) => {
                            return (
                                <option key={gearbox.id} value={gearbox.id}>
                                    {gearbox.name}
                                </option>
                            );
                        })}
                    </select>

                    <button
                        type="button"
                        className="btn btn-warning btn-sm w-100 mt-3 fw-semibold"
                        onClick={AddCarToTable}
                    >
                        Dodaj do porównania
                    </button>
                </div>
            </div>
        );
    }

    function openCarList() {
        return (
            <div className="compare-picker-panel mt-3">
                <div className="row g-2 mb-3">
                    <div className="col-12 col-md-4">
                        <select
                            className="form-select"
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

                    <div className="col-12 col-md-8">
                        <input
                            type="text"
                            placeholder="Wyszukaj model..."
                            className="form-control"
                            id="car-search-input"
                            value={inpCarName}
                            onChange={(e) => setInpCarName(e.target.value)}
                        />
                    </div>
                </div>

                <div className="row g-3">
                    {carList.map((car) => {
                        return (
                            <div
                                className="col-12 col-md-6 col-xl-4"
                                key={`${car.marka}-${car.model}`}
                            >
                                <div
                                    className="card h-100 shadow-sm border-0 position-relative overflow-hidden rounded-4 compare-pick-card"
                                    onClick={() => fetchCarParams(car.id)}
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
                                        <div className="text-muted small">{car.marka}</div>
                                        <div className="fs-5 fw-semibold">{car.model}</div>
                                    </div>

                                    {rendermodelConfigOnCard(car)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
    async function SaveComparison() {
        if (comparedCars.length === 0) {
            setSaveMessage("Dodaj przynajmniej jeden samochód do porównania.");
            return;
        }

        if (saveName.trim() === "") {
            setSaveMessage("Podaj nazwę porównania.");
            return;
        }

        const konfiguracjeIds = comparedCars.map((car) => car.konfiguracja_id).filter((id) => id !== undefined && id !== null);

        const payload = {
            nazwa: saveName,
            opis: "",
            konfiguracje: konfiguracjeIds,
        };

        console.log("Wysyłane porównanie:", payload);
        console.log("Porównywane auta:", comparedCars);

        try {
            const response = await fetch(`${API_URL}/saveComparison.php`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const text = await response.text();
            console.log("Odpowiedź backendu jako tekst:", text);

            let data;

            try {
                data = JSON.parse(text);
            } catch (error) {
                setSaveMessage("Backend nie zwrócił poprawnego JSON-a. Sprawdź konsolę.");
                return;
            }

            console.log("Odpowiedź backendu jako JSON:", data);

            if (data.success) {
                setSaveMessage("Porównanie zostało zapisane.");
                setSaveName("");
            } else {
                setSaveMessage(data.message || data.error || "Nie udało się zapisać porównania.");
            }
        } catch (error) {
            console.error("Błąd fetch:", error);
            setSaveMessage("Wystąpił błąd podczas zapisywania porównania.");
        }
    }

    return (
        <div className="bg-light min-vh-100">
            <Navbar />

            <div className="container py-4">
                <div className="compare-hero mb-4">
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

                <div className="compare-toolbar mb-3">
                    <button
                        type="button"
                        className="btn btn-warning fw-semibold"
                        onClick={() => setShowCarList((prev) => !prev)}
                        disabled={comparedCars.length >= MAX_SLOTS}
                    >
                        + Dodaj samochód
                    </button>

                    <div className="compare-count">
                        {comparedCars.length} / {MAX_SLOTS} aut
                    </div>

                    <div className="form-check form-switch m-0 ms-lg-auto">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="showDifferencesSwitch"
                            checked={showDifferences}
                            onChange={(e) => setShowDifferences(e.target.checked)}
                        />

                        <label
                            className="form-check-label fw-semibold"
                            htmlFor="showDifferencesSwitch"
                        >
                            Pokaż różnice
                        </label>
                    </div>
                    <div className="compare-save-box">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Nazwa porównania"
                            value={saveName}
                            onChange={(e) => setSaveName(e.target.value)}
                            disabled={comparedCars.length === 0}
                        />

                        <button
                            type="button"
                            className="btn btn-dark btn-sm fw-semibold"
                            onClick={SaveComparison}
                            disabled={comparedCars.length === 0}
                        >
                            Zapisz to porównanie
                        </button>
                    </div>
                </div>
                {saveMessage && (
                    <div className="alert alert-info py-2 mt-2">
                        {saveMessage}
                    </div>
                )}

                {showCarList && openCarList()}

                {comparedCars.length === 0 ? (
                    <div className="compare-empty-state mt-4">
                        <div className="compare-empty-icon">＋</div>
                        <h4 className="fw-bold mb-2">Dodaj pierwszy samochód</h4>
                        <p className="text-muted mb-3">
                            Po dodaniu aut pojawi się tutaj czytelne porównanie parametrów.
                        </p>

                        <button
                            type="button"
                            className="btn btn-warning fw-semibold"
                            onClick={() => setShowCarList(true)}
                        >
                            Wybierz samochód
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="compare-selected-cars my-4">
                            {comparedCars.map((car) => {
                                return (
                                    <div className="compare-selected-card" key={car.compareID}>
                                        <button
                                            type="button"
                                            className="compare-selected-remove"
                                            onClick={() => RemoveCarFromTable(car.compareID)}
                                        >
                                            ×
                                        </button>

                                        <div className="small text-muted">{car.marka}</div>
                                        <div className="fw-bold">{car.model}</div>
                                        <div className="small text-muted">
                                            {car.generacja} • {car.selectedYear}
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

                                            {comparedCars.map((car) => {
                                                return (
                                                    <th key={car.compareID}>
                                                        <div className="fw-bold">
                                                            {car.marka} {car.model}
                                                        </div>
                                                        <div className="small text-muted">
                                                            {car.selectedYear}
                                                        </div>
                                                    </th>
                                                );
                                            })}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {compareRows.map((row) => {
                                            return (
                                                <tr key={row.label} className={getRowClass(row)}>
                                                    <th scope="row" className="compare-param-col">
                                                        {row.label}
                                                    </th>

                                                    {comparedCars.map((car) => {
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
                                    <div
                                        className={`compare-mobile-row ${getRowClass(row)}`}
                                        key={row.label}
                                    >
                                        <div className="compare-mobile-title">{row.label}</div>

                                        <div className="compare-mobile-values">
                                            {comparedCars.map((car) => {
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