import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/cadastro" replace />} />
      </Routes>
    </BrowserRouter>
  );
}