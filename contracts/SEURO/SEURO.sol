// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract SEuro is ERC20, AccessControl {
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

  constructor(string memory name, string memory symbol)
      ERC20(name, symbol)
  {
    _grantRole(MINTER_ROLE, msg.sender);
    _grantRole(BURNER_ROLE, msg.sender);
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
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

}
