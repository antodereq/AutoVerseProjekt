import React from "react";

export default function Footer() {
    return (
        <footer className="footer-section py-4">
            <div className="container">

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">

                    <div className="text-secondary small">
                        © {new Date().getFullYear()} AutoVerse
                    </div>

                    <div className="d-flex gap-4 small">

                        <a
                            href="#top"
                            className="footer-link"
                        >
                            Wróć na górę
                        </a>

                        <a
                            href="#"
                            className="footer-link"
                        >
                            Polityka prywatności
                        </a>

                    </div>

                </div>

            </div>
        </footer>
    );
}