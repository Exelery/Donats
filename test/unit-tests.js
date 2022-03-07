const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Funding contract", function () {

    let Funding;
  let hardhatFunding;
  let owner;
  let addr1;
  let addr2;
  let addr3;

  


  this.beforeEach(async function() {
    
        [owner, addr1, addr2, addr3] = await ethers.getSigners();

        Funding = await ethers.getContractFactory("Funding");

        hardhatFunding = await Funding.deploy();

        await hardhatFunding.deployed();

    });

    describe("Deployment", function() {

        it("Should set the right owner", async function (){
            expect(await hardhatFunding.owner()).to.equal(owner.address);
        });
    });


    describe("Transactions", function(){

        it("should accept donations from the donators", async () => {
             await hardhatFunding.connect(addr1).sendDonation({ value: ethers.utils.parseEther('0.01')});
             await hardhatFunding.connect(addr2).sendDonation({ value: ethers.utils.parseEther('0.01')});
            
            expect( await hardhatFunding.showBalance()).to.equal(ethers.utils.parseEther('0.02'));
            console.log(await hardhatFunding.showBalance());
            
        });
        it("should change the balance of address",  async () =>{
            await hardhatFunding.connect(addr2).sendDonation({ value: ethers.utils.parseEther('0.01')});
 //           expect( await hardhatFunding.connect(addr2).fundsPerDonator(addr2.address)).to.equal(9999);
             expect(await hardhatFunding.connect(addr2).sendDonation({ value: ethers.utils.parseEther('0.01')})).to.changeEtherBalance(addr2, ethers.utils.parseEther('-0.01'));
            console.log(" Balance:", await hardhatFunding.connect(addr2).fundsPerDonator(addr2.address));
            //await done();
        });

        it(" Should be unique address", async() => {
            await hardhatFunding.connect(addr1).sendDonation({ value: ethers.utils.parseEther('0.01')});
            await hardhatFunding.connect(addr1).sendDonation({ value: ethers.utils.parseEther('1')});
            await hardhatFunding.connect(addr2).sendDonation({ value: ethers.utils.parseEther('1')});
            await hardhatFunding.connect(addr2).sendDonation({ value: ethers.utils.parseEther('1')});
            console.log(await hardhatFunding.getDonators());
            expect(await hardhatFunding.getDonators()).to.eql([addr1.address, addr2.address]);

        });

        it("there must be correct contributions for the address", async() => {
            await hardhatFunding.connect(addr1).sendDonation({ value: ethers.utils.parseEther('0.01')});
            await hardhatFunding.connect(addr2).sendDonation({ value: ethers.utils.parseEther('1')});
            await hardhatFunding.connect(addr1).sendDonation({ value: ethers.utils.parseEther('1')});            
            await hardhatFunding.connect(addr2).sendDonation({ value: ethers.utils.parseEther('0.4')});
            expect(await hardhatFunding.fundsPerDonator(addr2.address)).to.equal(ethers.utils.parseEther('1.4'));
            console.log("Address 2:", await  hardhatFunding.fundsPerDonator(addr2.address));
            console.log("Address 1:", await hardhatFunding.fundsPerDonator(addr1.address));
        });

        it("Should be revert if Address doesn't send donats", async () => {
            await hardhatFunding.connect(addr2).sendDonation({ value: ethers.utils.parseEther('1')});
            await expect( hardhatFunding.connect(addr3).fundsPerDonator(addr3.address,)
            ).to.be.revertedWith("This address has not made contributions");
        });

        
    });

    describe("Winthdaw and access to withdraw", function() {
        it("Should fall if not owner withdraw funds", async() => {
            await hardhatFunding.connect(addr2).sendDonation({ value: ethers.utils.parseEther('1')});
            await expect( hardhatFunding.connect(addr1).transferFund(addr2.address,ethers.utils.parseEther('1'))
            ).to.be.revertedWith("You are not an owner");
        });

        it("Should withdraw funds correct request", async()=> {
            await hardhatFunding.connect(addr2).sendDonation({ value: ethers.utils.parseEther('1')});
            console.log("address 3 balance before",await addr3.getBalance());
            console.log("balance before",await hardhatFunding.showBalance());
            expect(await hardhatFunding.transferFund(addr3.address,ethers.utils.parseEther('1'))).to.changeEtherBalance(addr3, ethers.utils.parseEther('1'));
            console.log("address 3 balance after",await addr3.getBalance());
            expect(await hardhatFunding.showBalance()).to.equal(0);
            console.log("balance after",await hardhatFunding.showBalance());
        });
        
        it("Should withdraw funds incorrect request", async()=> {
            await hardhatFunding.connect(addr2).sendDonation({ value: ethers.utils.parseEther('1')});
            console.log("balance before",await hardhatFunding.showBalance());
            expect(await hardhatFunding.transferFund(addr3.address,ethers.utils.parseEther('10'))).to.changeEtherBalance(addr3, ethers.utils.parseEther('1'));
            expect(await hardhatFunding.showBalance()).to.equal(0);
        });

        it("check zero balance", async()=> {
            console.log("balance before",await hardhatFunding.showBalance());
            await expect( hardhatFunding.transferFund(addr3.address,ethers.utils.parseEther('10'))).to.be.revertedWith("There is no money");

        });
        

     //   it("")
    });




});