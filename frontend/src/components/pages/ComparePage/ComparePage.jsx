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

    const [filters, setFilters] = useState({
        generation: "",
        year: "",
        engine: "",
        body: "",
        drive: "",
        gearbox: "",
    });

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

        const data = await response.json();

        setSelectedCarId(id);
        setCarParameters(data);

        setFilters({
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

        setFilters({
            generation: "",
            year: "",
            engine: "",
            body: "",
            drive: "",
            gearbox: "",
        });
    }

    function ChangeFilter(name, value) {
        setFilters({
            ...filters,
            [name]: value,
        });
    }

    function GetFilteredConfigurations(configurations, skipFilter) {
        if (!configurations) {
            return [];
        }

        return configurations.filter((config) => {
            if (skipFilter !== "generation" && filters.generation !== "") {
                if (config.generacja_id != filters.generation) {
                    return false;
                }
            }

            if (skipFilter !== "year" && filters.year !== "") {
                if (!(Number(config.rok_od) <= Number(filters.year) && Number(config.rok_do) >= Number(filters.year))) {
                    return false;
                }
            }

            if (skipFilter !== "engine" && filters.engine !== "") {
                if (config.silnik_id != filters.engine) {
                    return false;
                }
            }

            if (skipFilter !== "body" && filters.body !== "") {
                if (config.nadwozie_id != filters.body) {
                    return false;
                }
            }

            if (skipFilter !== "drive" && filters.drive !== "") {
                if (config.naped_id != filters.drive) {
                    return false;
                }
            }

            if (skipFilter !== "gearbox" && filters.gearbox !== "") {
                if (config.skrzynia_id != filters.gearbox) {
                    return false;
                }
            }

            return true;
        });
    }

    function GetGenerations(configurations) {
        let filteredConfigurations = GetFilteredConfigurations(configurations, "generation");
        let generations = [];

        filteredConfigurations.forEach((config) => {
            let alreadyExists = false;

            generations.forEach((generation) => {
                if (generation.id == config.generacja_id) {
                    alreadyExists = true;
                }
            });

            if (alreadyExists == false) {
                generations.push({
                    id: config.generacja_id,
                    name: config.generacja,
                });
            }
        });

        return generations;
    }

    function GetYears(configurations) {
        let filteredConfigurations = GetFilteredConfigurations(configurations, "year");
        let years = [];

        filteredConfigurations.forEach((config) => {
            for (let year = Number(config.rok_od); year <= Number(config.rok_do); year++) {
                if (!years.includes(year)) {
                    years.push(year);
                }
            }
        });

        return years.sort();
    }

    function GetEngines(configurations) {
        let filteredConfigurations = GetFilteredConfigurations(configurations, "engine");
        let engines = [];

        filteredConfigurations.forEach((config) => {
            let alreadyExists = false;

            engines.forEach((engine) => {
                if (engine.id == config.silnik_id) {
                    alreadyExists = true;
                }
            });

            if (alreadyExists == false) {
                engines.push({
                    id: config.silnik_id,
                    kod: config.silnik_kod,
                    nazwa: config.silnik_nazwa,
                    pojemnosc: config.pojemnosc_cm3,
                });
            }
        });

        return engines;
    }

    function GetBodies(configurations) {
        let filteredConfigurations = GetFilteredConfigurations(configurations, "body");
        let bodies = [];

        filteredConfigurations.forEach((config) => {
            let alreadyExists = false;

            bodies.forEach((body) => {
                if (body.id == config.nadwozie_id) {
                    alreadyExists = true;
                }
            });

            if (alreadyExists == false) {
                bodies.push({
                    id: config.nadwozie_id,
                    name: config.nadwozie,
                });
            }
        });

        return bodies;
    }

    function GetDrives(configurations) {
        let filteredConfigurations = GetFilteredConfigurations(configurations, "drive");
        let drives = [];

        filteredConfigurations.forEach((config) => {
            let alreadyExists = false;

            drives.forEach((drive) => {
                if (drive.id == config.naped_id) {
                    alreadyExists = true;
                }
            });

            if (alreadyExists == false) {
                drives.push({
                    id: config.naped_id,
                    name: config.naped,
                });
            }
        });

        return drives;
    }

    function GetGearboxes(configurations) {
        let filteredConfigurations = GetFilteredConfigurations(configurations, "gearbox");
        let gearboxes = [];

        filteredConfigurations.forEach((config) => {
            let alreadyExists = false;

            gearboxes.forEach((gearbox) => {
                if (gearbox.id == config.skrzynia_id) {
                    alreadyExists = true;
                }
            });

            if (alreadyExists == false) {
                gearboxes.push({
                    id: config.skrzynia_id,
                    name: config.skrzynia,
                });
            }
        });

        return gearboxes;
    }

    function renderFiltersOnCard(car) {
        if (selectedCarId !== car.id) {
            return null;
        }

        if (!carParameters.konfiguracje) {
            return null;
        }

        let generations = GetGenerations(carParameters.konfiguracje);
        let years = GetYears(carParameters.konfiguracje);
        let engines = GetEngines(carParameters.konfiguracje);
        let bodies = GetBodies(carParameters.konfiguracje);
        let drives = GetDrives(carParameters.konfiguracje);
        let gearboxes = GetGearboxes(carParameters.konfiguracje);

        return (
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 rounded-3 p-3 overflow-auto">
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

                    <select
                        className="form-select form-select-sm mb-2"
                        value={filters.generation}
                        onChange={(e) => ChangeFilter("generation", e.target.value)}
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
                        value={filters.year}
                        onChange={(e) => ChangeFilter("year", e.target.value)}
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
                        value={filters.engine}
                        onChange={(e) => ChangeFilter("engine", e.target.value)}
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
                        value={filters.body}
                        onChange={(e) => ChangeFilter("body", e.target.value)}
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
                        value={filters.drive}
                        onChange={(e) => ChangeFilter("drive", e.target.value)}
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
                        value={filters.gearbox}
                        onChange={(e) => ChangeFilter("gearbox", e.target.value)}
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
                    >
                        Dodaj do porównania
                    </button>
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