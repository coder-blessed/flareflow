// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract FlareFlowToken is ERC20, Ownable {


    uint256 public maxSupply;


    constructor()
        ERC20(
            "FlareFlow Governance Token",
            "FLOW"
        )
        Ownable(msg.sender)
    {

        maxSupply = 100000000 ether;

        _mint(
            msg.sender,
            maxSupply
        );

    }



    function mint(
        address to,
        uint256 amount
    )
    external
    onlyOwner
    {

        require(
            totalSupply()+amount <= maxSupply,
            "Max supply reached"
        );


        _mint(
            to,
            amount
        );

    }


}