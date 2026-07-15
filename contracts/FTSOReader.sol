// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


interface IFtsoRegistry {

    function getCurrentPrice(
        string calldata symbol
    )
    external
    view
    returns(
        uint256 price,
        uint256 timestamp
    );

}


contract FTSOReader {


    IFtsoRegistry public registry;


    constructor(address _registry){

        registry = IFtsoRegistry(_registry);

    }


    function getBTCPrice()
    external
    view
    returns(uint256){

        (
            uint256 price,

        ) = registry.getCurrentPrice(
            "BTC"
        );

        return price;

    }



    function getXRPPrice()
    external
    view
    returns(uint256){

        (
            uint256 price,

        ) = registry.getCurrentPrice(
            "XRP"
        );

        return price;

    }

}