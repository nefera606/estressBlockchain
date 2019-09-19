const Web3 = require("web3");

const NODE_IP = "http://localhost:8545";
const NUM_ACCOUNTS = 10;
const TX_PER_ACCOUNT = 100;
const TARGET_ADD = "0x3a2940cfbd93ab421756958e61ef27c08cb5801b";

const TRANSACTION = {
    to: "",
    gasPrice: 0,
    gas: "22000",
    value: "100",
    nonce: 0,
    chainId: "1"
}

const main = function () {
    let web3 = new Web3(new Web3.providers.HttpProvider(NODE_IP));
    let wallets = [];
    let transactions = [];
    for (let index = 0; index < NUM_ACCOUNTS; index++) {
        let wallet = web3.eth.accounts.create();
        wallets.push(wallet);
    }
    wallets.forEach((wallet) => {
        web3.eth.sendTransaction({ from: "0x4f453267e512e22af905bb683fc6bc382d8168a5", to: wallet.address, value: 1000000000 }, (e, r) => {
            console.log(r)
            let tx = TRANSACTION;
            tx.to = TARGET_ADD;
            for (let index = 0; index < TX_PER_ACCOUNT; index++) {
                tx.nonce = index;
                web3.eth.accounts.signTransaction(tx, wallet.privateKey.toString(), (e, r) => {
                    console.log(r);
                    transactions.push(r.rawTransaction);
                })
            }
        })
    })
    transactions.forEach((tx) => {
        web3.eth.sendSignedTransaction(tx, (e, r) => {
            console.log(e);
        });
    })
}


main();



