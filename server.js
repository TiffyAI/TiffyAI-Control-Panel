// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ethers } = require('ethers');

const app = express();
const PORT = process.env.PORT || 3000;

// === ENV CONFIG ===
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const INFURA_URL = process.env.INFURA_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545/';
const provider = new ethers.JsonRpcProvider(INFURA_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// === CONTRACTS ===
const TIFFY_TOKEN = '0x6df97Ec32401e23dEDB2E6cAF3035155890DC237'; // Make sure this is deployed on testnet
const PANCAKE_ROUTER = '0x9ac64cc6e4415144c455bd8e4837fea55603e5c3'; // PancakeSwap testnet
const WBNB = '0xae13d989dac2f0debff460ac112a837c89baa7cd'; // WBNB testnet

const routerABI = require('./abis/router.json');
const tiffyABI = require('./abis/tiffy.json');

const router = new ethers.Contract(PANCAKE_ROUTER, routerABI, wallet);
const tiffy = new ethers.Contract(TIFFY_TOKEN, tiffyABI, wallet);

app.use(cors());
app.use(bodyParser.json());

// === ROUTES ===
app.get('/', (req, res) => {
  res.send('TiffyAI Backend is running on Testnet');
});

app.post('/start-ai', async (req, res) => {
  console.log('[AI TRADER] Activated');
  res.send('AI trading started');
});

app.post('/stop-ai', async (req, res) => {
  console.log('[AI TRADER] Stopped');
  res.send('AI trading stopped');
});

app.post('/manual-buy', async (req, res) => {
  try {
    console.log('[BUY] Manual trade initiated');

    const amountIn = ethers.parseEther('0.01'); // BNB to spend
    const path = [WBNB, TIFFY_TOKEN];
    const deadline = Math.floor(Date.now() / 1000) + 600;

    const tx = await router.swapExactETHForTokensSupportingFeeOnTransferTokens(
      0, path, wallet.address, deadline,
      { value: amountIn }
    );

    console.log(`[BUY] Sent tx: ${tx.hash}`);
    await tx.wait();
    console.log('[BUY] Confirmed!');
    res.send('Manual buy completed');
  } catch (err) {
    console.error('[Manual Buy Error]', err);
    res.status(500).send(err.reason || 'Buy failed');
  }
});

app.post('/manual-sell', async (req, res) => {
  try {
    console.log('[SELL] Manual trade initiated');

    const amountOut = await tiffy.balanceOf(wallet.address);
    const path = [TIFFY_TOKEN, WBNB];
    const deadline = Math.floor(Date.now() / 1000) + 600;

    const approveTx = await tiffy.approve(PANCAKE_ROUTER, amountOut);
    console.log(`[SELL] Approve TX: ${approveTx.hash}`);
    await approveTx.wait();

    const tx = await router.swapExactTokensForETHSupportingFeeOnTransferTokens(
      amountOut, 0, path, wallet.address, deadline
    );

    console.log(`[SELL] Sent tx: ${tx.hash}`);
    await tx.wait();
    console.log('[SELL] Confirmed!');
    res.send('Manual sell completed');
  } catch (err) {
    console.error('[Manual Sell Error]', err);
    res.status(500).send(err.reason || 'Sell failed');
  }
});

// === START SERVER ===
app.listen(PORT, () => {
  console.log(`TiffyAI server running on port ${PORT}`);
});
