import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthForm.css';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = isSignUp ? 'signup' : 'login';

    try {
      const response = await axios.post('http://localhost/chama-backend/api/auth.php', {
        action,
        email,
        password,
      });

      if (response.data.message === 'Login successful') {
        const role = response.data.role;
        if (role === 'admin') {
          navigate('/admin'); // Redirect to admin dashboard
        } else {
          navigate('/user'); // Redirect to user dashboard
        }
      } else if (response.data.message === 'User created') {
        const role = response.data.role;
        if (role === 'admin') {
          navigate('/admin'); // Redirect to admin dashboard after signup
        } else {
          navigate('/user'); // Redirect to user dashboard after signup
        }
      } else {
        console.error(response.data.message);
        if (response.data.message === 'Invalid credentials or user not found') {
          setIsSignUp(true); // Switch to signup if login fails
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{isSignUp ? 'Sign Up' : 'Login'}</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>
        </form>
        {isSignUp && (
          <p>
            Already have an account?{' '}
            <button className="switch-button" onClick={() => setIsSignUp(false)}>
              Switch to Login
            </button>
          </p>
        )}
        {!isSignUp && (
          <p>
            New user?{' '}
            <button className="switch-button" onClick={() => setIsSignUp(true)}>
              Sign Up
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;




