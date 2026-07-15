import {
createContext,

useState
} from "react";


import {ethers} from "ethers";


export const WalletContext =
createContext<any>(null);



export function WalletProvider(
{children}:any
){


const [account,setAccount]=useState("");



async function connect(){


const provider =
new ethers.BrowserProvider(
window.ethereum
);


const accounts =
await provider.send(
"eth_requestAccounts",
[]
);


setAccount(
accounts[0]
);


}



return (

<WalletContext.Provider
value={{
account,
connect
}}
>

{children}

</WalletContext.Provider>

);


}