const MyContract = artifacts.require("./MyContract.sol");

contract("MyContract", accounts => {
  it("...should store the value myValue.", async () => {
    const MyContractInstance = await MyContract.deployed();

    // Set value of 89
    await MyContractInstance.set("myValue", { from: accounts[0] });

    // Get stored value
    const storedData = await MyContractInstance.get.call();

    assert.equal(storedData, "myValue", "The value myValue was not stored.");
  });
});
