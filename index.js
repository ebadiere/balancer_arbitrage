const sor = require('@balancer-labs/sor');
const BigNumber = require('bignumber.js');
const ethers = require('ethers');


const MAX_UINT = ethers.constants.MaxUint256;

// MAINNET
const tokenIn = '0x6B175474E89094C44Da98b954EedeAC495271d0F' // DAI
const tokenOut = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' // WETH

const swaps = async () => {
    const data = await sor.getPoolsWithTokens(tokenIn, tokenOut);

    const poolData = sor.parsePoolData(data.pools, tokenIn, tokenOut);

    const sorSwaps = sor.smartOrderRouter(
        poolData,
        'swapExactIn',
        new BigNumber('10000000000000000000'),
        new BigNumber('10'),
        0
    );

    const swaps = sor.formatSwapsExactAmountIn(sorSwaps, MAX_UINT, 0);

    const expectedOut = sor.calcTotalOutput(swaps, poolData);
    console.log(`Expected output: ${expectedOut}`);

}

swaps();


