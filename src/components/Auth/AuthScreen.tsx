import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-screen">
      <div className="auth-background">
        <div className="auth-particles"></div>
        <div className="auth-glow"></div>
      </div>

      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-icon">🩺</div>
            <h1 className="logo-title">DigestiTrack</h1>
            <p className="logo-subtitle">
              Professional Digestive Health Monitor
            </p>
          </div>
        </div>

        <div className="auth-content">
          {isLogin ? (
            <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>

        <div className="auth-features">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <div className="feature-content">
              <h4>Medical-Grade Tracking</h4>
              <p>Bristol Stool Chart and clinical symptom logging</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <div className="feature-content">
              <h4>HIPAA Compliant</h4>
              <p>Your health data is secure and encrypted</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👩‍⚕️</div>
            <div className="feature-content">
              <h4>Healthcare Integration</h4>
              <p>Share reports with your healthcare provider</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
