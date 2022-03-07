// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "hardhat/console.sol";

contract Funding  {
    address payable public owner;
    address[] public donators;
    uint public balance;
    mapping(address => uint) values;

  //event Donated(uint donation);
  //event Withdrew(uint amount);

  modifier onlyOwner() {
        require(owner == msg.sender, "You are not an owner");
        _;
    }

  constructor() {
    owner = payable(msg.sender);
  }

  function sendDonation() public payable {
   // if(msg.value < 0.001 ether) {
  //    console.log("It's wei");
  //  }
   //require(msg.value >= .001 ether);
   balance += msg.value;
   if(values[msg.sender] == 0) {
    donators.push(msg.sender);
   }
   console.log("Fund balance is %s ether", balance);
    values[msg.sender] += msg.value;
    
  }

  function transferFund(address payable _to, uint256 _value) external onlyOwner {
    require(balance != 0, "There is no money");
    
    if (_value >= balance) {
    _to.transfer(balance);
    balance = 0;
    }
    else {
      _to.transfer(_value);
      balance -= _value;
    }
    
  }

  function getDonators() public view returns (address[] memory) {
    return donators;
  }

  function showBalance() public view returns (uint ) {
    return balance;
  }


  function fundsPerDonator(address _user) public view returns(uint) {
    require(values[_user] != 0, "This address has not made contributions");
    return values[_user];
  }
}