import React, { useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import Spline from '@splinetool/react-spline';
import Navbar from './navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../public/login.css';

const url = "http://localhost:3000";

const Login = () => {
  const navigate = useNavigate();
  const [voterId, setVoterId] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = (e) => {
    e.preventDefault();

    axios.post(`${url}/api/send-otp`, { voterId })
      .then(response => {
        setShowOtpField(true); // Show OTP field when OTP is sent
      })
      .catch(error => {
        setError('Failed to send OTP');
        console.error('Error sending OTP:', error);
      });
  };

  const handleConfirmOtp = (e) => {
    e.preventDefault();

    axios.post(`${url}/api/login`, { voterId, otp })
      .then(response => {
        const { role, id } = response.data; // Extract role and id from response
        if (role === 'voter') {
            localStorage.setItem('userId',`${id}`);
          navigate(`/${id}/userDashboard`);
        } else if (role === 'admin') {
          navigate('/adminP');
        } else {
          setError('Invalid role');
        }
      })
      .catch(error => {
        setError('Invalid OTP');
        console.error('Error confirming OTP:', error);
      });
  };

  return (
    <>
      <Navbar />
      <Box position="relative" display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Box position="absolute" width="100%" height="100%" zIndex={1}>
          <Spline
            scene="https://prod.spline.design/4dl3EoFszYThmsml/scene.splinecode"
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </Box>
        <Box
          className="login-form-container"
          style={{
            padding: '2em',
            width: '30%',
            maxWidth: '400px',
            zIndex: 2,
            position: 'relative',
            background: 'rgba(255, 255, 255, 0)',
          }}
        >
          <form className="form">
            <div className="flex-column">
              <label>Voter ID</label>
            </div>
            <div className="inputForm">
              <svg height="20" viewBox="0 0 32 32" width="20" xmlns="http://www.w3.org/2000/svg">
                <g id="Layer_3" data-name="Layer 3">
                  <path
                    d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"
                  ></path>
                </g>
              </svg>
              <input
                type="text"
                className="input"
                placeholder="Enter your Voter ID"
                value={voterId}
                onChange={(e) => setVoterId(e.target.value)}
              />
            </div>

            {showOtpField && (
              <>
                <div className="flex-column">
                  <label>OTP</label>
                </div>
                <div className="inputForm">
                  <input
                    type="text"
                    className="input"
                    placeholder="Enter the OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <button className="button-submit" onClick={handleConfirmOtp}>Confirm OTP</button>
              </>
            )}

            {!showOtpField && (
              <button className="button-submit" onClick={handleSendOtp}>Send OTP</button>
            )}

            {error && <Typography color="error">{error}</Typography>}
          </form>
        </Box>
      </Box>
    </>
  );
};

export default Login;
