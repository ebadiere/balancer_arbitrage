require("dotenv").config();
const { legos } = require("@studydefi/money-legos");
const Web3 = require('web3');
const { ChainId, Fetcher, TokenAmount } = require('@uniswap/sdk');
const sor = require("./src/balancer/SorSwaps");

const { mainnet: addresses } = require('./addresses');

const web3 = new Web3(
    new Web3.providers.WebsocketProvider(process.env.GETH_URL)
);
const { address: admin } = web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);

const nodemailer = require('nodemailer');

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

    const amountsToken = await Promise.all([
        wethToken.getOutputAmount(new TokenAmount(weth, AMOUNT_WETH_WEI)),
        sor.swaps(addresses.tokens.weth, tokenAddress, AMOUNT_WETH_WEI.toString())
    ]);

    const tokenFromUniswap = web3.utils.toBN(amountsToken[0][0].raw.toString());
    const tokenFromBalancer = web3.utils.toBN(amountsToken[1]);

    const amountsWeth = await Promise.all([
        wethToken.getOutputAmount(new TokenAmount(token, tokenFromUniswap)),
        sor.swaps(tokenAddress, addresses.tokens.weth, tokenFromBalancer),
    ]);

    const wethFromUniswap = web3.utils.toBN(amountsWeth[0][0].raw.toString());
    const wethFromBalancer = web3.utils.toBN(amountsWeth[1]);

    console.log(`Uniswap -> Balancer. Weth input / ${ticker} output: ${web3.utils.fromWei(AMOUNT_WETH_WEI.toString())} / ${web3.utils.fromWei(wethFromBalancer.toString())}`);
    console.log(`Balancer -> Uniswap. Weth input /  ${ticker} output: ${web3.utils.fromWei(AMOUNT_WETH_WEI.toString())} / ${web3.utils.fromWei(wethFromUniswap.toString())}`);

    if(wethFromUniswap.gt(AMOUNT_WETH_WEI)) {
        arbBalancerToUni(`Found an opportunity wethFromUniswap! ${wethFromUniswap}`);
    }

    if(wethFromBalancer.gt(AMOUNT_WETH_WEI)) {
        arbBalancerToUni(`Found an opportunity wethFromBalancer! ${wethFromBalancer}`);
    }

}

const init = async () => {
    const networkId = await web3.eth.net.getId();

    web3.eth.subscribe('newBlockHeaders')
        .on('data', async block => {
            console.log(`New block received. Block # ${block.number}`);
            await ethEighteenDec( 'Link', addresses.tokens.link);
            // await ethEighteenDec(flashloanKNC, ethPrice, 'KNC', addresses.tokens.knc);
            // await ethNineDecToken(flashloanAmpl, ethPrice, 'Ampl', addresses.tokens.ampl);
            // await ethNineDecToken(flashloanRLC, ethPrice, 'RLC', addresses.tokens.rlc);
        })
        .on('error', error => {
            console.log(error);
        });
}

const arbBalancerToUni = (message) => {
    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ebadiere@gmail.com',
            pass: process.env.EMAIL_PASSWORD
        }
    });

    let mailDetails = {
        from: 'ebadiere@gmail.com',
        to: 'ebadiere@gmail.com',
        subject: 'Test mail',
        text: message
    };

    let info = mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });
    console.log(info);
}


// rename to reverse, and put password in a file.
const arbUniToBalancer = (message) => {
    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ebadiere@gmail.com',
            pass: process.env.EMAIL_PASSWORD
        }
    });

    let mailDetails = {
        from: 'ebadiere@gmail.com',
        to: 'ebadiere@gmail.com',
        subject: 'Test mail',
        text: message
    };

    let info = mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });
    console.log(info);
}


init();
