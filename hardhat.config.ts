import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";


const config: HardhatUserConfig = {

  solidity: {
    version: "0.8.20",
    settings:{
      optimizer:{
        enabled:true,
        runs:200
      }
    }
  },


  networks: {

    coston2:{
      url:
      process.env.COSTON2_RPC || "",
      
      accounts:
      process.env.PRIVATE_KEY
      ? [process.env.PRIVATE_KEY]
      : []
    }

  }

};


export default config;