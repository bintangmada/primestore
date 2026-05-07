import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import './Login.css'; // Kita reuse CSS login agar konsisten

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, login } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(formData);
      // After registration, log them in automatically
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError('Registration failed. Email might already be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page animate-fade-in">
      <div className="login-container glass">
        <h1 className="login-title">Create Account</h1>
        <p className="login-subtitle">Join Prime Store and start shopping</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleRegister} className="login-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              placeholder="e.g. John Doe"
              value={formData.name} 
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="john@example.com"
              value={formData.email} 
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Min. 4 characters"
              value={formData.password} 
              onChange={handleChange}
              minLength="4"
              required 
            />
          </div>
          
          <button type="submit" className="btn-primary login-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="login-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
