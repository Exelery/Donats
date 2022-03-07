/**
 * @type import('hardhat/config').HardhatUserConfig
 */

 require("@nomiclabs/hardhat-waffle");
 require("solidity-coverage");
 require("dotenv").config();
 const { task } = require("hardhat/config");
 require("@nomiclabs/hardhat-web3");

 //require("./tasks/tasks");




 
 const API_KEY = process.env.API_KEY
 const PRIVATE_KEY = process.env.PRIVATE_KEY
const INFURA_URL = process.env.INFURA_URL

module.exports = {
  solidity: "0.8.12",
  networks: {
    rinkeby: {
      url: INFURA_URL,
      accounts: [PRIVATE_KEY],
      gas: 2100000,
      gasPrice: 8000000000,
      saveDeployments: true,
    }
  }
  
};

//const hre = require('hardhat'); 
//const { ethers } = hre; 
//const { task } = require("hardhat/config");
//const Funding = require("../artifacts/contracts/Funding.sol/Funding.json")
//const provider = ethers.providers.InfuraProvider("rinkeby", process.env.INFURA_URL)
//const wallet = ethers.Wallet(process.env.PRIVATE_KEY, provider)

//const Balance = async(user) => {
//    return ethers.provider.getBalance(user.address)
//} 

task("sendDonat", " Send some money to this Fund")
    .addParam("address", "Yoy want to send on this contract address")
    .setAction(async (addr,)=>{
      const provider = new ethers.providers.InfuraProvider("rinkeby", INFURA_URL)
      const MyContract = await ethers.getContractFactory("Funding");
      const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
      const contract = await MyContract.attach(
        addr.address // The deployed contract address
      );
        await contract.sendDonation({value: ethers.utils.parseEther(`0.01`)})
   console.log(`Contract balance ${await ethers.provider.getBalance(addr.address)}`);

    })

  task("rBalance", "balance of the conrtact")
    .addParam("address", "The contract address on Rinkeby")
    .setAction(async (taskArgs) => {
      
      const balance = await ethers.provider.getBalance(taskArgs.address)
      console.log(ethers.utils.formatEther(balance), "ETH")
  });


task("getDonators", "Get list of the all donators")
  .addParam("address", "The contract address on Rinkeby")
  .setAction(async (addr) => {
    const provider = new ethers.providers.InfuraProvider("rinkeby", INFURA_URL)
    const MyContract = await ethers.getContractFactory("Funding");
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
    const contract = await MyContract.attach(addr.address);
    console.log("Wallets that have been deposited:",await contract.getDonators())
 });

 task("withdraw", "Withdraw  money to Signer on Rinkeby")
  .addParam("address", "The contract address on Rinkeby")
  .addParam("amount", "How much do you want withdraw")
  .addParam("sendto", "where you want to send")
  .setAction(async (addr, amount, sendTo) => {
    const provider = new ethers.providers.InfuraProvider("rinkeby", INFURA_URL)
    const MyContract = await ethers.getContractFactory("Funding");
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
    const contract = await MyContract.attach(addr.address);
    const balance = await ethers.provider.getBalance(addr.address)
    console.log(ethers.utils.formatEther(balance), "ETH")
    console.log(sentTo.address)
    await contract.transferFund("0xFCc874C64D2200a8271cA8d3018caECDfB5A4ba2", x)
    console.log(ethers.utils.formatEther(balance), "ETH")

  });





