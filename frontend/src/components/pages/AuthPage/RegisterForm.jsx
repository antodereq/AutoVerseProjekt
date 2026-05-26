import { useState } from "react";

export default function RegisterForm({ onGoLogin }) {
    const [mail, setMail] = useState("");
    const [login, setLogin] = useState("");
    const [haslo, setHaslo] = useState("");
    const [message, setMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        const res = await fetch("http://localhost/AutoVerseProjekt/backend/register.php", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ mail, login, haslo })
        });

        const data = await res.json();
        if (data.success) {
            window.location.href = "/check-email";
        } else {
            setMessage(data.message);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <label>Login</label>
            <div className="auth-input-box">
                <span>👤</span>
                <input
                    type="text"
                    placeholder="Wpisz login"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                />
            </div>

            <label>Email</label>
            <div className="auth-input-box">
                <span>✉</span>
                <input
                    type="email"
                    placeholder="Wpisz email"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                />
            </div>

            <label>Hasło</label>
            <div className="auth-input-box">
                <span>🔒</span>
                <input
                    type="password"
                    placeholder="Wpisz hasło"
                    value={haslo}
                    onChange={(e) => setHaslo(e.target.value)}
                />
            </div>

            <button className="auth-submit">
                Zarejestruj się
            </button>

            {message && <div className="auth-message">{message}</div>}

            <div className="auth-bottom">
                Masz już konto?{" "}
                <button type="button" onClick={onGoLogin}>
                    Zaloguj się
                </button>
            </div>
        </form>
    );
}