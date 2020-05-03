import React, { Component } from "react";
import MyContract from "./build/MyContract.json";
import getWeb3 from "./getWeb3";
import FormFactura from './FormFactura/FormFactura'
import Balance from './Balance/Balance'
import RegisterForm from './RegisterForm/RegisterForm'
import Button from '@material-ui/core/Button';
import Menu from './Menu/Menu'

import "./App.css";

class App extends Component {
  state = { balance: 0,companyName:null,clientName:null, web3: null, accounts: null, contract: null};

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

      /**
       * La fiecare schimbare a contractului, sa rulezi:
       *    truffle migrate --network kovan --reset
       * 
       * Si sa copiezi contract address-ul aferent contractului modificat aici!
       */
      instance.options.address = "0x41915e470eabB04e793b4680F1A83818D75bbddF"

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
    const balance = await contract.methods.getBalance().call({ from: accounts[0] });
    const clientName = await contract.methods.getClientName().call({ from: accounts[0] });
    const companyName = await contract.methods.getCompanyName().call({ from: accounts[0] });
    this.setState({ balance: balance,clientName: clientName,companyName: companyName });
  }

  submitClientName = async(name)=>{
    const { accounts, contract } = this.state;
    await contract.methods.associateAccountWithUser(name).send({ from: accounts[0] });
    const response = await contract.methods.getClientName().call({ from: accounts[0] });
    this.setState({ clientName: response });
  }
  submitCompanyName = async(name)=>{
    const { accounts, contract } = this.state;
    await contract.methods.associateAccountWithCompany(name).send({ from: accounts[0] });
    const response = await contract.methods.getCompanyName().call({ from: accounts[0] });
    this.setState({ companyName: response });
  }

  deposit = async (value)=>{ 
    const { accounts, contract } = this.state;
    await contract.methods.deposit(value).send({ from: accounts[0] });
    const response = await contract.methods.getBalance().call({ from: accounts[0] });
    this.setState({ balance: response });
  }

  findBill = async (value)=>{
    const { accounts, contract } = this.state;
    const response = await contract.methods.getBillInfo(value).call({ from: accounts[0] });
    return response;
  }

  registerBill = async(billCode,billSum,name)=>{
    const { accounts, contract } = this.state;
    await contract.methods.registerBill(billCode,billSum,name).send({ from: accounts[0] });
  }

  payBill = async(billCode)=>{
    const { accounts, contract } = this.state;
    await contract.methods.payBill(billCode).send({ from: accounts[0] });
    const balance = await contract.methods.getBalance().call({ from: accounts[0] });
    this.setState({ balance: balance });
  }



  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">

          {/* <div className="floatRight">
            <Balance deposit={this.deposit} storageValue={this.state.balance}></Balance>
          </div> */}
          <div className="flexSpreadAround">
            <RegisterForm companyName={this.state.companyName}
                        clientName={this.state.clientName}
                        submitClientName={this.submitClientName}
                        submitCompanyName={this.submitCompanyName}></RegisterForm>
            {
              this.state.clientName||this.state.companyName?
              <Menu clientName={this.state.clientName} 
                    companyName={this.state.companyName}
                    findBill={this.findBill}
                    registerBill={this.registerBill}
                    payBill={this.payBill}
                    />
              :<div></div>
            }
            {
              this.state.clientName?
              <Balance deposit={this.deposit} storageValue={this.state.balance}></Balance>
              :<div></div>
            }
          </div>
      </div> 
    );
  }
}

export default App;
