pragma solidity >=0.4.21 <0.7.0;

contract MyContract {
  string private name;
  uint private age;
  string value;

  constructor() public {
      value = "myValue";
  }

  function setName(string memory newName) public{
      name = newName;
  }

  function getName() public view returns (string memory){
      return name;
  }

  function setAge(uint newAge) public{
      age=newAge;
  }

  function getAge() public view returns (uint){
      return age;
  }

  function get() public view returns(string memory){
      return value;
  }

  function set(string memory _value) public{
      value=_value;
  }

}
