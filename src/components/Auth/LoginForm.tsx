import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import PoopDropGame from "./PoopDropGame";

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showGame, setShowGame] = useState(false);
  const { login, isLoading } = useAuth();

  // Auto-show game on desktop
  React.useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop) {
      const timer = setTimeout(() => {
        setShowGame(true);
      }, 2000); // Show game after 2 seconds on desktop
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form">
        <h2 className="auth-form-title">Welcome Back</h2>
        <p className="auth-form-subtitle">
          Sign in to your digestive health tracker
        </p>

        <form onSubmit={handleSubmit} className="auth-form-element">
          <div className="form-field">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-field">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button
            type="submit"
            className="auth-button primary"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="auth-switch">
          <p className="auth-switch-text">
            Don't have an account?{" "}
            <button
              type="button"
              className="auth-link-button"
              onClick={onSwitchToRegister}
              disabled={isLoading}
            >
              Create Account
            </button>
          </p>
        </div>

        <div className="auth-privacy">
          <p className="auth-privacy-text">
            🔒 Your data is encrypted and HIPAA-compliant. We never share your
            personal health information.
          </p>
        </div>

        <button
          type="button"
          className="game-toggle-btn"
          onClick={() => setShowGame(true)}
          disabled={isLoading}
          aria-label="Play Poop Drop mini-game while waiting"
        >
          🎮 Play Poop Drop Game 💩
        </button>
      </div>

      <PoopDropGame
        isVisible={showGame}
        onClose={() => setShowGame(false)}
        autoStart={window.innerWidth >= 1024}
        compact={window.innerWidth < 1024}
      />
    </div>
  );
};

export default LoginForm;
