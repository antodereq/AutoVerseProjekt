// src/App.jsx
import { Routes, Route } from "react-router-dom";
import StartPage from "./components/pages/StartPage/StartPage.jsx";
import RecommenderPage from "./components/pages/RecommenderPage/RecommenderPage.jsx";
import ComparePage from "./components/pages/ComparePage/ComparePage.jsx"; // NOWE

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/RecommenderPage" element={<RecommenderPage />} />
            <Route path="/ComparePage" element={<ComparePage />} /> {/* NOWE */}
        </Routes>
    );
}
