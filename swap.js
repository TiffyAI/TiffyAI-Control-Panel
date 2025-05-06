const { ethers } = require("ethers");

const ROUTER_ABI = [
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) payable returns (uint[] memory amounts)",
  "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) returns (uint[] memory amounts)"
];

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

function createRouter(signer, routerAddress) {
  return new ethers.Contract(routerAddress, ROUTER_ABI, signer);
}

// Swap BNB → Token
async function swapBNBForTokens(router, amountInBNB, tokenAddress, toAddress, amountOutMin) {
  const path = ["0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", tokenAddress];
  const deadline = Math.floor(Date.now() / 1000) + 600;

  try {
    const tx = await router.swapExactETHForTokens(
      amountOutMin,
      path,
      toAddress,
      deadline,
      { value: amountInBNB }
    );
    console.log(`[Swap Tx] BNB -> Token Hash: ${tx.hash}`);
    await tx.wait();
    console.log("[Swap Success] BNB → Token confirmed");
  } catch (error) {
    console.error("[Swap Error] Buying failed:", error.message);
  }
}

// Swap Token → BNB
async function swapTokensForBNB(router, amountInTokens, amountOutMin, tokenAddress, toAddress, signer) {
  try {
    const token = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
    const allowance = await token.allowance(await signer.getAddress(), router.address);

    if (allowance.lt(amountInTokens)) {
      console.log(`[Allowance] Low. Approving ${ethers.utils.formatEther(amountInTokens)} tokens`);
      const approveTx = await token.approve(router.address, amountInTokens);
      console.log(`[Approve Tx] Hash: ${approveTx.hash}`);
      await approveTx.wait();
      console.log("[Approval Success] Token approved");
    } else {
      console.log("[Allowance] Sufficient. No approval needed.");
    }

    const path = [tokenAddress, "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"];
    const deadline = Math.floor(Date.now() / 1000) + 600;

    const tx = await router.swapExactTokensForETH(
      amountInTokens,
      amountOutMin,
      path,
      toAddress,
      deadline
    );
    console.log(`[Swap Tx] Token -> BNB Hash: ${tx.hash}`);
    await tx.wait();
    console.log("[Swap Success] Token → BNB confirmed");
  } catch (error) {
    console.error("[Swap Error] Selling failed:", error.message);
  }
}

module.exports = {
  createRouter,
  swapBNBForTokens,
  swapTokensForBNB
};
