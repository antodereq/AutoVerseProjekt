import { useEffect, useState } from "react";
import Navbar from "../../universal/Navbar.jsx";
import "./ClientPage.css";

export default function ClientPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comparisons, setComparisons] = useState([]);

    useEffect(() => {
        async function checkSession() {
            try {
                const res = await fetch(
                    "http://localhost/AutoVerseProjekt/backend/me.php",
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                const data = await res.json();

                if (!data.loggedIn) {
                    window.location.href = "/login";
                    return;
                }

                setUser(data.user);

                const comparisonsRes = await fetch(
                    "http://localhost/AutoVerseProjekt/backend/getUserComparisons.php",
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                const comparisonsData = await comparisonsRes.json();

                if (comparisonsData.success) {
                    setComparisons(comparisonsData.comparisons);
                }
            } catch (error) {
                window.location.href = "/login";
            } finally {
                setLoading(false);
            }
        }

        checkSession();
    }, []);

    function formatDate(dateText) {
        if (!dateText) {
            return "Brak danych";
        }

        return dateText;
    }

    if (loading) {
        return (
            <div className="client-page">
                <Navbar />
                <div className="client-loading">Ładowanie panelu użytkownika...</div>
            </div>
        );
    }

    return (
        <div className="client-page">
            <Navbar />

            <main className="client-container">
                <section className="client-hero">
                    <div>
                        <h1>
                            Dobrze Cię widzieć, <span>{user?.login}!</span>
                        </h1>

                        <p>
                            Tutaj znajdziesz swoje zapisane porównania samochodów.
                        </p>
                    </div>

                    <button
                        className="client-main-btn"
                        onClick={() => {
                            window.location.href = "/ComparePage";
                        }}
                    >
                        + Nowe porównanie
                    </button>
                </section>

                <section className="client-comparisons-panel">
                    <div className="client-comparisons-header">
                        <div>
                            <h2>Twoje porównania</h2>
                            <p>
                                Zapisane zestawienia konfiguracji samochodów dostępne na Twoim koncie.
                            </p>
                        </div>

                        <div className="client-comparisons-counter">
                            <span>Liczba porównań</span>
                            <strong>{comparisons.length}</strong>
                        </div>
                    </div>

                    {comparisons.length === 0 ? (
                        <div className="client-empty-comparisons">
                            <div className="client-empty-icon">＋</div>

                            <h3>Nie masz jeszcze zapisanych porównań</h3>

                            <p>
                                Przejdź do porównywarki, wybierz samochody i kliknij
                                „Zapisz to porównanie”.
                            </p>

                            <button
                                className="client-main-btn"
                                onClick={() => {
                                    window.location.href = "/ComparePage";
                                }}
                            >
                                Przejdź do porównywarki
                            </button>
                        </div>
                    ) : (
                        <div className="client-comparisons-list">
                            {comparisons.map((comparison) => {
                                return (
                                    <div
                                        className="client-comparison-card"
                                        key={comparison.id}
                                    >
                                        <div className="client-comparison-main">
                                            <div className="client-comparison-icon">
                                                ⇄
                                            </div>

                                            <div>
                                                <h3>{comparison.nazwa}</h3>

                                                <p>
                                                    {comparison.opis
                                                        ? comparison.opis
                                                        : "Zapisane porównanie samochodów"}
                                                </p>

                                                <div className="client-comparison-meta">
                                                    <span>
                                                        {comparison.liczba_aut} aut
                                                    </span>

                                                    <span>
                                                        Utworzono:{" "}
                                                        {formatDate(comparison.data_utworzenia)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="client-comparison-actions">
                                            <a
                                                className="client-open-comparison"
                                                href={`/comparison/${comparison.id}`}
                                            >
                                                Otwórz porównanie
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}