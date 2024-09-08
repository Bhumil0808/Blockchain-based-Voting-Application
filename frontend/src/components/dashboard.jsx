import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, Box, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import Web3 from 'web3';
import NavBar from './navbar';
import { useParams } from 'react-router-dom';

const UserDashboard = () => {
    const { id } = useParams();
    const userId = localStorage.getItem('userId');
    const [candidates, setCandidates] = useState([]);
    const [electionDates, setElectionDates] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);
    const [votingEnd, setVotingEnd] = useState(0);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');
    const [isFirstVisit, setIsFirstVisit] = useState(true);
    const url = "http://localhost:5000";

    useEffect(() => {
        if (isFirstVisit) {
            setSnackbarMessage('Login Successful');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setIsFirstVisit(false);
        }

        axios.get(`${url}/api/getCandidates`)
            .then(response => {
                const { candidates, votingEnd } = response.data;
                setCandidates(Array.isArray(candidates) ? candidates : []);
                setVotingEnd(votingEnd);
            })
            .catch(error => {
                console.error('Error fetching candidates:', error);
                setSnackbarMessage('Error fetching candidates. Please try again later.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            });

        axios.get(`${url}/api/getDates`)
            .then(response => {
                const { startDate, endDate } = response.data;
                if (startDate && endDate && startDate[0] && startDate[1]) {
                    const start = new Date(startDate[0] * 1000);
                    const end = new Date(endDate[1] * 1000);
                    setElectionDates({ startDate: start, endDate: end });
                } else {
                    console.error('Invalid startDate or endDate format:', response.data);
                    setSnackbarMessage('Error fetching election dates. Please try again later.');
                    setSnackbarSeverity('error');
                    setSnackbarOpen(true);
                }
            })
            .catch(error => {
                console.error('Error fetching election dates:', error);
                setSnackbarMessage('Error fetching election dates. Please try again later.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            });

        connectMetaMask();

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', function (accounts) {
                setSelectedAccount(accounts[0]);
                console.log(`Account changed to: ${accounts[0]}`);
            });
        }
    }, [isFirstVisit]);

    const connectMetaMask = async () => {
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setSelectedAccount(accounts[0]);
                console.log(`Connected account: ${accounts[0]}`);
            } catch (error) {
                console.error('User denied account access', error);
                setSnackbarMessage('User denied account access. Please enable MetaMask.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        } else {
            setSnackbarMessage('Non-Ethereum browser detected. You should consider trying MetaMask!');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
        }
    };

    const handleVote = (candidateId) => {
        axios.post(`${url}/api/${id}/vote`, { candidateID: candidateId, account: selectedAccount })
            .then(response => {
                setSnackbarMessage('Vote successful!');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                setHasVoted(true);
            })
            .catch(error => {
                console.error('Error voting:', error);
                setSnackbarMessage('Error submitting your vote. Please try again.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            });
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const isElectionOver = electionDates && Date.now() > electionDates.endDate.getTime();

    return (
        <>
            <NavBar />
            <Container>
                <Typography variant="h4" sx={{ color: 'white', paddingTop: '20px' }}>Election Dashboard</Typography>
                
                {id == userId ? (
                    candidates.length > 0 ? (
                        <>
                            {isElectionOver ? (
                                <Table sx={{ marginTop: '20px', color: 'white', borderColor: 'white' }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: 'white' }}>ID</TableCell>
                                            <TableCell sx={{ color: 'white' }}>Name</TableCell>
                                            <TableCell sx={{ color: 'white' }}>Party</TableCell>
                                            <TableCell sx={{ color: 'white' }}>Votes</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {candidates.map((candidate, index) => (
                                            <TableRow key={candidate.id}>
                                                <TableCell sx={{ color: 'white' }}>{index + 1}</TableCell>
                                                <TableCell sx={{ color: 'white' }}>{candidate.name}</TableCell>
                                                <TableCell sx={{ color: 'white' }}>{candidate.party}</TableCell>
                                                <TableCell sx={{ color: 'white' }}>{candidate.voteCount}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <Table sx={{ marginTop: '20px', color: 'white', borderColor: 'white' }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: 'white' }}>ID</TableCell>
                                            <TableCell sx={{ color: 'white' }}>Name</TableCell>
                                            <TableCell sx={{ color: 'white' }}>Party</TableCell>
                                            <TableCell sx={{ color: 'white' }}>Vote</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {candidates.map((candidate, index) => (
                                            <TableRow key={candidate.id}>
                                                <TableCell sx={{ color: 'white' }}>{index + 1}</TableCell>
                                                <TableCell sx={{ color: 'white' }}>{candidate.name}</TableCell>
                                                <TableCell sx={{ color: 'white' }}>{candidate.party}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleVote(candidate.id)}
                                                    >
                                                        Vote
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                            
                            {electionDates && (
                                <Box sx={{ marginTop: '30px', color: 'white' }}>
                                    <Typography variant="h6">Election Duration</Typography>
                                    <Typography>Start: {electionDates.startDate.toLocaleString()}</Typography>
                                    <Typography>End: {electionDates.endDate.toLocaleString()}</Typography>
                                </Box>
                            )}
                        </>
                    ) : (
                        <Typography variant="h6" sx={{ color: 'white', marginTop: '20px' }}>
                            No active election at the moment.
                        </Typography>
                    )
                ) : (
                    <Typography variant="h6" sx={{ color: 'white', marginTop: '20px' }}>
                        Path is Not Valid, Please Login again.
                    </Typography>
                )}
            </Container>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default UserDashboard;
