import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage: React.FC = () => {
  const [institutionId, setInstitutionId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual authentication
    console.log("Login attempt:", { institutionId, password });
    navigate("/");
  };

  // const handleCreateAccount = () => {
  //   // TODO: Navigate to account creation
  //   console.log("Create account clicked");
  // };

  return (
    <div className="login-page">
      {/* Header */}
      <header className="login-header">
        <div className="logo">
          <span className="logo-edu">Edu</span>
          <span className="logo-wallet">Wallet</span>
        </div>
        <div className="logo-icon">
          <img src="/logo.svg" alt="EduWallet Logo" className="logo-image" />
        </div>
      </header>

      {/* Main Content */}
      <main className="login-main">
        {/* User Icon */}
        <div className="user-icon">
          <div className="icon-circle">
            <div className="user-figures">
              <div className="figure-left">👤</div>
              <div className="figure-right">👤</div>
              <div className="plus-icon">+</div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="page-title">Create your account</h1>

        {/* Form */}
        <form onSubmit={handleLogin} className="account-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Name"
              value={institutionId}
              onChange={(e) => setInstitutionId(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="Country"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="Short name"
              className="form-input"
              required
            />
          </div>
        </form>
      </main>
    </div>
  );
};

export default LoginPage;
