import {ethers} from "ethers";

import ABI from "../contracts/MockFAsset.json";

import {
CONTRACTS
}
from "../contracts/addresses";



async function getSigner(){


if(!window.ethereum){

throw new Error(
"MetaMask not found"
);

}


const provider =
new ethers.BrowserProvider(
window.ethereum
);


return provider.getSigner();


}



export async function faucetFXRP(){


const signer =
await getSigner();



const contract =
new ethers.Contract(

CONTRACTS.FXRP,

ABI.abi,

signer

);



const tx =
await contract.faucet();


await tx.wait();


}




export async function faucetFBTC(){


const signer =
await getSigner();



const contract =
new ethers.Contract(

CONTRACTS.FBTC,

ABI.abi,

signer

);



const tx =
await contract.faucet();


await tx.wait();


}