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

async function ethEighteenDec(ticker, tokenAddress) {
    const [weth, token] = await Promise.all(
        [addresses.tokens.weth, tokenAddress].map(tAddress => (
            Fetcher.fetchTokenData(
                ChainId.MAINNET,
                tAddress,
            )
        )));
    const wethToken = await Fetcher.fetchPairData(
        weth,
        token,
    );

}

const init = async () => {
    const networkId = await web3.eth.net.getId();

    web3.eth.subscribe('newBlockHeaders')
        .on('data', async block => {
            console.log(`New block received. Block # ${block.number}`);
            // await ethEighteenDec(flashloan, ethPrice, 'Link', addresses.tokens.link);
            // await ethEighteenDec(flashloanKNC, ethPrice, 'KNC', addresses.tokens.knc);
            // await ethNineDecToken(flashloanAmpl, ethPrice, 'Ampl', addresses.tokens.ampl);
            // await ethNineDecToken(flashloanRLC, ethPrice, 'RLC', addresses.tokens.rlc);
        })
        .on('error', error => {
            console.log(error);
        });
}

init();
