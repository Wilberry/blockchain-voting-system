// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title SecureVoting
/// @notice Demo voting contract where an admin registers voters and voters can cast a single vote
/// @dev Admin is set in constructor and may register voters individually or in batches
contract SecureVoting {
    /// Address with permission to register voters
    address public admin;

    /// Candidate data structure
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    /// Voter data structure
    struct Voter {
        bool isRegistered;
        bool hasVoted;
    }

    /// Mapping of voter addresses to metadata
    mapping(address => Voter) public voters;

    /// Dynamic array of candidates
    Candidate[] public candidates;

    /* ------------------------------------------------------------------ */
    /* Events                                                            */
    /* ------------------------------------------------------------------ */

    /// Emitted when a single voter is registered
    event VoterRegistered(address indexed voter);

    /// Emitted after a batch registration operation
    event VotersBatchRegistered(address indexed admin, uint256 count);

    /// Emitted when a vote is cast
    event Voted(address indexed voter, uint256 candidateIndex);

    /* ------------------------------------------------------------------ */
    /* Modifiers                                                         */
    /* ------------------------------------------------------------------ */

    /// Restricts execution to the admin account
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    /* ------------------------------------------------------------------ */
    /* Constructor                                                        */
    /* ------------------------------------------------------------------ */

    /// @param _candidateNames List of candidate names to populate on deployment
    constructor(string[] memory _candidateNames) {
        admin = msg.sender;

        // create candidate structs from provided names
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidates.push(Candidate({name: _candidateNames[i], voteCount: 0}));
        }
    }

    /* ------------------------------------------------------------------ */
    /* Admin functions                                                    */
    /* ------------------------------------------------------------------ */

    /// @notice Add a single address to the voter registry
    /// @param _voter The address to grant voting rights
    function registerVoter(address _voter) external onlyAdmin {
        require(!voters[_voter].isRegistered, "Already registered");
        voters[_voter].isRegistered = true;
        emit VoterRegistered(_voter);
    }

    /// @notice Add multiple addresses to the registry in one call
    /// @param _voters Array of addresses to register
    function registerVoters(address[] calldata _voters) external onlyAdmin {
        uint256 added = 0;
        for (uint256 i = 0; i < _voters.length; i++) {
            address a = _voters[i];
            if (!voters[a].isRegistered) {
                voters[a].isRegistered = true;
                added++;
                emit VoterRegistered(a);
            }
        }
        emit VotersBatchRegistered(msg.sender, added);
    }

    /* ------------------------------------------------------------------ */
    /* Voter-facing functions                                             */
    /* ------------------------------------------------------------------ */

    /// @notice Cast a vote for a candidate by index
    /// @param candidateIndex Position in the candidates array
    function vote(uint256 candidateIndex) external {
        require(voters[msg.sender].isRegistered, "Not registered");
        require(!voters[msg.sender].hasVoted, "Already voted");
        require(candidateIndex < candidates.length, "Invalid candidate");

        voters[msg.sender].hasVoted = true;
        candidates[candidateIndex].voteCount += 1;
        emit Voted(msg.sender, candidateIndex);
    }

    /* ------------------------------------------------------------------ */
    /* View helpers                                                       */
    /* ------------------------------------------------------------------ */

    /// @notice Fetch the full list of candidates and their vote counts
    /// @return An array of Candidate structs
    function getCandidates() external view returns (Candidate[] memory) {
        return candidates;
    }

    /// @notice Check whether an address is registered and/or has voted
    /// @param _addr Address to query
    /// @return isRegistered True if registered
    /// @return hasVoted True if already voted
    function getVoter(address _addr) external view returns (bool isRegistered, bool hasVoted) {
        Voter memory v = voters[_addr];
        return (v.isRegistered, v.hasVoted);
    }
}
