pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        string party;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;
    mapping(string => bool) public hasVoted; // Mapping for mongoID to voted status
    string[] public voterIDs; // Array to keep track of all voter IDs
    uint public countCandidates;
    uint256 public votingEnd;
    uint256 public votingStart;

    // Events
    event CandidateAdded(uint id, string name, string party);
    event Voted(string mongoID, uint candidateID); // Updated to use mongoID
    event DatesSet(uint256 votingStart, uint256 votingEnd);
    event ElectionReset();
    event CandidateDeleted(uint id);

    function addCandidate(string memory name, string memory party) public {
        countCandidates++;
        candidates[countCandidates] = Candidate(
            countCandidates,
            name,
            party,
            0
        );
        emit CandidateAdded(countCandidates, name, party);
    }

    function vote(string memory mongoID, uint candidateID) public {
        require(
            (votingStart <= block.timestamp) && (votingEnd > block.timestamp),
            "Voting is not active"
        );

        require(
            candidateID > 0 && candidateID <= countCandidates,
            "Invalid candidate ID"
        );

        require(
            !hasVoted[mongoID],
            "You have already voted"
        );

        hasVoted[mongoID] = true; // Mark this mongoID as having voted
        voterIDs.push(mongoID); // Store mongoID to allow resetting votes
        candidates[candidateID].voteCount++;
        emit Voted(mongoID, candidateID);
    }

    function checkVote(string memory mongoID) public view returns (bool) {
        return hasVoted[mongoID];
    }

    function getCountCandidates() public view returns (uint) {
        return countCandidates;
    }

    function getCandidate(
        uint candidateID
    ) public view returns (uint, string memory, string memory, uint) {
        return (
            candidateID,
            candidates[candidateID].name,
            candidates[candidateID].party,
            candidates[candidateID].voteCount
        );
    }

    function setDates(uint256 _startDate, uint256 _endDate) public {
        require(
            (votingEnd == 0) &&
                (votingStart == 0) &&
                (_startDate + 1000000 > now) &&
                (_endDate > _startDate)
        );
        votingEnd = _endDate;
        votingStart = _startDate;
        emit DatesSet(votingStart, votingEnd);
    }

    function getDates() public view returns (uint256, uint256) {
        return (votingStart, votingEnd);
    }

    function resetElection() public {
        // Reset candidates
        for (uint i = 1; i <= countCandidates; i++) {
            delete candidates[i];
        }
        countCandidates = 0;

        // Reset voter statuses
        for (uint i = 0; i < voterIDs.length; i++) {
            hasVoted[voterIDs[i]] = false;
        }
        delete voterIDs; // Clear the voter IDs array

        // Reset voting dates
        votingEnd = 0;
        votingStart = 0;

        // Emit an event indicating the election has been reset
        emit ElectionReset();
    }

    function deleteCandidate(uint candidateID) public {
        require(
            candidateID > 0 && candidateID <= countCandidates,
            "Invalid candidate ID"
        );

        delete candidates[candidateID];

        for (uint i = candidateID; i < countCandidates; i++) {
            candidates[i] = candidates[i + 1];
        }
        delete candidates[countCandidates];
        countCandidates--;
        emit CandidateDeleted(candidateID);
    }

    function getResults()
        public
        view
        returns (uint[] memory, string[] memory, string[] memory, uint[] memory)
    {
        uint[] memory ids = new uint[](countCandidates);
        string[] memory names = new string[](countCandidates);
        string[] memory parties = new string[](countCandidates);
        uint[] memory votes = new uint[](countCandidates);

        for (uint i = 1; i <= countCandidates; i++) {
            Candidate memory candidate = candidates[i];
            ids[i - 1] = candidate.id;
            names[i - 1] = candidate.name;
            parties[i - 1] = candidate.party;
            votes[i - 1] = candidate.voteCount;
        }

        return (ids, names, parties, votes);
    }
}
