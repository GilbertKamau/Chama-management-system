import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import './AuthForm.css';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // State to switch between login and signup
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = isSignUp ? 'signup' : 'login'; // Determine action based on state

    try {
      const response = await axios.post('http://localhost/chama-backend/api/auth.php', {
        action,
        email,
        password,
      });

      const responseData = response.data;
      console.log('Response data:', responseData);

      if (responseData.message === 'Login successful' || responseData.message === 'User created') {
        const user = responseData.user; // Get the user data from the response
        console.log('User data:', user);
        login(user); // Update the Auth context with the user data

        // Navigate to the appropriate dashboard based on the user role
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      } else {
        console.error('Error message:', responseData.message);
        if (responseData.message === 'Invalid credentials or user not found') {
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
        {isSignUp ? (
          <p>
            Already have an account?{' '}
            <button className="switch-button" onClick={() => setIsSignUp(false)}>
              Switch to Login
            </button>
          </p>
        ) : (
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









