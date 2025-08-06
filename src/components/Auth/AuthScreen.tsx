import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-screen">
      <div className="auth-container">
        <div className="auth-header">
          <div className="logo">
            <h1>🩺 DigestiTrack</h1>
            <p>Professional Digestive Health Tracking</p>
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
          <div className="feature">
            <span className="feature-icon">📊</span>
            <div>
              <h4>Medical-Grade Tracking</h4>
              <p>Bristol Stool Chart and clinical symptom logging</p>
            </div>
          </div>
          <div className="feature">
            <span className="feature-icon">🔒</span>
            <div>
              <h4>HIPAA Compliant</h4>
              <p>Your health data is secure and encrypted</p>
            </div>
          </div>
          <div className="feature">
            <span className="feature-icon">👩‍⚕️</span>
            <div>
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