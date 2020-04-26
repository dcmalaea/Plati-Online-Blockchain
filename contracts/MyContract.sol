pragma solidity >=0.4.21 <0.7.0;

contract MyContract {

int value;

  constructor() public {
      value = 500;
  }




  function get() public view returns(int){
      return value;
  }

  function deposit(int amt) public{

      value = value + amt;
  }
  function spend(int amt) public{

      value = value - amt;
  }

}
