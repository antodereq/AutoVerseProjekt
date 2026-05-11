import React, { useState } from "react";

export default function RecommendForm({ onRecommend, filters }) {
    filters = filters || {};
    const [budgetMin, setBudgetMin] = useState("");
    const [budgetMax, setBudgetMax] = useState("");
    const [usageType, setUsageType] = useState("");
    const [bodyTypes, setBodyTypes] = useState([]);
    const [transmission, setTransmission] = useState("any");

    // NOWE — checkboxy zamiast selecta
    const [driveTypes, setDriveTypes] = useState([]);
    const [countries, setCountries] = useState([]);

    const [fuelType, setFuelType] = useState("any");
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [engineLayout, setEngineLayout] = useState("");
    const [engineCapacityMin, setEngineCapacityMin] = useState("");
    const [engineCapacityMax, setEngineCapacityMax] = useState("");
    const [powerMin, setPowerMin] = useState("");
    const [powerMax, setPowerMax] = useState("");
    const [avgConsumptionMax, setAvgConsumptionMax] = useState("");
    const [yearFrom, setYearFrom] = useState("");
    const [yearTo, setYearTo] = useState("");

    const brandOptions = filters.brands || [];
    const modelOptions = filters.models || [];
    const bodyTypeOptions = filters.bodyTypes || [];
    const transmissionOptions = filters.transmissions || [];
    const driveTypeOptions = (filters.driveTypes || []).map((value) => ({
        value,
        label: value.toUpperCase()
    }));
    const fuelTypeOptions = filters.fuelTypes || [];
    const engineLayoutOptions = filters.engineLayouts || [];
    const countryOptions = filters.countries || [];

    function toggleInArray(currentArray, value) {
        if (currentArray.includes(value)) {
            return currentArray.filter((v) => v !== value);
        }
        return [...currentArray, value];
    }

    function handleSubmit(e) {
        e.preventDefault();

        const formValues = {
            budgetMin,
            budgetMax,
            usageType,
            bodyTypes,
            transmission,
            driveTypes,
            fuelType,
            brand,
            model,
            engineLayout,
            engineCapacityMin,
            engineCapacityMax,
            powerMin,
            powerMax,
            avgConsumptionMax,
            yearFrom,
            yearTo,
            countries
        };

        if (typeof onRecommend === "function") {
            onRecommend(formValues);
        }
    }

    return (
        <div className="card border-0 shadow-sm recommend-form-card">
            <div className="card-body">
                <h5 className="fw-semibold mb-3">Twoje preferencje</h5>

                <form onSubmit={handleSubmit}>

                    {/* Budżet */}
                    <div className="mb-3">
                        <label className="form-label">Budżet (PLN)</label>
                        <div className="row g-2">
                            <div className="col-6">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Od"
                                    value={budgetMin}
                                    onChange={(e) => setBudgetMin(e.target.value)}
                                />
                            </div>
                            <div className="col-6">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Do"
                                    value={budgetMax}
                                    onChange={(e) => setBudgetMax(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Marka */}
                    <div className="mb-3">
                        <label className="form-label">Marka (opcjonalnie)</label>
                        <select
                            className="form-select"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                        >
                            <option value="">--Obojętnie--</option>
                            {brandOptions.map((brandOption) => (
                                <option key={brandOption} value={brandOption}>
                                    {brandOption}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Model */}
                    <div className="mb-3">
                        <label className="form-label">Model (opcjonalnie)</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="np. Supra, MX-5..."
                            list="model-options"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                        />
                        <datalist id="model-options">
                            {modelOptions.map((item) => (
                                <option key={`${item.brand}-${item.name}`} value={item.name} />
                            ))}
                        </datalist>
                    </div>

                    {/* Nadwozie */}
                    <div className="mb-3">
                        <label className="form-label">Preferowane nadwozie (opcjonalnie)</label>

                        <div className="d-flex flex-wrap gap-2 small">
                            {bodyTypeOptions.map((type) => (
                                <div className="form-check form-check-inline" key={type}>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={bodyTypes.includes(type)}
                                        onChange={() => setBodyTypes(toggleInArray(bodyTypes, type))}
                                        id={"body-" + type}
                                    />
                                    <label className="form-check-label" htmlFor={"body-" + type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skrzynia */}
                    <div className="mb-3">
                        <label className="form-label">Skrzynia biegów</label>
                        <select
                            className="form-select"
                            value={transmission}
                            onChange={(e) => setTransmission(e.target.value)}
                        >
                            <option value="any">Obojętne</option>
                            {transmissionOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* NAPĘD – CHECKBOXY */}
                    <div className="mb-3">
                        <label className="form-label">Napęd (możesz zaznaczyć wiele)</label>

                        <div className="d-flex flex-wrap gap-2 small">
                            {driveTypeOptions.map((opt) => (
                                <div className="form-check form-check-inline" key={opt.value}>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={driveTypes.includes(opt.value)}
                                        onChange={() => setDriveTypes(toggleInArray(driveTypes, opt.value))}
                                        id={"drive-" + opt.value}
                                    />
                                    <label className="form-check-label" htmlFor={"drive-" + opt.value}>
                                        {opt.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rodzaj paliwa */}
                    <div className="mb-3">
                        <label className="form-label">Rodzaj paliwa</label>
                        <select
                            className="form-select"
                            value={fuelType}
                            onChange={(e) => setFuelType(e.target.value)}
                        >
                            <option value="any">Obojętne</option>
                            {fuelTypeOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Architektura silnika */}
                    <div className="mb-3">
                        <label className="form-label">Architektura silnika</label>
                        <select
                            className="form-select"
                            value={engineLayout}
                            onChange={(e) => setEngineLayout(e.target.value)}
                        >
                            <option value="">Obojętnie</option>
                            {engineLayoutOptions.map((layout) => (
                                <option key={layout} value={layout}>
                                    {layout}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Pojemność */}
                    <div className="mb-3">
                        <label className="form-label">Pojemność [cm³]</label>
                        <div className="row g-2">
                            <div className="col-6">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Od"
                                    value={engineCapacityMin}
                                    onChange={(e) => setEngineCapacityMin(e.target.value)}
                                />
                            </div>
                            <div className="col-6">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Do"
                                    value={engineCapacityMax}
                                    onChange={(e) => setEngineCapacityMax(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Moc */}
                    <div className="mb-3">
                        <label className="form-label">Moc [KM]</label>
                        <div className="row g-2">
                            <div className="col-6">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Od"
                                    value={powerMin}
                                    onChange={(e) => setPowerMin(e.target.value)}
                                />
                            </div>
                            <div className="col-6">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Do"
                                    value={powerMax}
                                    onChange={(e) => setPowerMax(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Spalanie */}
                    <div className="mb-3">
                        <label className="form-label">Maksymalne średnie spalanie [l/100km]</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="np. 8.5"
                            value={avgConsumptionMax}
                            onChange={(e) => setAvgConsumptionMax(e.target.value)}
                        />
                    </div>

                    {/* Roczniki */}
                    <div className="mb-3">
                        <label className="form-label">Rocznik (zakres)</label>
                        <div className="row g-2">
                            <div className="col-6">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Od"
                                    value={yearFrom}
                                    onChange={(e) => setYearFrom(e.target.value)}
                                />
                            </div>
                            <div className="col-6">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Do"
                                    value={yearTo}
                                    onChange={(e) => setYearTo(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* KRAJ – CHECKBOXY */}
                    <div className="mb-4">
                        <label className="form-label">Kraj pochodzenia (możesz zaznaczyć wiele)</label>

                        <div className="d-flex flex-wrap gap-2 small">
                            {countryOptions.map((country) => (
                                <div className="form-check form-check-inline" key={country}>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={countries.includes(country)}
                                        onChange={() => setCountries(toggleInArray(countries, country))}
                                        id={"country-" + country}
                                    />
                                    <label className="form-check-label" htmlFor={"country-" + country}>
                                        {country}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="btn btn-orange w-100">
                        Pokaż propozycje
                    </button>
                </form>
            </div>
        </div>
    );
}
