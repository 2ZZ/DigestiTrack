import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { register, isLoading } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = (): boolean => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (!agreedToTerms) {
      setError('Please agree to the terms and privacy policy');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    const success = await register(formData.email, formData.password, formData.name);
    if (!success) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form">
        <h2 className="auth-form-title">Create Your Account</h2>
        <p className="auth-form-subtitle">Join thousands tracking their digestive health</p>
        
        <form onSubmit={handleSubmit} className="auth-form-element">
          <div className="form-field">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-field">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-field">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a secure password"
              required
              disabled={isLoading}
            />
            <small className="form-hint">Must be at least 8 characters long</small>
          </div>

          <div className="form-field">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-field checkbox-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                className="checkbox-input"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                disabled={isLoading}
              />
              <span className="checkbox-custom"></span>
              I agree to the <a href="#" className="auth-link">Terms of Service</a> and{' '}
              <a href="#" className="auth-link">Privacy Policy</a>
            </label>
          </div>

          {error && <div className="form-error">{error}</div>}

          <button 
            type="submit" 
            className="auth-button primary"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-switch">
          <p className="auth-switch-text">
            Already have an account?{' '}
            <button 
              type="button" 
              className="auth-link-button"
              onClick={onSwitchToLogin}
              disabled={isLoading}
            >
              Sign In
            </button>
          </p>
        </div>

        <div className="auth-privacy">
          <p className="auth-privacy-text">
            🔒 HIPAA-compliant security • End-to-end encryption • Never shared without consent
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;