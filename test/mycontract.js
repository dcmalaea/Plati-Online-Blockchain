const MyContract = artifacts.require("./MyContract.sol");

contract("MyContract", accounts => {
  it("...should store the value 800.", async () => {
    const MyContractInstance = await MyContract.deployed();

    // Set value of 89
    await MyContractInstance.deposit(300, { from: accounts[0] });

    // Get stored value
    const storedData = await MyContractInstance.get.call();

    assert.equal(storedData, 800, "The value myValue was not stored.");
  });
});
