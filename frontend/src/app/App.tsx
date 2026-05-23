import { Navigate, Route, Routes } from "react-router-dom";
import { BuildPlanPage } from "../features/BuildPlanPage";
import { ConnectPage } from "../features/ConnectPage";
import { DashboardPage } from "../features/DashboardPage";
import { LandingPage } from "../features/LandingPage";
import { PublicPlanPage } from "../features/PublicPlanPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/connect" element={<ConnectPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/build-plan" element={<BuildPlanPage />} />
      <Route path="/plan/:slug" element={<PublicPlanPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
