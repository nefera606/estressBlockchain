const Web3 = require("web3");
const config = require('./config.js');
const NODE_IP = "http://3.85.89.119:8545";
//const NODE_IP = "http://localhost:8545";
const TARGET_ADD = "0x002db24c08ed9397bc77a554e55f80d56be7b15f";
//const TARGET_ADD = "0xd134de438c55bc325d1bf889918f57bb2fcc30b0"

let web3 = new Web3(new Web3.providers.HttpProvider(NODE_IP));
var contadorContract = new web3.eth.Contract(config.abi);
web3.eth.personal.unlockAccount(TARGET_ADD, "").then(() => {
    var contador = contadorContract.deploy({
        data: config.bin, 
    }).send(
        {
            from: TARGET_ADD,
            gas: '4700000',
            gasPrice: '0'
        }).
        on("receipt", (recipt) => {
            console.log(recipt)
        }).
        then(function (newContractInstance) {
            console.log("Contract contador address: ",newContractInstance.options.address) // instance with the new contract address
            web3.eth.personal.unlockAccount(TARGET_ADD, "").then(
                newContractInstance.methods.get().call().then((e) => {
                    console.log(e);
                }).catch((e) => { console.log(e) })
            );
        });
})
