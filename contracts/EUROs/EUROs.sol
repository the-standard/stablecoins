// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "contracts/interfaces/Arbitrum.sol";

contract EUROs is Initializable, ERC20Upgradeable, UUPSUpgradeable, OwnableUpgradeable, AccessControlUpgradeable, IArbitrumL1Token {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    address private customGatewayAddress;
    address private routerAddress;
    bool private shouldRegisterGateway;

    function initialize() public initializer {}

    function _authorizeUpgrade(address) internal view override {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "invalid-admin");
    }

    function name() public view virtual override returns (string memory) {
        return "The Standard EURO";
    }

    function symbol() public view virtual override returns (string memory) {
        return "EUROs";
    }

    function mint(address to, uint256 amount) public {
        require(hasRole(MINTER_ROLE, msg.sender), "invalid-minter");
        _mint(to, amount);
    }

    function addMinter(address _address) public {
        grantRole(MINTER_ROLE, _address);
    }

    function removeMinter(address _address) public {
        revokeRole(MINTER_ROLE, _address);
    }

    function burn(address from, uint256 amount) public {
        require(hasRole(BURNER_ROLE, msg.sender), "invalid-burner");
        _burn(from, amount);
    }

    function addBurner(address _address) public {
        grantRole(BURNER_ROLE, _address);
    }

    function removeBurner(address _address) public {
        revokeRole(BURNER_ROLE, _address);
    }

    function completeUpgradeForArbitrum(address _customGatewayAddress, address _routerAddress) external onlyOwner {
        customGatewayAddress = _customGatewayAddress;
        routerAddress = _routerAddress;
    }

    function isArbitrumEnabled() external view override returns (uint8) {
        require(shouldRegisterGateway, "NOT_EXPECTED_CALL");
        return uint8(0xb1);
    }

    function registerTokenOnL2(
        address l2CustomTokenAddress,
        uint256 maxSubmissionCostForCustomGateway,
        uint256 maxSubmissionCostForRouter,
        uint256 maxGasForCustomGateway,
        uint256 maxGasForRouter,
        uint256 gasPriceBid,
        uint256 valueForGateway,
        uint256 valueForRouter,
        address creditBackAddress
    ) public payable override onlyOwner {
        // we temporarily set `shouldRegisterGateway` to true for the callback in registerTokenToL2 to succeed
        bool prev = shouldRegisterGateway;
        shouldRegisterGateway = true;

        IL1CustomGateway(customGatewayAddress).registerTokenToL2{
            value: valueForGateway
        }(
            l2CustomTokenAddress,
            maxGasForCustomGateway,
            gasPriceBid,
            maxSubmissionCostForCustomGateway,
            creditBackAddress
        );

        IL1GatewayRouter(routerAddress).setGateway{value: valueForRouter}(
            customGatewayAddress,
            maxGasForRouter,
            gasPriceBid,
            maxSubmissionCostForRouter,
            creditBackAddress
        );

        shouldRegisterGateway = prev;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public override(IArbitrumL1Token, ERC20Upgradeable) returns (bool) {
        return super.transferFrom(sender, recipient, amount);
    }

    function balanceOf(address account) public view override(IArbitrumL1Token, ERC20Upgradeable) returns (uint256) {
        return super.balanceOf(account);
    }
}
