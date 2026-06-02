import { Routes, Route } from "react-router-dom";

import StartPage from "./components/pages/StartPage/StartPage.jsx";
import RecommenderPage from "./components/pages/RecommenderPage/RecommenderPage.jsx";
import ComparePage from "./components/pages/ComparePage/ComparePage.jsx";

import AuthPage from "./components/pages/AuthPage/AuthPage.jsx";
import VerifyEmailPage from "./components/pages/AuthPage/VerifyEmailPage.jsx";
import CheckEmailPage from "./components/pages/AuthPage/CheckEmailPage.jsx";

import ClientPage from "./components/pages/ClientPage/ClientPage.jsx";

import ComparisonDetailsPage from "./components/pages/ComparePage/ComparisonDetailsPage.jsx";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/RecommenderPage" element={<RecommenderPage />} />
            <Route path="/ComparePage" element={<ComparePage />} />

            <Route path="/comparison/:id" element={<ComparisonDetailsPage />} />

            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/check-email" element={<CheckEmailPage />} />

            <Route path="/ClientPage" element={<ClientPage />} />
        </Routes>
    );
}