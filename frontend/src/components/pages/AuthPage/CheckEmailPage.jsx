import "./AuthPage.css";

export default function CheckEmailPage() {
    return (
        <div className="auth-page">
            <div className="auth-result-card">
                <div className="auth-result-icon auth-result-icon-info">
                    ✉
                </div>

                <h1 className="auth-logo">
                    Auto<span>Verse</span>
                </h1>

                <h2 className="auth-result-title">
                    Sprawdź swoją skrzynkę
                </h2>

                <p className="auth-result-text">
                    Wysłaliśmy do Ciebie wiadomość
                    z linkiem potwierdzającym. Kliknij link w mailu, aby aktywować konto.
                </p>

                <p className="auth-result-hint">
                    Jeśli nie widzisz wiadomości, sprawdź folder spam lub oferty.
                </p>

                <a href="/login" className="auth-result-button">
                    Przejdź do logowania
                </a>
            </div>
        </div>
    );
}