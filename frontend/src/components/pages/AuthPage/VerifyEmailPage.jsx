import { useEffect, useRef, useState } from "react";
import "./AuthPage.css";

export default function VerifyEmailPage() {
    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("Potwierdzanie adresu email...");
    const alreadyVerified = useRef(false);

    useEffect(() => {
        if (alreadyVerified.current === true) {
            return;
        }

        alreadyVerified.current = true;

        async function verify() {
            const params = new URLSearchParams(window.location.search);
            const token = params.get("token");

            if (!token) {
                setStatus("error");
                setMessage("Brak tokenu potwierdzającego.");
                return;
            }

            try {
                const res = await fetch(
                    "http://localhost/AutoVerseProjekt/backend/verify-email.php?token=" +
                    encodeURIComponent(token)
                );

                const data = await res.json();

                if (data.success) {
                    setStatus("success");
                    setMessage("Konto zostało potwierdzone. Możesz teraz się zalogować.");
                } else {
                    setStatus("error");
                    setMessage(data.message || "Nie udało się potwierdzić konta.");
                }
            } catch (error) {
                setStatus("error");
                setMessage("Wystąpił błąd podczas potwierdzania konta.");
            }
        }

        verify();
    }, []);

    const isSuccess = status === "success";
    const isError = status === "error";

    return (
        <div className="auth-page">
            <div className="auth-result-card">
                {status === "loading" && (
                    <div className="auth-result-icon auth-result-icon-info">
                        ...
                    </div>
                )}

                {isSuccess && (
                    <div className="auth-result-icon auth-result-icon-success">
                        ✓
                    </div>
                )}

                {isError && (
                    <div className="auth-result-icon auth-result-icon-error">
                        ✕
                    </div>
                )}

                <h1 className="auth-logo">
                    Auto<span>Verse</span>
                </h1>

                <h2 className="auth-result-title">
                    {status === "loading" && "Potwierdzanie konta"}
                    {isSuccess && "Konto potwierdzone"}
                    {isError && "Nie udało się potwierdzić konta"}
                </h2>

                <p className="auth-result-text">
                    {message}
                </p>

                {isSuccess && (
                    <p className="auth-result-hint">
                        Możesz przejść do logowania i korzystać z funkcji AutoVerse.
                    </p>
                )}

                {isError && (
                    <p className="auth-result-hint">
                        Link mógł wygasnąć, zostać użyty wcześniej albo token jest nieprawidłowy.
                        Spróbuj zarejestrować konto ponownie.
                    </p>
                )}

                {(isSuccess || isError) && (
                    <a href="/login" className="auth-result-button">
                        Przejdź do logowania
                    </a>
                )}
            </div>
        </div>
    );
}