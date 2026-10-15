# Vercel deployment

This repository contains a static HTML, CSS, and JavaScript frontend. Vercel can publish the files directly without a framework build.

## Deploy

1. Visit https://vercel.com/new and import `Wilberry/blockchain-voting-system` from GitHub.
2. Set **Framework Preset** to **Other** and **Root Directory** to the repository root (`./`).
3. Leave the build and install commands unset. The site's entry point is `index.html` in the repository root.
4. Deploy and open the URL Vercel provides.

The existing `index.html` references `css/style.css` and `js/app.js` using relative paths, so they can be served as static assets.

## Wallet and smart-contract checks

The frontend currently references contract `0x0be71bc6118C4658D2c22fdbdB2D90b083D400c9` and allows Polygon Mainnet (chain ID 137) or Amoy (chain ID 80002). Verify which network actually contains the deployed contract before inviting visitors to transact. Hosting the frontend does **not** deploy or validate the smart contract.

A visitor needs a browser wallet on the correct chain and must be registered by the contract administrator to vote. Blockchain transactions can require network gas fees. Prefer a dedicated testnet deployment and demo accounts for public testing. Never expose wallet seed phrases or private keys in the repository.

## Deployment acceptance

- Home page loads over HTTPS
- Styles and scripts load without 404 errors
- Wallet connection works on a supported browser
- Contract address has code on the selected chain
- Candidate reads succeed
- Authorized voter registration and voting work on the intended testnet

The repository's existing GitHub Pages workflow is independent of Vercel and is not required for Vercel hosting.
