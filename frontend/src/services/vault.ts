import {ethers} from "ethers";

import VaultABI from "../contracts/MockYieldVault.json";

import TokenABI from "../contracts/MockFAsset.json";


async function getSigner(){

const provider =
new ethers.BrowserProvider(
window.ethereum
);


return provider.getSigner();

}




export async function deposit(
token:string,
vault:string,
amount:string
){


const signer =
await getSigner();



const tokenContract =
new ethers.Contract(
token,
TokenABI.abi,
signer
);



const vaultContract =
new ethers.Contract(
vault,
VaultABI.abi,
signer
);



const value =
ethers.parseEther(amount);



const approve =
await tokenContract.approve(
vault,
value
);


await approve.wait();



const tx =
await vaultContract.deposit(
value
);


await tx.wait();

}




export async function withdraw(
vault:string,
amount:string
){


const signer =
await getSigner();



const vaultContract =
new ethers.Contract(
vault,
VaultABI.abi,
signer
);



const tx =
await vaultContract.withdraw(
ethers.parseEther(amount)
);



await tx.wait();

}






export async function getVaultBalance(
vault:string,
user:string
){


const provider =
new ethers.BrowserProvider(
window.ethereum
);



const contract =
new ethers.Contract(
vault,
VaultABI.abi,
provider
);



const balance =
await contract.getBalance(user);



return ethers.formatEther(balance);

}






export async function getVaultEarnings(
vault:string,
user:string
){


const provider =
new ethers.BrowserProvider(
window.ethereum
);



const contract =
new ethers.Contract(
vault,
VaultABI.abi,
provider
);



const earned =
await contract.earned(user);



return ethers.formatEther(earned);


}