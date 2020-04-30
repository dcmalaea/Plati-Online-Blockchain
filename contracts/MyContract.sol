pragma solidity >=0.4.21 <0.7.0;

contract MyContract {

    mapping(address => int) public balances;

    function getBalance() public view returns(int)  {

        return balances[msg.sender];
    }

    function deposit(int ammount) public {

        balances[msg.sender] += ammount;
    }

    function spend(int ammount) public{

        balances[msg.sender] -= ammount;
    }
}
