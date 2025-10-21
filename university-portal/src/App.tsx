import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import StudentDetailPage from "./pages/StudentDetailPage";
import "./styles/index.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<DashboardPage />} />
          <Route path="/student/:id" element={<StudentDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
