const { ethers } = require("ethers");

// PancakeSwap Router ABI (swapExactTokensForETH, swapExactETHForTokens, etc.)
const ROUTER_ABI = [
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) payable returns (uint[] memory amounts)",
  "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) returns (uint[] memory amounts)"
];

// Standard ERC20 ABI (just approve and decimals needed here)
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function decimals() view returns (uint8)"
];

// Setup router
function createRouter(signer, routerAddress) {
  return new ethers.Contract(routerAddress, ROUTER_ABI, signer);
}

// Buy Tokens (BNB → Token)
async function swapBNBForTokens(router, amountInBNB, tokenAddress, toAddress, amountOutMin) {
  const path = ["0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", tokenAddress]; // BNB → Token
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  try {
    const tx = await router.swapExactETHForTokens(
      amountOutMin,
      path,
      toAddress,
      deadline,
      { value: amountInBNB }
    );
    await tx.wait();
    console.log("[Swap Success] BNB → Token");
  } catch (error) {
    console.error("[Swap Error] Buying failed:", error.message);
  }
}

// Sell Tokens (Token → BNB)
async function swapTokensForBNB(router, amountInTokens, amountOutMin, tokenAddress, toAddress) {
  try {
    const token = new ethers.Contract(tokenAddress, ERC20_ABI, router.runner); // signer is router.runner

    // Approve router to spend tokens
    const approveTx = await token.approve(router.address, amountInTokens);
    await approveTx.wait();

    const path = [tokenAddress, "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"]; // Token → BNB
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

    const tx = await router.swapExactTokensForETH(
      amountInTokens,
      amountOutMin,
      path,
      toAddress,
      deadline
    );
    await tx.wait();
    console.log("[Swap Success] Token → BNB");
  } catch (error) {
    console.error("[Swap Error] Selling failed:", error.message);
  }
}

module.exports = {
  createRouter,
  swapBNBForTokens,
  swapTokensForBNB
};
