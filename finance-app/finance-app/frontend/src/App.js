import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import GraficosPage from "./pages/GraficosPage";
import ClassificarPage from "./pages/ClassificarPage";
import PerfilPage from "./pages/PerfilPage";
import MetricasPage from "./pages/MetricasPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/graficos" element={<GraficosPage />} />
        <Route path="/classificar" element={<ClassificarPage />} />
        <Route path="/perfil" element={<PerfilPage />} />
        <Route path="/metricas" element={<MetricasPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}