import { useState } from 'react';
import { ethers } from 'ethers';

// import ABI
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import './App.css';

const greeterAddress = "0x06A9e60a451C041C195907144B1DaAa030797a07";

function App() {
    //Property Variables
    const [message, setMessage] = useState("");

    //Helper Functions

    //Requests access to user's metamask account
    //https://metamask.io/
    async function requestAccount() {
      await window.ethereum.request( {method: 'eth_requestAccounts'});
    }

    //Fetches the greeting from the smart contract
    async function fetchGreeting() {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);
        try {
          //call Greeter.greet()
          const data = await contract.greet();
          console.log('Data: ', data);
        } catch (error) {
          console.log('Error: ', error);
        }
      }
    }

    async function setGreeting() {
      if (!message) return;

      // if metamask exists
      if (typeof window.ethereum !== "undefined") {
        await requestAccount();

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        //create contract with signer
        const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
        const transaction = await contract.setGreeting(message);
        setMessage("")
        await transaction.wait();
        fetchGreeting();
      }
    }

    //Return
    return (
      <div className = "App">
        <div className="App-header">
          {/* DESCRIPTION */}
          <div className='description'>
            <h1>Greeter.sol</h1>
            <h3>Full Stack DApp using ReactJS and Hardhat</h3>
          </div>
          {/* BUTTONS - Fetch and Set */}
          <div className="custom-buttons">
            <button

            onClick={fetchGreeting}

            style={{ backgroundColor: 'green'}}>Fetch Greeting</button>
            <button

            onClick={setGreeting}

            style={{backgroundColor: 'red'}}>Set Greeting</button>
          </div>
          {/* INPUT TEXT - String */}
          <input
            //connecting helper functions to event listeners
            // on change events for the input text
            onChange={(e) => setMessage(e.target.value)}
            value = {message}
            placeholder='Set Greeting Message'
          />
        </div>
      </div>
    );
}

export default App;