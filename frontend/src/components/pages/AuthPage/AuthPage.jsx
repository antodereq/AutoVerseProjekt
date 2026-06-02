import { useState } from "react";
import LoginForm from "./LoginForm.jsx";
import RegisterForm from "./RegisterForm.jsx";
import "./AuthPage.css";

export default function AuthPage() {
    const [mode, setMode] = useState("login");

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="text-center mb-4">
                    <h1 className="auth-logo">
                        Auto<span>Verse</span>
                    </h1>
                    <p className="auth-subtitle">
                        Twoje centrum samochodowych danych
                    </p>
                </div>

                <div className="auth-tabs">
                    <button
                        type="button"
                        className={mode === "login" ? "active" : ""}
                        onClick={() => setMode("login")}
                    >
                        Logowanie
                    </button>

                    <button
                        type="button"
                        className={mode === "register" ? "active" : ""}
                        onClick={() => setMode("register")}
                    >
                        Rejestracja
                    </button>
                </div>

                <div className="auth-divider"></div>

                {mode === "login" ? (
                    <LoginForm onGoRegister={() => setMode("register")} />
                ) : (
                    <RegisterForm onGoLogin={() => setMode("login")} />
                )}
            </div>
        </div>
    );
}