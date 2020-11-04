const sor = require('@balancer-labs/sor');
const BigNumber = require('bignumber.js');
const ethers = require('ethers');

const MAX_UINT = ethers.constants.MaxUint256;

const swaps = async (tokenIn, tokenOut, amount) => {
    const data = await sor.getPoolsWithTokens(tokenIn, tokenOut);

    const poolData = sor.parsePoolData(data.pools, tokenIn, tokenOut);

    const sorSwaps = sor.smartOrderRouter(
        poolData,
        'swapExactIn',
        new BigNumber(amount),
        new BigNumber('20'),
        0
    );

    const swaps = sor.formatSwapsExactAmountIn(sorSwaps, MAX_UINT, 0);
    const expectedOut = sor.calcTotalOutput(swaps, poolData);

    return expectedOut;

}

module.exports = { swaps }
