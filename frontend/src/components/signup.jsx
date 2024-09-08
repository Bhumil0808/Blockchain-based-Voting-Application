import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Typography, Box, Paper } from '@mui/material';
import Spline from '@splinetool/react-spline';
import Navbar from './navbar';
import '../public/signup.css';

const url="http://localhost:3000"

const Signup = () => {
    // State for form fields
    const [voterId, setvoterId] = useState('');
    const [email, setEmail] = useState('');

    // Handle form submission
    const handleSignup = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post(`${url}/api/signup`, {
                voterId,
                email
            });
            console.log('Signup successful:', response.data);
            // Redirect or update UI after successful signup
            window.location.href = '/addUser';
        } catch (error) {
            console.error('Signup error:', error);
            // Handle error (e.g., show an error message to the user)
        }
    };

    return (
        <>
            <Navbar />
            <Box display="flex" height="100vh" alignItems="center" justifyContent="space-between">
                <Box
                    className="spline-container"
                    style={{ width: '70%', height: '100%', transform: 'scale(1.2)', transformOrigin: 'center' }}
                >
                    <Spline scene="https://prod.spline.design/V7ZsaQVaGlmlB1tI/scene.splinecode" />
                </Box>
                <Paper
                    elevation={3}
                    className="signup-form-container"
                    style={{
                        padding: '2em',
                        marginRight: '5%',
                        background: 'rgba(255, 255, 255, 0)', // Translucent background
                        backdropFilter: 'blur(10px)', 
                        width: '30%', 
                        maxWidth: '400px',
                    }}
                >
                    <form onSubmit={handleSignup}>
                        <TextField
                            label="voterId"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={voterId}
                            onChange={(e) => setvoterId(e.target.value)}
                            InputProps={{
                                style: { color: 'white', borderColor: 'white' },
                                classes: { notchedOutline: 'custom-outline' }
                            }}
                            InputLabelProps={{ style: { color: 'white' } }}
                            sx={{
                                '& .MuiInputBase-input': {
                                    color: 'white',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'white',
                                    },
                                },
                            }}
                        />
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputProps={{
                                style: { color: 'white', borderColor: 'white' },
                                classes: { notchedOutline: 'custom-outline' }
                            }}
                            InputLabelProps={{ style: { color: 'white' } }}
                            sx={{
                                '& .MuiInputBase-input': {
                                    color: 'white',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'white',
                                    },
                                },
                            }}
                        />
                        <Box display="flex" justifyContent="space-between" mt={2}>
                            <button 
                                className="btnS" 
                                onClick={() => window.location.href = '/adminP'} 
                                style={{ width: '48%' }}
                                type="button" // Prevents the form from submitting
                            >
                                Back
                            </button>
                            <button 
                                className="btnS secbtn" 
                                style={{ width: '48%' }}
                                type="submit" // Submits the form
                            >
                                Add User
                            </button>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </>
    );
};

export default Signup;
