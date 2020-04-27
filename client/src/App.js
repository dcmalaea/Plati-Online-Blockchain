import React, { Component } from "react";
import MyContract from "./build/MyContract.json";
import getWeb3 from "./getWeb3";
import FormFactura from './FormFactura/FormFactura'
import Balance from './Balance/Balance'

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
      instance.options.address = "0x15E88F50c10FEBdECFdA45db39631Fb6e88F79B1"

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

          <div className="floatRight">
            <Balance deposit={this.deposit} storageValue={this.state.storageValue}></Balance>
          </div>
          <FormFactura spend={this.spend}/>
      </div>
    );
  }
}

export default App;
