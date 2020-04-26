import React, { Component } from "react";
import MyContract from "./build/MyContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MyContract.networks[networkId];
      const instance = new web3.eth.Contract(
        MyContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      instance.options.address = "0x57266B7C5d3e1c42ac46A2417DFd4e293cc512b2"

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance },this.start);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  start =  async () =>{
    const { accounts, contract } = this.state;
    const response = await contract.methods.get().call();
    this.setState({ storageValue: response });
  }

  // runExample = async () => {
  //   const { accounts, contract } = this.state;

  //   // Stores a given value, 5 by default.
  //   await contract.methods.set("hello").send({ from: accounts[0] });

  //   // Get the value from the contract to prove it worked.
  //   const response = await contract.methods.get().call();

  //   // Update state with the result.
  //   this.setState({ storageValue: response });
  // };

  deposit = async (value)=>{ 
    const { accounts, contract } = this.state;
    await contract.methods.deposit(value).send({ from: accounts[0] });
    const response = await contract.methods.get().call();
    this.setState({ storageValue: response });
  }

  spend = async (value)=>{
    const { accounts, contract } = this.state;
    await contract.methods.spend(value).send({ from: accounts[0] });
    const response = await contract.methods.get().call();
    this.setState({ storageValue: response });
  }
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of "hello" (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <span>Value : {this.state.storageValue}</span>
        {/* <label for="input"></label> */}
        <input type="number" name="input" id="inputValue"/>
        <button onClick={()=>{
          let value = document.getElementById("inputValue").value;
          this.deposit(value);
        }}>Deposit</button>
        <button onClick={()=>{
          this.spend(300);
        }}>Pay</button>
      </div>
    );
  }
}

export default App;
