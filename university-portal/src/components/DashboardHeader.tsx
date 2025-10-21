import { useNavigate, useLocation } from "react-router-dom";

export default function DashboardHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === "/";

  return (
    <header className="portal-header">
      <div className="header-left">
        <div
          className="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <span className="logo-edu">Edu</span>
          <span className="logo-wallet">Wallet</span>
        </div>
        <div className="logo-icon">
          <img src="/logo.svg" alt="EduWallet Logo" className="logo-image" />
        </div>
      </div>
      {isDashboard && (
        <div className="header-right">
          <nav className="nav-links">
            <a href="#" className="nav-link">
              Your students
            </a>
            <a href="#" className="nav-link active">
              All students
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
