// src/components/pages/ComparePage/ComparePage.jsx
import React, { useState } from "react";
import Navbar from "../../universal/Navbar.jsx";

// Tymczasowe dane – później podmienisz na swoje z bazy / API
const mockCars = [
    {
        id: 1,
        brand: "BMW",
        model: "M2",
        generation: "F87",
        yearFrom: 2016,
        yearTo: 2018,
        engine: "3.0 R6 turbo",
        powerHp: 370,
        torqueNm: 465,
        drive: "RWD",
        gearbox: "Manual",
        body: "Coupe",
        fuel: "Benzyna",
        driveOptions: ["RWD"],
        gearboxOptions: ["Manual", "Automat"],
        bodyOptions: ["Coupe"],
        engineOptions: ["3.0 R6 turbo 370 KM", "3.0 R6 turbo 400 KM (stage 1)"],
        fuelOptions: ["Benzyna"],
        imageUrl: "https://via.placeholder.com/400x200?text=BMW+M2+F87",
    },
    {
        id: 2,
        brand: "BMW",
        model: "M2 Competition",
        generation: "F87",
        yearFrom: 2018,
        yearTo: 2020,
        engine: "3.0 R6 twin-turbo",
        powerHp: 410,
        torqueNm: 550,
        drive: "RWD",
        gearbox: "DCT",
        body: "Coupe",
        fuel: "Benzyna",
        driveOptions: ["RWD"],
        gearboxOptions: ["DCT", "Manual"],
        bodyOptions: ["Coupe"],
        engineOptions: ["3.0 R6 twin-turbo 410 KM", "3.0 R6 twin-turbo 450 KM (stage 1)"],
        fuelOptions: ["Benzyna"],
        imageUrl: "https://via.placeholder.com/400x200?text=BMW+M2+Competition",
    },
    {
        id: 3,
        brand: "Toyota",
        model: "GR Yaris",
        generation: "XP21",
        yearFrom: 2020,
        yearTo: 2024,
        engine: "1.6 R3 turbo",
        powerHp: 261,
        torqueNm: 360,
        drive: "AWD",
        gearbox: "Manual",
        body: "Hatchback",
        fuel: "Benzyna",
        driveOptions: ["AWD"],
        gearboxOptions: ["Manual"],
        bodyOptions: ["Hatchback"],
        engineOptions: ["1.6 R3 turbo 261 KM", "1.6 R3 turbo 280 KM (tuning)"],
        fuelOptions: ["Benzyna"],
        imageUrl: "https://via.placeholder.com/400x200?text=Toyota+GR+Yaris",
    },
    {
        id: 4,
        brand: "Subaru",
        model: "WRX STI",
        generation: "VA",
        yearFrom: 2014,
        yearTo: 2020,
        engine: "2.5 B4 turbo",
        powerHp: 300,
        torqueNm: 407,
        drive: "AWD",
        gearbox: "Manual",
        body: "Sedan",
        fuel: "Benzyna",
        driveOptions: ["AWD"],
        gearboxOptions: ["Manual"],
        bodyOptions: ["Sedan"],
        engineOptions: ["2.5 B4 turbo 300 KM"],
        fuelOptions: ["Benzyna"],
        imageUrl: "https://via.placeholder.com/400x200?text=Subaru+WRX+STI",
    },
];

const MAX_SLOTS = 9;

