# Secure Voting DApp (Polygon)

This repository contains a simple decentralized application (DApp) demonstrating a secure voting process on the Polygon network. The frontend is a lightweight HTML/JavaScript interface, and the backend smart contract is written in Solidity.

The contract has already been deployed; this repo holds the source code and front-end for transparency, testing, and potential redeployment.

---

## 📁 Project Structure

```
blockchain-voting-system/
├── contracts/          # Solidity smart-contract source
│   └── SecureVoting.sol
├── css/                # Cascading styles for the frontend
│   └── style.css
├── js/                 # Frontend JavaScript logic
│   └── app.js
├── index.html          # Single-page frontend UI
└── README.md           # This document
```

The code is intentionally simple so it can be used as a starting point or educational reference.

---

## 🔧 Frontend

The `index.html` page interacts with a deployed `SecureVoting` contract on the Polygon network (mainnet or Amoy testnet).

### Features

- Connects to a Web3 wallet (Rabby or MetaMask).
- Shows wallet address once connected.
- Admin section for registering voters by address.
- Displays candidate list; registered voters can cast a vote.
- Live results update after each vote.

### Usage

1. Open `index.html` in a browser (serve it via `http://` or a local file).
2. Click **Connect Wallet** and authorize.
3. Ensure wallet network is Polygon Mainnet (chain ID 137) or Amoy Testnet (80002).
4. If you are the contract admin, add voters. Registered accounts may then vote.

> ⚠ The frontend does not include input validation or polished UI for production; it is purely demonstrative.

---

## 📜 Smart Contract

Source: `contracts/SecureVoting.sol`

### Key points

- Admin becomes deployer; can register voters individually or in a batch.
- Registered voters can cast exactly one vote for any candidate.
- Events are emitted for registrations and votes.
- View helper functions return the list of candidates and voter status.

The contract follows [Solidity 0.8.20](https://docs.soliditylang.org/en/v0.8.20/) and includes NatSpec comments for documentation.

### Deploying locally

You can compile and deploy using your preferred framework (Hardhat, Foundry, Truffle, etc.). Example with Hardhat:

```bash
npm init -y
npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers
npx hardhat                      # create basic project
# place SecureVoting.sol under contracts/ and modify scripts accordingly
```

---

## 🚀 Next Steps & Enhancements

- Add tests (`contracts/test` or using Foundry).
- Integrate a build step (e.g. using `npm`/`yarn` and a bundler) for production deployment.
- Improve frontend UI/UX and input validation.
- Supply deployment scripts for Polygon networks.
- Add GitHub Actions for linting/compiling.

---

## 📄 Licensing

This project is licensed under [MIT](LICENSE) (see contract header).

---

Feel free to fork, tweak, or extend this demo! Contributions and feedback are welcome.