// src/components/pages/ComparePage/ComparePage.jsx
import Navbar from "../../universal/Navbar.jsx";

const MAX_SLOTS = 9;

export default function ComparePage() {
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
                                                Slot 1 z {MAX_SLOTS}
                                            </div>
                                        </div>
                                    </button>
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