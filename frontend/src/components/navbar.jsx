import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import logo from '../assets/logo.png';

const Navbar = () => {
    return (
        <AppBar position="static" style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Toolbar>
                <img src={logo} alt="Logo" style={{ height: '40px' }} />
                <Typography variant="h5" style={{ flexGrow: 1 }}>
                    BlockBallot
                </Typography>
                <Box>
                    <Button color="inherit" component={Link} to="/contact" >
                        About
                    </Button>
                    <Button color="inherit" component={Link} to="/contact" >
                        Contact
                    </Button>
                    <Button color="inherit" component={Link} to="/login" >
                        Login
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
