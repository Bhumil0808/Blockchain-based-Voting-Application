const express = require('express');
const { Web3 } = require('web3');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 5000;
const User = require('../database/models/userSchema.js');
// User.findById("66c45656901842d93db9ea45")
//   .then(user => {
//     console.log(user);
//   })
//   .catch(err => {
//     console.error(err);
//   });
require('dotenv').config();

app.use(cors());
app.use(express.json());

const web3 = new Web3(process.env.URL);

const contractABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'VotingABI.json')));
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Helper function to serialize BigInt
const serializeBigInt = (obj) => {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value));
};

// Endpoint to add a candidate
app.post('/api/addCandidate', async (req, res) => {
  const { name, party } = req.body;
  try {
    const accounts = await web3.eth.getAccounts();
    console.log(`Adding candidate: ${name}, Party: ${party}`);
    const receipt = await contract.methods.addCandidate(name, party).send({ from: accounts[0], gas: 600000 });
    // console.log(`Transaction receipt: ${receipt}`);
    res.json(serializeBigInt(receipt));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to vote
app.post('/api/:id/vote', async (req, res) => {
  const { candidateID,account} = req.body;
  const {id}=req.params;
  console.log(id);
  try {
    const hasVoted = await contract.methods.checkVote(id).call();
    console.log(hasVoted);
    if (hasVoted) {
      console.log('fdsjklf');
      return res.status(400).json({ error: 'User has already voted' });
    }
    const accounts = await web3.eth.getAccounts();
    const receipt = await contract.methods.vote(id,candidateID).send({ from: account, gas: 600000 });
    console.log(receipt);
    res.json(serializeBigInt(receipt));
  } catch (error) {
    console.log("er");
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get candidate details
app.get('/api/getCandidate/:id', async (req, res) => {
  try {
    const candidate = await contract.methods.getCandidate(req.params.id).call();
    res.json(serializeBigInt(candidate));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get count of candidates
app.get('/api/getCountCandidates', async (req, res) => {
  try {
    const count = await contract.methods.getCountCandidates().call();
    res.json(serializeBigInt({ count }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to set dates
app.post('/api/setDates', async (req, res) => {
  const { startDate, endDate } = req.body;
  console.log(startDate,endDate);
  try {
    const accounts = await web3.eth.getAccounts();
    const receipt = await contract.methods.setDates(startDate, endDate).send({ from: accounts[0], gas: 600000 });
    res.json(serializeBigInt(receipt));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/getDates', async (req, res) => {
  try {
    const startDate = await contract.methods.getDates(0).call();
    const endDate = await contract.methods.getDates(1).call();
    res.json(serializeBigInt({ startDate, endDate }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/deleteCandidate', async (req, res) => {
  const { candidateID } = req.body;
  try {
      const accounts = await web3.eth.getAccounts();
      const receipt = await contract.methods.deleteCandidate(candidateID).send({ from: accounts[0], gas: 600000 });
      res.json( serializeBigInt(receipt));
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Endpoint to get election results
app.get('/api/getResults', async (req, res) => {
  try {
      const results = await contract.methods.getResults().call();
      // console.log(results);
      const candidates = results[0].map((id, index) => ({
          id: parseInt(id),
          name: results[1][index],
          party: results[2][index],
          voteCount: parseInt(results[3][index], 10)
      }));
      res.json({ candidates });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.post('/api/resetElection', async (req, res) => {
  try {
      const accounts = await web3.eth.getAccounts();
      const receipt = await contract.methods.resetElection().send({ from: accounts[0], gas: 600000 });
      res.json( serializeBigInt(receipt) );
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// New endpoint to get all candidates
app.get('/api/getCandidates', async (req, res) => {
  try {
      const countCandidates = await contract.methods.countCandidates().call();
      const candidates = [];
      for (let i = 1; i <= countCandidates; i++) {
          const candidate = await contract.methods.getCandidate(i).call();
          // console.log(`Candidate ${i}:`, candidate); // Logging candidate data for debugging

          candidates.push({
              id: parseInt(candidate[0]),
              name: candidate[1],
              party: candidate[2],
              voteCount: parseInt(candidate[3], 10)
          });
      }
      const votingEnd = await contract.methods.votingEnd().call();
      res.json({ candidates, votingEnd: parseInt(votingEnd, 10) });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

async function fetchAllCandidates() {
  try {
    const countCandidates = await contract.methods.countCandidates().call();
    console.log(`Total candidates: ${countCandidates}`);

    for (let i = 1; i <= countCandidates; i++) {
      const candidate = await contract.methods.getCandidate(i).call();
      // console.log(`Candidate ${i}:`, candidate);
    }
  } catch (error) {
    console.error('Error fetching candidates:', error);
  }
}

fetchAllCandidates();
