import { ethers } from "ethers";
import abi from "../abis/abi.json";

function connectContract() {
  //Note: Your contractAddress will start with 0x, delete everything between the quotes and paste your contract address.
  let rsvpContract;
  const contractAddress = "0x41c53E1A625C5A97c5b55e639A9b92FbB65E7fFD";
  const contractABI = abi;
  try {
    const { ethereum } = window;

    if (ethereum) {
      //checking for eth object in the window
      const provider = new ethers.providers.Web3Provider(ethereum as object);
      const signer = provider.getSigner();
      rsvpContract = new ethers.Contract(contractAddress, contractABI, signer); // instantiating new connection to the contract
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log("ERROR:", error);
  }
  return rsvpContract;
}

export default connectContract;