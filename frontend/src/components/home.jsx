import React from 'react';
import { Container, Typography, Button, Grid, Paper, Box } from '@mui/material';
import Spline from '@splinetool/react-spline';
import '../public/home.css';
import Navbar from './navbar';

const Home = () => {
    return (
        <>
        <Navbar />
        <Container maxWidth="lg">
            
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    zIndex: -1, // Ensure the Spline component is behind the content
                }}
            >
                <Spline scene="https://prod.spline.design/kxbT41KIntITfWNv/scene.splinecode" />
            </Box>
            <Typography variant="h2" align="center" gutterBottom class="mainH">
                Welcome to BlockBallot
            </Typography>
            <Typography variant="h6" align="center" paragraph class="paraH">
                Secure, Transparent, and Decentralized Voting Platform
            </Typography>
            <Grid container spacing={3} justifyContent="center" style={{ marginTop: '10px' }}>
                <Grid item>
                    <button class="btn" onClick={() => window.location.href = '/addUser'}>
                        Get Started
                    </button>
                    <button class="btn" onClick={() => window.location.href = '/login'}>
                        Login
                    </button>
                </Grid>
            </Grid>
        </Container>
        </>
    );
};

export default Home;
