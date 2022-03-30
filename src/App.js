import { useState } from 'react';
import { ethers } from 'ethers';
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import './App.css';

const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";


function App() {

  //Property Variables
  const [message, setMessage] = useState("");
  //Helper functions

  //Request access to the user's Metamask account
  //https://metamask.io/
  async function requestAccount() {
    await window.ethereum.request( { method: 'eth_requestAccounts'});
  }

  //fetches current value store of 'greeting' in the smart contract
  async function fetchGreeting() {
    //if metmask exists
    if (typeof window.ethereum !== undefined) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);
      try {
        //call Greeter.greet()
        /*

        function greet() public view returns (string memory) {
          return greeting;
        }

        */
        const data = await contract.greet()
        console.log("Greeting: ", data);
      } catch (error) {
        console.log('Error: ', error);
      }
    }
  }

  async function setGreeting() {
    if (!message) return;

    //If Metamask exists
    if (typeof window.ethereum !== "undefined") {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      //Create contract with signer
      /*
        function setGreeting(string memory _greeting) public {
          console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
          greeting = _greeting;
        }
      */
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(message);

      setMessage("");
      await transaction.wait();
      fetchGreeting();
    }
  }

    return (
      <div className = "App">
        <div className='App Header'>
          <div className='description'>
            <h1>Greeter.sol</h1>
            <h3>Full stack app using ReactJs and Hardhat</h3>
          </div>
          <div className='custom-buttons'>
            <button
            onClick={fetchGreeting}
            style={{backgroundColor: 'green'}}>Fetch Greeting</button>
            <button
            onClick={setGreeting}
            style={{backgroundColor: 'red'}}>Set Greeting</button>
          </div>
        <input
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        placeholder='Set Greeting Message'/>
        </div>
      </div>
    );
}

export default App;