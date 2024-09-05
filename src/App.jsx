import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider, useMutation, gql } from '@apollo/client';
import { ethers } from 'ethers'; // Ensure ethers is imported correctly
import './App.css';

// Apollo Client setup
const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.studio.thegraph.com/query/87122/voting-dapp/0.0.1', // Replace with your GraphQL server endpoint
  }),
  cache: new InMemoryCache(),
});

// ABI and contract address
const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your contract address
const contractABI = [
  // Replace with your contract ABI
  {
    "constant": true,
    "inputs": [],
    "name": "someFunction",
    "outputs": [{ "name": "", "type": "uint256" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  // Add other ABI items here
];

// RegisterVoter Component
const RegisterVoter = () => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [level, setLevel] = useState(0);
  const [matno, setMatno] = useState('');

  const [registerVoter] = useMutation(gql`
    mutation RegisterVoter($id: String!, $name: String!, $level: Int!, $matno: String!) {
      registerVoter(id: $id, name: $name, level: $level, matno: $matno) {
        id
        name
        level
        matno
      }
    }
  `);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Interact with your smart contract
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        // Assuming registerVoter function is in the smart contract
        await contract.registerVoter(id, name, level, matno);

        // Perform GraphQL mutation
        await registerVoter({ variables: { id, name, level, matno } });

        // Reset form
        setId('');
        setName('');
        setLevel(0);
        setMatno('');
      } catch (error) {
        console.error('Error interacting with smart contract:', error);
      }
    } else {
      console.log('MetaMask not installed or window.ethereum not found');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={id} onChange={(e) => setId(e.target.value)} placeholder="ID" />
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input value={level} onChange={(e) => setLevel(Number(e.target.value))} placeholder="Level" />
      <input value={matno} onChange={(e) => setMatno(e.target.value)} placeholder="Matric Number" />
      <button type="submit">Register Voter</button>
    </form>
  );
};

// Main App Component
function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1>Voting System</h1>
        <RegisterVoter />
        <Vote />
      </div>
    </ApolloProvider>
  );
}

export default App;
