// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



/**
 * @title MockYieldVault
 * @notice FlareFlow simulated yield vault
 *
 * Supports:
 *
 * FXRP
 * FBTC
 *
 * Features:
 *
 * - Deposit FAssets
 * - Withdraw FAssets
 * - Simulated APY rewards
 * - Time based yield calculation
 * - Owner APY management
 *
 * Demo implementation for Flare Coston2
 */
contract MockYieldVault is Ownable {


    using SafeERC20 for IERC20;



    /**
     * @notice Underlying FAsset
     */
    IERC20 public immutable asset;



    /**
     * @notice Vault display name
     */
    string public vaultName;



    /**
     * @notice Annual percentage yield
     *
     * Example:
     *
     * 14 = 14%
     */
    uint256 public apy;



    /**
     * @notice Total assets deposited
     */
    uint256 public totalDeposits;



    /**
     * @notice Seconds in one year
     */
    uint256 public constant YEAR =
        365 days;



    /**
     * @notice User deposited amount
     */
    mapping(address => uint256)
    public deposits;



    /**
     * @notice Timestamp of first deposit
     */
    mapping(address => uint256)
    public depositTime;



    /**
     * @notice Events for frontend tracking
     */
    event Deposited(
        address indexed user,
        uint256 amount
    );


    event Withdrawn(
        address indexed user,
        uint256 amount
    );


    event APYUpdated(
        uint256 newAPY
    );



    constructor(
        address _asset,
        string memory _name,
        uint256 _apy
    )
        Ownable(msg.sender)
    {

        require(
            _asset != address(0),
            "invalid asset"
        );


        asset =
            IERC20(_asset);


        vaultName =
            _name;


        apy =
            _apy;

    }




    /**
     * @notice Deposit FAssets into vault
     *
     * User must approve vault first
     */
    function deposit(
        uint256 amount
    )
        external
    {

        require(
            amount > 0,
            "zero amount"
        );


        asset.safeTransferFrom(
            msg.sender,
            address(this),
            amount
        );


        if(
            depositTime[msg.sender] == 0
        )
        {
            depositTime[msg.sender] =
                block.timestamp;
        }


        deposits[msg.sender]
            += amount;


        totalDeposits
            += amount;



        emit Deposited(
            msg.sender,
            amount
        );

    }





    /**
     * @notice Withdraw deposited assets
     */
    function withdraw(
        uint256 amount
    )
        external
    {

        require(
            deposits[msg.sender] >= amount,
            "insufficient balance"
        );


        deposits[msg.sender]
            -= amount;



        totalDeposits
            -= amount;



        asset.safeTransfer(
            msg.sender,
            amount
        );



        emit Withdrawn(
            msg.sender,
            amount
        );

    }





    /**
     * @notice Calculate simulated yield earned
     *
     * Formula:
     *
     * principal * APY * time / year
     *
     */
    function earned(
        address user
    )
        public
        view
        returns(uint256)
    {


        uint256 principal =
            deposits[user];


        if(
            principal == 0
            ||
            depositTime[user] == 0
        )
        {
            return 0;
        }



        uint256 duration =
            block.timestamp
            -
            depositTime[user];



        return
        (
            principal
            *
            apy
            *
            duration
        )
        /
        (
            100
            *
            YEAR
        );


    }





    /**
     * @notice User deposited balance
     */
    function getBalance(
        address user
    )
        external
        view
        returns(uint256)
    {

        return
            deposits[user];

    }





    /**
     * @notice Returns underlying token
     *
     * Frontend uses this
     */
    function getAsset()
        external
        view
        returns(address)
    {

        return
            address(asset);

    }





    /**
     * @notice Update vault APY
     *
     * Owner only
     */
    function updateAPY(
        uint256 newAPY
    )
        external
        onlyOwner
    {


        apy =
            newAPY;


        emit APYUpdated(
            newAPY
        );

    }





    /**
     * @notice Vault information
     */
    function getVaultInfo()
        external
        view
        returns(
            string memory,
            uint256,
            uint256,
            address
        )
    {

        return(
            vaultName,
            apy,
            totalDeposits,
            address(asset)
        );

    }


}