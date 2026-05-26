import { useState } from "react";

export default function LoginForm({ onGoRegister }) {
    const [mail, setMail] = useState("");
    const [haslo, setHaslo] = useState("");
    const [message, setMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        const res = await fetch("http://localhost/AutoVerseProjekt/backend/login.php", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ mail, haslo })
        });

        const data = await res.json();
        setMessage(data.message);

        if (data.success) {
            window.location.href = "/ClientPage";
        }
    }

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <label>Email</label>
            <div className="auth-input-box">
                <span>✉</span>
                <input
                    type="email"
                    placeholder="Wpisz swój email"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                />
            </div>

            <label>Hasło</label>
            <div className="auth-input-box">
                <span>🔒</span>
                <input
                    type="password"
                    placeholder="Wpisz swoje hasło"
                    value={haslo}
                    onChange={(e) => setHaslo(e.target.value)}
                />
            </div>

            <div className="auth-forgot">
                Nie pamiętasz hasła?
            </div>

            <button className="auth-submit">
                Zaloguj się
            </button>

            {message && <div className="auth-message">{message}</div>}

            <div className="auth-bottom">
                Nie masz konta?{" "}
                <button type="button" onClick={onGoRegister}>
                    Zarejestruj się
                </button>
            </div>
        </form>
    );
}