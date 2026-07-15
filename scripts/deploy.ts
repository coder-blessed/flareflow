import { ethers } from "hardhat";


async function main(){


const [deployer] =
await ethers.getSigners();


console.log(
"Deploying from:",
deployer.address
);



//
// Deploy FXRP
//

const MockFAsset =
await ethers.getContractFactory(
"MockFAsset"
);


const fxrp =
await MockFAsset.deploy(
"Flare Test XRP",
"FXRP"
);


await fxrp.waitForDeployment();



console.log(
"FXRP:",
await fxrp.getAddress()
);





//
// Deploy FBTC
//

const fbtc =
await MockFAsset.deploy(
"Flare Test BTC",
"FBTC"
);


await fbtc.waitForDeployment();


console.log(
"FBTC:",
await fbtc.getAddress()
);





//
// XRP Vault
//

const Vault =
await ethers.getContractFactory(
"MockYieldVault"
);



const xrpVault =
await Vault.deploy(
await fxrp.getAddress(),
"FlareFlow XRP Growth Vault",
14
);



await xrpVault.waitForDeployment();


console.log(
"XRP Vault:",
await xrpVault.getAddress()
);





//
// BTC Vault
//

const btcVault =
await Vault.deploy(
await fbtc.getAddress(),
"FlareFlow BTC Growth Vault",
12
);



await btcVault.waitForDeployment();


console.log(
"BTC Vault:",
await btcVault.getAddress()
);





//
// Router
//

const Router =
await ethers.getContractFactory(
"VaultRouter"
);


const router =
await Router.deploy();



await router.waitForDeployment();


console.log(
"Router:",
await router.getAddress()
);



await router.addVault(
    await xrpVault.getAddress(),
    "FlareFlow XRP Vault"
);


await router.addVault(
    await btcVault.getAddress(),
    "FlareFlow BTC Vault"
);


console.log("Vaults added");
}



main()
.catch(
(error)=>{
console.error(error);
process.exitCode=1;
});