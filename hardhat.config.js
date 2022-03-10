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


task("sendDonat", " Send some money to this Fund")
    .addParam("address", "Yoy want to send on this contract address")
    .addParam("amount", " The amount of donation")
    .setAction(async (taskArgs)=>{
      const provider = new ethers.providers.InfuraProvider("rinkeby", INFURA_URL)
      const MyContract = await ethers.getContractFactory("Funding");
      const wallet = new ethers.Wallet(PRIVATE_KEY, provider)

      console.log( taskArgs.amount)
      const contract = await MyContract.attach(
        taskArgs.address // The deployed contract address
      );
        await contract.sendDonation({value: ethers.utils.parseUnits(`${taskArgs.amount}`, "ether")})
   console.log(`Contract balance ${await ethers.provider.getBalance(taskArgs.address)}`);

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
  .setAction(async (taskArgs) => {
    const provider = new ethers.providers.InfuraProvider("rinkeby", INFURA_URL)
    const MyContract = await ethers.getContractFactory("Funding");
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
    const contract = await MyContract.attach(taskArgs.address);
    const balance = await ethers.provider.getBalance(taskArgs.address)
    console.log(ethers.utils.formatEther(balance), "ETH")
    console.log(taskArgs.sendto.address)
    await contract.transferFund(taskArgs.sendto, ethers.utils.parseUnits(`${taskArgs.amount}`, "ether"))
    console.log(ethers.utils.formatEther(balance), "ETH")

  });





