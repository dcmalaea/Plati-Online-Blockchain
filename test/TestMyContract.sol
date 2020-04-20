pragma solidity >=0.4.21 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/MyContract.sol";

contract TestMyContract {

  function testItStoresAValue() public {
    MyContract MyContract = MyContract(DeployedAddresses.MyContract());

    MyContract.set('myValue');

    string memory expected = 'myValue';

    Assert.equal(MyContract.get(), expected, "It should store the value myValue.");
  }

}
