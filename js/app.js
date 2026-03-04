'use strict';

// --- configuration -----------------------------------------------------
const contractAddress =
  '0x0be71bc6118C4658D2c22fdbdB2D90b083D400c9';
const abi = [
  {
    inputs: [{ internalType: 'address', name: '_voter', type: 'address' }],
    name: 'registerVoter',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address[]', name: '_voters', type: 'address[]' }
    ],
    name: 'registerVoters',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string[]',
        name: '_candidateNames',
        type: 'string[]'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'candidateIndex', type: 'uint256' }
    ],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'voter', type: 'address' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'candidateIndex',
        type: 'uint256'
      }
    ],
    name: 'Voted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'voter', type: 'address' }
    ],
    name: 'VoterRegistered',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'admin', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'count', type: 'uint256' }
    ],
    name: 'VotersBatchRegistered',
    type: 'event'
  },
  {
    inputs: [],
    name: 'admin',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'candidates',
    outputs: [
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'uint256', name: 'voteCount', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getCandidates',
    outputs: [
      {
        components: [
          { internalType: 'string', name: 'name', type: 'string' },
          { internalType: 'uint256', name: 'voteCount', type: 'uint256' }
        ],
        internalType: 'struct SecureVoting.Candidate[]',
        name: '',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '_addr', type: 'address' }],
    name: 'getVoter',
    outputs: [
      { internalType: 'bool', name: 'isRegistered', type: 'bool' },
      { internalType: 'bool', name: 'hasVoted', type: 'bool' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'voters',
    outputs: [
      { internalType: 'bool', name: 'isRegistered', type: 'bool' },
      { internalType: 'bool', name: 'hasVoted', type: 'bool' }
    ],
    stateMutability: 'view',
    type: 'function'
  }
];

let web3, contract, account, admin;

// ------------------------------------------------------------------
// Wallet connection & initialization
// ------------------------------------------------------------------
async function connectWallet() {
  try {
    const provider =
      window.rabby || (window.ethereum && window.ethereum.isRabby)
        ? window.ethereum || window.rabby
        : window.ethereum;

    if (!provider) {
      alert('⚠️ Please install or enable Rabby Wallet.');
      return;
    }

    web3 = new Web3(provider);
    await provider.request({ method: 'eth_requestAccounts' });
    const accounts = await web3.eth.getAccounts();
    account = accounts[0];
    document.getElementById('wallet').textContent = `Connected: ${account}`;

    const chainId = await web3.eth.getChainId();
    if (![137, 80002].includes(chainId)) {
      alert('⚠️ Switch to Polygon Mainnet or Amoy Testnet in Rabby!');
      return;
    }

    contract = new web3.eth.Contract(abi, contractAddress);
    admin = await contract.methods.admin().call();
    await loadCandidates();
  } catch (err) {
    console.error(err);
    alert('Connection failed: ' + err.message);
  }
}

// ------------------------------------------------------------------
// Admin operations
// ------------------------------------------------------------------
async function registerVoter() {
  const voter = document.getElementById('voterAddress').value.trim();
  if (!voter) return alert('Enter voter address.');
  if (!contract) return alert('Connect wallet first.');
  if (account.toLowerCase() !== admin.toLowerCase())
    return alert('Only admin can register voters.');

  try {
    await contract.methods.registerVoter(voter).send({ from: account });
    alert(`✅ Voter ${voter} registered successfully!`);
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

// ------------------------------------------------------------------
// Voter interactions
// ------------------------------------------------------------------
async function loadCandidates() {
  try {
    const candidates = await contract.methods.getCandidates().call();
    const div = document.getElementById('candidateList');
    div.innerHTML = '';
    candidates.forEach((c, i) => {
      const btn = document.createElement('button');
      btn.textContent = c.name;
      btn.addEventListener('click', () => vote(i));
      div.appendChild(btn);
    });
    showResults();
  } catch (err) {
    document.getElementById('candidateList').textContent =
      'Failed to load candidates.';
  }
}

async function vote(index) {
  try {
    const voterInfo = await contract.methods.getVoter(account).call();
    if (!voterInfo.isRegistered)
      return alert('You are not registered to vote.');
    if (voterInfo.hasVoted) return alert('You have already voted.');

    await contract.methods.vote(index).send({ from: account });
    alert('✅ Vote submitted successfully!');
    showResults();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function showResults() {
  const candidates = await contract.methods.getCandidates().call();
  const res = document.getElementById('results');
  res.innerHTML = '';
  candidates.forEach(c => {
    res.innerHTML += `<p><strong>${c.name}</strong>: ${c.voteCount} votes</p>`;
  });
}

// ------------------------------------------------------------------
// Setup event listeners
// ------------------------------------------------------------------
document.getElementById('connectBtn').onclick = connectWallet;
document.getElementById('registerBtn').onclick = registerVoter;
