const Web3 = require("web3");
const config = require('./config.js');

const NODE_IP = "http://3.85.89.119:8545";
//const NODE_IP = "http://localhost:8545";
const TARGET_ADD = "0xB25DFB4EF6394B768c7B952FdBa636D369F5b212";
//const TARGET_ADD = "0xd134de438c55bc325d1bf889918f57bb2fcc30b0"
const TARGET_PRIVATE_KEY = "0x56d16854b280a47a4fc6aed7e798eedec6cb4f848d28b8b15a3a347260786fa2"
const CONTRACTADDRESS = "0x889100eE9b1cA7EF7c46Df9195cA5Fb978C69863";


/*CURL para recuperar datos:
curl --data '{"method":"eth_call","params":[{"from":"0x002db24c08ed9397bc77a554e55f80d56be7b15f","to":"0x4fd3910647AC9609330C397cCA914de2F0B1c913","data":"0xc19d93fb"}],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST http://3.85.89.119:8545
*/
const testContract = function () {
    let web3 = new Web3(new Web3.providers.HttpProvider(NODE_IP));
    let transactions = [];
    var contadorContract = new web3.eth.Contract(config.abi);
    contadorContract.options.address = CONTRACTADDRESS;
    let WaitingTransaction = function (_nonce) {
        return new Promise((resolve, reject) => {
            web3.eth.accounts.signTransaction({
                to: CONTRACTADDRESS,
                gasPrice: 0,
                gas: 4500000,
                nonce: _nonce,
                data: contadorContract.methods.increment().encodeABI(),
                chainId: "0x2323"
            },TARGET_PRIVATE_KEY).then((tx)=>{
                web3.eth.sendSignedTransaction(tx.rawTransaction).on('transactionHash', function (hash) {
                }).on('receipt', function (receipt) {
                    resolve(receipt);
                })
            })
        })
    }
    web3.eth.getTransactionCount(TARGET_ADD).then((_nonce)=>{
        let start = Date.now();
        for (i = 0; i < process.env.N; i++) {
            let startingNonce = _nonce;
            transactions.push(WaitingTransaction(startingNonce + i))
        }
        Promise.all(transactions).then((receipt) => {
            console.log(receipt)
            console.log("Starting nonce of account:",_nonce)
            console.log("Processing time:",Date.now()-start)
        })
    })
}

testContract();