export default function ComparePage() {
    // 9 slotów na samochody (null = pusty slot z +)
    const [slots, setSlots] = useState(
        Array.from({ length: MAX_SLOTS }, function () {
            return null;
        })
    );

    // Ile slotów jest aktualnie widocznych (start: 1, max: 9)
    const [visibleSlots, setVisibleSlots] = useState(1);

    // Który slot edytujemy (po kliknięciu w +)
    const [activeSlotIndex, setActiveSlotIndex] = useState(null);

    // Który samochód jest rozwinięty w modalu
    const [expandedCarId, setExpandedCarId] = useState(null);

    // Tekst wyszukiwania w modalu
    const [searchQuery, setSearchQuery] = useState("");

    // Konfiguracja aktualnie rozwiniętego samochodu w modalu
    const [config, setConfig] = useState({
        drive: "",
        gearbox: "",
        body: "",
        engine: "",
        fuel: "",
    });

    const usedIds = slots
        .filter(function (slot) {
            return slot !== null;
        })
        .map(function (slot) {
            return slot.id;
        });

    function handleOpenSlot(index) {
        setActiveSlotIndex(index);
        setSearchQuery("");
        setExpandedCarId(null);
    }

    function handleSelectCar(carWithConfig) {
        if (activeSlotIndex === null) {
            return;
        }

        setSlots(function (prev) {
            const copy = prev.slice();
            copy[activeSlotIndex] = carWithConfig;
            return copy;
        });

        // jeśli to był ostatni widoczny slot i nie osiągnęliśmy jeszcze 9,
        // odsłoń kolejny slot
        setVisibleSlots(function (prevCount) {
            if (activeSlotIndex === prevCount - 1 && prevCount < MAX_SLOTS) {
                return prevCount + 1;
            }
            return prevCount;
        });

        setActiveSlotIndex(null);
        setExpandedCarId(null);
    }

    function handleRemoveCar(index) {
        setSlots(function (prev) {
            const copy = prev.slice();
            copy[index] = null;
            return copy;
        });
        // na razie nie zmniejszamy visibleSlots – użytkownik dalej może wypełnić puste miejsce
    }

    function handleCloseModal() {
        setActiveSlotIndex(null);
        setExpandedCarId(null);
    }

    function handleSearchChange(event) {
        setSearchQuery(event.target.value);
    }

    function handleExpandCar(car) {
        if (expandedCarId === car.id) {
            setExpandedCarId(null);
            return;
        }

        setExpandedCarId(car.id);
        setConfig({
            drive: (car.driveOptions && car.driveOptions[0]) || car.drive || "",
            gearbox:
                (car.gearboxOptions && car.gearboxOptions[0]) || car.gearbox || "",
            body: (car.bodyOptions && car.bodyOptions[0]) || car.body || "",
            engine:
                (car.engineOptions && car.engineOptions[0]) || car.engine || "",
            fuel: (car.fuelOptions && car.fuelOptions[0]) || car.fuel || "",
        });
    }

    function handleConfigChange(field, value) {
        setConfig(function (prev) {
            return {
                ...prev,
                [field]: value,
            };
        });
    }

    function handleAddConfiguredCar(car) {
        const configuredCar = {
            ...car,
            drive: config.drive || car.drive,
            gearbox: config.gearbox || car.gearbox,
            body: config.body || car.body,
            engine: config.engine || car.engine,
            fuel: config.fuel || car.fuel,
        };

        handleSelectCar(configuredCar);
    }

    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filteredCars = mockCars.filter(function (car) {
        if (normalizedQuery === "") {
            return true;
        }

        const text =
            (car.brand || "") +
            " " +
            (car.model || "") +
            " " +
            (car.generation || "") +
            " " +
            (car.body || "") +
            " " +
            (car.engine || "");

        return text.toLowerCase().indexOf(normalizedQuery) !== -1;
    });

    const hasAnyCar = slots.some(function (slot) {
        return slot !== null;
    });

    // Helper do iteracji tylko po widocznych slotach
    function renderForVisibleSlots(callback) {
        return Array.from({ length: visibleSlots }, function (_, index) {
            const slot = slots[index];
            return callback(slot, index);
        });
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
                            Zaczynasz od jednego auta. Po wybraniu pojawia się kolejny slot –
                            maksymalnie <strong>{MAX_SLOTS} aut</strong>.
                        </p>
                    </div>
                </div>

                {/* TABELA SLOTÓW – tylko widoczne sloty */}
                <div className="table-responsive mb-4">
                    <table className="table table-bordered align-middle text-center">
                        <thead className="table-light">
                        <tr>
                            <th style={{ width: "160px" }}>Parametr</th>
                            {renderForVisibleSlots(function (slot, index) {
                                const key = "slot-header-" + index;

                                if (!slot) {
                                    return (
                                        <th key={key} style={{ minWidth: "220px" }}>
                                            <button
                                                type="button"
                                                className="w-100 h-100 border-0 bg-transparent"
                                                onClick={function () {
                                                    handleOpenSlot(index);
                                                }}
                                                style={{ padding: "16px" }}
                                            >
                                                <div className="border rounded-3 p-3 h-100 d-flex flex-column justify-content-center">
                                                    <div
                                                        style={{
                                                            fontSize: "32px",
                                                            lineHeight: "1",
                                                        }}
                                                    >
                                                        +
                                                    </div>
                                                    <div className="mt-2 fw-semibold">
                                                        Dodaj samochód
                                                    </div>
                                                    <div className="small text-muted">
                                                        Slot {index + 1} z {MAX_SLOTS}
                                                    </div>
                                                </div>
                                            </button>
                                        </th>
                                    );
                                }

                                return (
                                    <th key={key} style={{ minWidth: "220px" }}>
                                        <div className="border rounded-3 p-2 h-100 d-flex flex-column justify-content-between">
                                            <div>
                                                <div className="fw-bold">
                                                    {slot.brand} {slot.model}
                                                </div>
                                                <div className="small text-muted">
                                                    {slot.generation || "-"}
                                                </div>
                                                <div className="small text-muted">
                                                    {slot.yearFrom}–{slot.yearTo}
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger mt-2"
                                                onClick={function () {
                                                    handleRemoveCar(index);
                                                }}
                                            >
                                                Usuń z porównania
                                            </button>
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                        </thead>

                        <tbody>
                        <tr>
                            <th scope="row">Marka</th>
                            {renderForVisibleSlots(function (slot, index) {
                                const key = "row-brand-" + index;
                                return <td key={key}>{slot ? slot.brand : "—"}</td>;
                            })}
                        </tr>

                        <tr>
                            <th scope="row">Model</th>
                            {renderForVisibleSlots(function (slot, index) {
                                const key = "row-model-" + index;
                                return <td key={key}>{slot ? slot.model : "—"}</td>;
                            })}
                        </tr>

                        <tr>
                            <th scope="row">Generacja</th>
                            {renderForVisibleSlots(function (slot, index) {
                                const key = "row-gen-" + index;
                                return <td key={key}>{slot ? slot.generation || "—" : "—"}</td>;
                            })}
                        </tr>

                        <tr>
                            <th scope="row">Lata produkcji</th>
                            {renderForVisibleSlots(function (slot, index) {
                                const key = "row-years-" + index;
                                return (
                                    <td key={key}>
                                        {slot ? slot.yearFrom + "–" + slot.yearTo : "—"}
                                    </td>
                                );
                            })}
                        </tr>

                        <tr>
                            <th scope="row">Silnik</th>
                            {renderForVisibleSlots(function (slot, index) {
                                const key = "row-engine-" + index;
                                return <td key={key}>{slot ? slot.engine : "—"}</td>;
                            })}
                        </tr>

                        <tr>
                            <th scope="row">Moc [KM]</th>
                            {renderForVisibleSlots(function (slot, index) {
                                const key = "row-power-" + index;
                                return <td key={key}>{slot ? slot.powerHp : "—"}</td>;
                            })}
                        </tr>

                        <tr>
                            <th scope="row">Moment [Nm]</th>
                            {renderForVisibleSlots(function (slot, index) {
                                const key = "row-torque-" + index;
                                return <td key={key}>{slot ? slot.torqueNm : "—"}</td>;
                            })}
                        </tr>

                        <tr>
                            <th scope="row">Nadwozie</th>
                            {renderForVisibleSlots(function (slot, index) {
                                const key = "row-body-" + index;
                                return <td key={key}>{slot ? slot.body : "—"}</td>;
                            })}
                        </tr>

                        <tr>
                            <th scope="row">Napęd</th>
                            {renderForVisibleSlots(function (slot, index) {
                                const key = "row-drive-" + index;
                                return <td key={key}>{slot ? slot.drive : "—"}</td>;
                            })}
                        </tr>

                        <tr>
                            <th scope="row">Skrzynia</th>
                            {renderForVisibleSlots(function (slot, index) {
                                const key = "row-gearbox-" + index;
                                return <td key={key}>{slot ? slot.gearbox : "—"}</td>;
                            })}
                        </tr>

                        <tr>
                            <th scope="row">Paliwo</th>
                            {renderForVisibleSlots(function (slot, index) {
                                const key = "row-fuel-" + index;
                                return <td key={key}>{slot ? slot.fuel : "—"}</td>;
                            })}
                        </tr>
                        </tbody>
                    </table>
                </div>

                {!hasAnyCar && activeSlotIndex === null && (
                    <p className="text-muted small mt-2">
                        Wybierz pierwszy samochód klikając w kafelek z „+ Dodaj samochód”.
                    </p>
                )}
            </div>

            {/* MODAL NAD TABELĄ */}
            {activeSlotIndex !== null && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100"
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 1050,
                    }}
                >
                    <div className="d-flex align-items-center justify-content-center h-100">
                        <div className="card shadow-lg" style={{ maxWidth: "1100px", width: "95%" }}>
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">
                                    Wybierz samochód dla slotu {activeSlotIndex + 1}
                                </h5>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={handleCloseModal}
                                >
                                    X
                                </button>
                            </div>

                            <div className="card-body">
                                <div className="input-group mb-3">
                                    <span className="input-group-text">🔍</span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Wyszukaj po marce, modelu, generacji..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                    />
                                </div>

                                <p className="text-muted small mb-3">
                                    Lista jest tymczasowa (mock). Później podłączymy Twoją bazę danych / API.
                                </p>

                                <div className="row gy-3">
                                    {filteredCars.map(function (car) {
                                        const alreadyUsed = usedIds.includes(car.id);
                                        const key = "picker-" + car.id;
                                        const isExpanded = expandedCarId === car.id;

                                        return (
                                            <div className="col-md-6 col-lg-4" key={key}>
                                                <div className="border rounded-3 p-3 h-100 d-flex flex-column">
                                                    <div>
                                                        <div className="fw-semibold">
                                                            {car.brand} {car.model}
                                                        </div>
                                                        <div className="small text-muted">
                                                            {car.generation || "-"} • {car.body}
                                                        </div>
                                                        <div className="small text-muted mb-1">
                                                            {car.yearFrom}–{car.yearTo} • {car.engine}
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-orange mt-2 w-100"
                                                        onClick={function () {
                                                            handleExpandCar(car);
                                                        }}
                                                    >
                                                        {isExpanded ? "Zwiń" : "Rozwiń"}
                                                    </button>

                                                    {isExpanded && (
                                                        <div className="mt-3">
                                                            {car.imageUrl && (
                                                                <div className="mb-2">
                                                                    <img
                                                                        src={car.imageUrl}
                                                                        alt={car.brand + " " + car.model}
                                                                        className="img-fluid rounded"
                                                                    />
                                                                </div>
                                                            )}

                                                            <div className="mb-2 small text-muted">
                                                                <div>Moc: {car.powerHp} KM</div>
                                                                <div>Moment: {car.torqueNm} Nm</div>
                                                                <div>
                                                                    Lata produkcji: {car.yearFrom}–{car.yearTo}
                                                                </div>
                                                            </div>

                                                            <div className="mb-2">
                                                                <label className="form-label form-label-sm mb-1">
                                                                    Napęd
                                                                </label>
                                                                <select
                                                                    className="form-select form-select-sm"
                                                                    value={config.drive}
                                                                    onChange={function (e) {
                                                                        handleConfigChange("drive", e.target.value);
                                                                    }}
                                                                >
                                                                    {(car.driveOptions || [car.drive]).map(function (
                                                                        option
                                                                    ) {
                                                                        return (
                                                                            <option
                                                                                key={car.id + "-drive-" + option}
                                                                                value={option}
                                                                            >
                                                                                {option}
                                                                            </option>
                                                                        );
                                                                    })}
                                                                </select>
                                                            </div>

                                                            <div className="mb-2">
                                                                <label className="form-label form-label-sm mb-1">
                                                                    Skrzynia
                                                                </label>
                                                                <select
                                                                    className="form-select form-select-sm"
                                                                    value={config.gearbox}
                                                                    onChange={function (e) {
                                                                        handleConfigChange("gearbox", e.target.value);
                                                                    }}
                                                                >
                                                                    {(car.gearboxOptions || [car.gearbox]).map(
                                                                        function (option) {
                                                                            return (
                                                                                <option
                                                                                    key={car.id + "-gearbox-" + option}
                                                                                    value={option}
                                                                                >
                                                                                    {option}
                                                                                </option>
                                                                            );
                                                                        }
                                                                    )}
                                                                </select>
                                                            </div>

                                                            <div className="mb-2">
                                                                <label className="form-label form-label-sm mb-1">
                                                                    Nadwozie
                                                                </label>
                                                                <select
                                                                    className="form-select form-select-sm"
                                                                    value={config.body}
                                                                    onChange={function (e) {
                                                                        handleConfigChange("body", e.target.value);
                                                                    }}
                                                                >
                                                                    {(car.bodyOptions || [car.body]).map(function (
                                                                        option
                                                                    ) {
                                                                        return (
                                                                            <option
                                                                                key={car.id + "-body-" + option}
                                                                                value={option}
                                                                            >
                                                                                {option}
                                                                            </option>
                                                                        );
                                                                    })}
                                                                </select>
                                                            </div>

                                                            <div className="mb-2">
                                                                <label className="form-label form-label-sm mb-1">
                                                                    Silnik
                                                                </label>
                                                                <select
                                                                    className="form-select form-select-sm"
                                                                    value={config.engine}
                                                                    onChange={function (e) {
                                                                        handleConfigChange("engine", e.target.value);
                                                                    }}
                                                                >
                                                                    {(car.engineOptions || [car.engine]).map(function (
                                                                        option
                                                                    ) {
                                                                        return (
                                                                            <option
                                                                                key={car.id + "-engine-" + option}
                                                                                value={option}
                                                                            >
                                                                                {option}
                                                                            </option>
                                                                        );
                                                                    })}
                                                                </select>
                                                            </div>

                                                            <div className="mb-3">
                                                                <label className="form-label form-label-sm mb-1">
                                                                    Rodzaj paliwa
                                                                </label>
                                                                <select
                                                                    className="form-select form-select-sm"
                                                                    value={config.fuel}
                                                                    onChange={function (e) {
                                                                        handleConfigChange("fuel", e.target.value);
                                                                    }}
                                                                >
                                                                    {(car.fuelOptions || [car.fuel]).map(function (
                                                                        option
                                                                    ) {
                                                                        return (
                                                                            <option
                                                                                key={car.id + "-fuel-" + option}
                                                                                value={option}
                                                                            >
                                                                                {option}
                                                                            </option>
                                                                        );
                                                                    })}
                                                                </select>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-primary w-100"
                                                                disabled={alreadyUsed}
                                                                onClick={function () {
                                                                    handleAddConfiguredCar(car);
                                                                }}
                                                            >
                                                                {alreadyUsed
                                                                    ? "Ten samochód jest już w porównaniu"
                                                                    : "Dodaj do porównania"}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {filteredCars.length === 0 && (
                                        <div className="col-12">
                                            <p className="text-muted mb-0">
                                                Brak wyników dla podanego filtrowania.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
