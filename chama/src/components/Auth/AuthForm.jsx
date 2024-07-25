import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthForm.css';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // State to switch between login and signup
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = isSignUp ? 'signup' : 'login'; // Determine action based on state

    try {
      const response = await axios.post('http://localhost/chama-backend/api/auth.php', {
        action,
        email,
        password,
      });

      console.log('Response data:', response.data); // Log the response data for debugging

      if (response.data.message === 'Login successful' || response.data.message === 'User created') {
        const user = response.data.user; // Ensure we get the user data
        if (user && user.email && user.role) { // Check if user data is valid
          localStorage.setItem('user', JSON.stringify(user)); // Store user data in localStorage
          if (user.role === 'admin') {
            navigate('/admin'); // Redirect to admin dashboard
          } else {
            navigate('/user'); // Redirect to user dashboard
          }
        } else {
          console.error('User data is not properly defined:', user);
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
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
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







