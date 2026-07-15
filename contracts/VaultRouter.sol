// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;


import "./MockYieldVault.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title VaultRouter
 * @notice Main entry point for FlareFlow
 *
 * Routes user deposits
 * into the best yield vault.
 */
contract VaultRouter {


    struct Vault {

        address vaultAddress;

        string name;

        bool active;

    }



    mapping(
        uint256 => Vault
    )
    public vaults;



    uint256 public vaultCount;



    mapping(
        address => mapping(uint256=>uint256)
    )
    public userDeposits;



    /**
     * Add vault strategy
     */
    function addVault(
        address vaultAddress,
        string memory name
    )
        external
    {

        vaults[vaultCount] =
            Vault(
                vaultAddress,
                name,
                true
            );


        vaultCount++;

    }



    /**
     * Deposit into selected vault
     */
    function deposit(
uint256 vaultId,
uint256 amount
)
external
{

Vault memory vault =
vaults[vaultId];


require(
vault.active,
"inactive"
);


IERC20 asset =
IERC20(
MockYieldVault(vault.vaultAddress).asset()
);


asset.transferFrom(
msg.sender,
address(this),
amount
);


asset.approve(
vault.vaultAddress,
amount
);


MockYieldVault(
vault.vaultAddress
)
.deposit(amount);


userDeposits[msg.sender][vaultId]+=amount;


}

    /**
     * Withdraw from vault
     */
    function withdraw(
        uint256 vaultId,
        uint256 amount
    )
        external
    {

        Vault memory vault =
            vaults[vaultId];


        MockYieldVault(
            vault.vaultAddress
        )
        .withdraw(amount);



        userDeposits[msg.sender][vaultId]
            -= amount;

    }



    function getVault(
        uint256 id
    )
        external
        view
        returns(
            address,
            string memory,
            bool
        )
    {

        Vault memory vault =
            vaults[id];


        return(
            vault.vaultAddress,
            vault.name,
            vault.active
        );

    }


}