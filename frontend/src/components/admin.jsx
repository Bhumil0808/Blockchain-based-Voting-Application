import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography, Snackbar, Alert } from '@mui/material';
import Navbar from './navbar';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const [candidateName, setCandidateName] = useState('');
    const [partyName, setPartyName] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [leadingCandidate, setLeadingCandidate] = useState('');
    const [electionStatus, setElectionStatus] = useState('Election not started yet');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const url = "http://localhost:5000";
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch candidates from the API
        axios.get(`${url}/api/getCandidates`)
            .then(response => {
                const data = response.data.candidates;
                if (Array.isArray(data)) {
                    setCandidates(data);
                    calculateLeadingCandidate(data);
                } else {
                    console.error("Expected an array but got:", data);
                    setCandidates([]);
                }
            })
            .catch(error => {
                console.error(error);
                setCandidates([]);
            });

        // Fetch election dates from the API and determine the status
        axios.get(`${url}/api/getDates`)
            .then(response => {
                const start = new Date(response.data.startDate * 1000);
                const end = new Date(response.data.endDate * 1000);
                setStartDate(start.toLocaleString());
                setEndDate(end.toLocaleString());

                const now = new Date();
                if (now >= start && now <= end) {
                    setElectionStatus('Election in progress');
                } else if (now > end) {
                    setElectionStatus('Election ended');
                    fetchResults();  // Fetch the results once the election ends
                }
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const fetchResults = () => {
        axios.get(`${url}/api/getResults`)
            .then(response => {
                const data = response.data.candidates;
                if (Array.isArray(data)) {
                    setCandidates(data);
                    calculateLeadingCandidate(data);
                } else {
                    console.error("Expected an array but got:", data);
                    setCandidates([]);
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    const calculateLeadingCandidate = (candidates) => {
        if (candidates.length > 0) {
            const maxVotes = Math.max(...candidates.map(candidate => candidate.voteCount));
            const leader = candidates.find(candidate => candidate.voteCount === maxVotes);
            setLeadingCandidate(leader ? leader.name : 'No votes yet');
        } else {
            setLeadingCandidate('No votes yet');
        }
    };

    const handleAddCandidate = () => {
        const newCandidate = {
            name: candidateName,
            party: partyName,
        };

        axios.post(`${url}/api/addCandidate`, newCandidate)
            .then(response => {
                setCandidates([...candidates, response.data]);
                setCandidateName('');
                setPartyName('');
                setSnackbarMessage('Candidate added successfully!');
                setSnackbarOpen(true);
            })
            .catch(error => console.error(error));
    };

    const handleSetVotingDates = () => {
        const start = new Date(startDate).getTime() / 1000;
        const end = new Date(endDate).getTime() / 1000;

        axios.post(`${url}/api/setDates`, { startDate: start, endDate: end })
            .then(response => {
                setSnackbarMessage('Voting dates set successfully!');
                setSnackbarOpen(true);
            })
            .catch(error => console.error(error));
    };

    const handleDeleteCandidate = (id) => {
        axios.post(`${url}/api/deleteCandidate`, { candidateID: id })
            .then(() => {
                setCandidates(candidates.filter(candidate => candidate.id !== id));
                calculateLeadingCandidate(candidates);
                setSnackbarMessage('Candidate deleted successfully!');
                setSnackbarOpen(true);
            })
            .catch(error => console.error(error));
    };

    const handleResetElection = () => {
        axios.post(`${url}/api/resetElection`)
            .then(() => {
                setCandidates([]);
                setLeadingCandidate('');
                setElectionStatus('Election not started yet');
                setSnackbarMessage('Election reset successfully!');
                setSnackbarOpen(true);
            })
            .catch(error => console.error(error));
    };

    const handleAddUser = () => {
        navigate('/addUser');
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <>
            <Navbar />
            <Box sx={{ padding: '20px', paddingLeft: '40px', color: 'white' }}>
                <Typography variant="h4" gutterBottom>
                    Admin Panel
                </Typography>

                <Box sx={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'center' }}>
                    <TextField
                        label="Candidate Name"
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                        variant="outlined"
                        sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                        InputLabelProps={{
                            style: { color: 'white' }
                        }}
                        InputProps={{
                            style: { color: 'white' }
                        }}
                    />
                    <TextField
                        label="Party Name"
                        value={partyName}
                        onChange={(e) => setPartyName(e.target.value)}
                        variant="outlined"
                        sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                        InputLabelProps={{
                            style: { color: 'white' }
                        }}
                        InputProps={{
                            style: { color: 'white' }
                        }}
                    />
                    <Button variant="contained" color="primary" onClick={handleAddCandidate}>
                        Submit
                    </Button>
                </Box>

                <Box sx={{ marginBottom: '20px' }}>
                    <Typography variant="h5" gutterBottom>
                        Set Voting Dates
                    </Typography>
                    <Box sx={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <TextField
                            label="Start Date & Time"
                            type="datetime-local"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                            InputLabelProps={{
                                shrink: true,
                                style: { color: 'white' }
                            }}
                            InputProps={{
                                style: { color: 'white' }
                            }}
                        />
                        <TextField
                            label="End Date & Time"
                            type="datetime-local"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                            InputLabelProps={{
                                shrink: true,
                                style: { color: 'white' }
                            }}
                            InputProps={{
                                style: { color: 'white' }
                            }}
                        />

                        <Button variant="contained" color="primary" onClick={handleSetVotingDates}>
                            Set Dates
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ marginBottom: '20px' }}>
                    <Typography variant="h5" gutterBottom>
                        Candidates
                    </Typography>
                    {candidates.length > 0 ? (
                        <Table sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: 'white' }}>ID</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Name</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Party</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Vote Count</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {candidates.map((candidate) => (
                                    <TableRow key={candidate.id}>
                                        <TableCell sx={{ color: 'white' }}>{candidate.id}</TableCell>
                                        <TableCell sx={{ color: 'white' }}>{candidate.name}</TableCell>
                                        <TableCell sx={{ color: 'white' }}>{candidate.party}</TableCell>
                                        <TableCell sx={{ color: 'white' }}>{candidate.voteCount}</TableCell>
                                        <TableCell>
                                            <Button variant="contained" color="secondary" onClick={() => handleDeleteCandidate(candidate.id)}>
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <Typography>No candidates available</Typography>
                    )}
                </Box>

                <Box sx={{ marginBottom: '20px' }}>
                    <Typography variant="h5" gutterBottom>
                        Leading Candidate: {leadingCandidate}
                    </Typography>
                </Box>

                <Box sx={{ marginBottom: '20px', display: 'flex', gap: '20px' }}>
                    <Button variant="contained" color="primary" onClick={handleAddUser}>
                        Add User
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleResetElection}>
                        Reset Election
                    </Button>
                </Box>

                <Box sx={{ marginBottom: '20px' }}>
                    <Typography variant="h5" gutterBottom>
                        {/* Election Status: {electionStatus} */}
                    </Typography>
                </Box>

                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity="success">
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </>
    );
};

export default AdminPanel;
