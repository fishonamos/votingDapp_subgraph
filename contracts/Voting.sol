// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


/**
 * @title Ownable
 * @dev This contract sets up an ownership system.
 * It allows for transferring ownership and restricting access to certain functions to the owner only.
 */
contract Ownable {
    address public  owner;

    event changedOwner(address indexed newOwner, address indexed oldOwner, string message);


    /**
     * @dev Sets the initial owner of the contract to the address deploying the contract.
     */
    constructor () payable {
        owner = payable (msg.sender);
    }

   /**
     * @dev Modifier to restrict function access to the contract owner only.
     */
    modifier onlyOwner() {
        require(owner == msg.sender, "You are not allowed");
        _;
    }

    /**
     * @dev Retrieve the current owner of the contract.
     * @return The address of the current owner.
     */
    function getOwner() internal  view returns (address) {
        return  owner;
    }

    /**
     * @dev Change the owner of the contract to a new address.
     * @param _newOwner The address of the new owner.
     * Emits a {changedOwner} event.
     */
    function changeOwner(address  payable _newOwner)  private  onlyOwner {
        require(_newOwner != address(0), "Invalid address");

        emit changedOwner(_newOwner, owner, "This owner has been changed");
        owner = _newOwner;

    }
}


    struct Candidate {
        address id;
        string name;
        Posts post;
        uint32 voteCount;
    }

    struct Voter {
        address id;
        string name;
        uint256 level;
        string matno;
        bool hasVoted; 
    }

    enum Posts {
        President,
        VicePresident,
        Pro1,
        Pro2,
        Dos1,
        Dos2,
        FinSec,
        Treasurer,
        Welfare
    }




contract Voting is Ownable {

    mapping(address => Voter) private myVoter;
    mapping(address => Candidate) private myCandidate;
    mapping (string => bool) private voteMatno;
    mapping (string => bool) private candidateMatno;

    uint32 public totalVoteCount = 0;
    uint256 public totalParticipant = 0;

    modifier NotAddr(address _id) {
        require(_id != address(0), "Not a valid address");
        _;
    }

    function registerVoter(
        address _id, 
        string memory _name, 
        uint256 _level, 
        string memory _matno
    ) public  NotAddr(_id) {
        require(myVoter[_id].id != _id, "Voter already registered");
        require(!voteMatno[_matno], "Matric number already exist");   
        Voter memory voter = Voter({
            id: _id,
            name: _name,
            level: _level,
            matno: _matno,
            hasVoted: false
        });

        myVoter[_id] = voter;
        voteMatno[_matno] = true;
        totalParticipant++;
    }

    function registerCandidate(
        address _id, 
        string memory _name, 
        uint256 _level, 
        string memory _matno, 
        Posts _post
    ) public onlyOwner NotAddr(_id) {
        require(myCandidate[_id].id != _id, "Candidate already registered");
        require(myVoter[_id].id == _id, "You must register as a voter first");
        require(
            keccak256(abi.encodePacked(myVoter[_id].name)) == keccak256(abi.encodePacked(_name)), 
            "Name does not match the registered voter's name"
        );  
        require(myVoter[_id].level == _level, "Level does not match the registered voter's level");   
        require(
            keccak256(abi.encodePacked(myVoter[_id].matno)) == keccak256(abi.encodePacked(_matno)), 
            "Matric number does not match the registered voter's matric number"
        ); 
        require(!candidateMatno[_matno], "Matric number already exist");

        Candidate memory candidate = Candidate({
            id: _id,
            name: _name,
            post: _post,
            voteCount: 0
        });

        myCandidate[_id] = candidate;
    }

    function getCandidateDetails(address _candidateAddr) public view returns (Candidate memory) {
        return myCandidate[_candidateAddr];
    }
 
    function vote(Posts _post, address _candidateAddr) public {
        require(myVoter[msg.sender].id == msg.sender, "You must register as a voter first");
        require(!myVoter[msg.sender].hasVoted, "You have already voted");
        require(myCandidate[_candidateAddr].post == _post, "Candidate not running for this post");

        Candidate storage candidate = myCandidate[_candidateAddr];
        candidate.voteCount++;
        myVoter[msg.sender].hasVoted = true;
        totalVoteCount++;
    }

    // Function to get the candidate's vote count
    function getCandidateVoteCount(address _candidateAddr) public view returns (uint32) {
        return myCandidate[_candidateAddr].voteCount;
    }
}

