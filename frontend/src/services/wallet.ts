import { ethers } from "ethers";


const COSTON2 = {
    chainId: "0x72",
    chainName: "Flare Coston2 Testnet",
    nativeCurrency:{
        name:"Coston2 FLR",
        symbol:"C2FLR",
        decimals:18
    },
    rpcUrls:[
        "https://coston2-api.flare.network/ext/C/rpc",
        "https://flare-testnet-coston2.rpc.thirdweb.com"
    ],
    blockExplorerUrls:[
        "https://coston2-explorer.flare.network"
    ]
};



export async function getProvider(){


if(!window.ethereum){

throw new Error(
"MetaMask not detected"
);

}


return new ethers.BrowserProvider(
window.ethereum
);


}



export async function connectWallet(){

if(!window.ethereum){

window.open(
"https://metamask.app.link/dapp/" + window.location.host,
"_blank"
);

throw new Error(
"Opening MetaMask..."
);

}



// switch network

try{

await window.ethereum.request({

method:"wallet_switchEthereumChain",

params:[
{
chainId:COSTON2.chainId
}
]

});


}

catch(error:any){


if(error.code === 4902){


await window.ethereum.request({

method:"wallet_addEthereumChain",

params:[
COSTON2
]

});


}

}




const provider =
new ethers.BrowserProvider(
window.ethereum
);



await provider.send(
"eth_requestAccounts",
[]
);



return provider;


}