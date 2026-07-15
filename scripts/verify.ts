import {run} from "hardhat";


async function main(){


await run(
"verify:verify",
{
address:"CONTRACT_ADDRESS",
constructorArguments:[
]
}
);


}


main();