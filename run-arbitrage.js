require("dotenv").config();
const { legos } = require("@studydefi/money-legos");
const Web3 = require('web3');
const { ChainId, Fetcher, TokenAmount } = require('@uniswap/sdk');

const { mainnet: addresses } = require('./addresses');

const web3 = new Web3(
    new Web3.providers.WebsocketProvider(process.env.GETH_URL)
);
const { address: admin } = web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);

const ONE_WEI = web3.utils.toBN(web3.utils.toWei('1'));
const AMOUNT_WETH_WEI = web3.utils.toBN(web3.utils.toWei('100'));
const DIRECTION = {
    BALANCER_TO_UNISWAP: 0,
    UNISWAP_TO_BALANCER: 1
};

async function ethEighteenDec(ethPrice, ticker, tokenAddress) {

}

const init = async () => {
    const networkId = await web3.eth.net.getId();
    console.log(`Hello balancer`);
}

init();
