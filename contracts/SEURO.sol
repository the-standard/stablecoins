// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract SEuro is ERC20, AccessControl {
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
  bytes32 public constant DEFAULT_ADMIN_ROLE = keccak256("DEFAULT_ADMIN_ROLE");

  constructor(string memory name, string memory symbol, address[] memory _admins)
      public
      ERC20(name, symbol)
  {
    _grantRole(MINTER_ROLE, msg.sender);
    _grantRole(BURNER_ROLE, msg.sender);
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

    for(uint8 i=0; i<_admins.length; i++){
      _grantRole(MINTER_ROLE, _admins[i]);
      _grantRole(BURNER_ROLE, _admins[i]);
    }
  }

  modifier onlyAdmin() {
      require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "invalid-admin");
      _;
  }

  function mint(address to, uint256 amount) public {
    require(hasRole(MINTER_ROLE, msg.sender), "invalid-minter");
    _mint(to, amount);
  }

  function addMinter(address _address) public onlyAdmin {
      _grantRole(MINTER_ROLE, _address);
  }

  function removeMinter(address _address) public onlyAdmin {
      _revokeRole(MINTER_ROLE, _address);
  }

  function burn(address from, uint256 amount) public {
    require(hasRole(BURNER_ROLE, msg.sender), "invalid-burner");
    _burn(from, amount);
  }

  function addBurner(address _address) public onlyAdmin {
      _grantRole(BURNER_ROLE, _address);
  }

  function removeBurner(address _address) public onlyAdmin {
      _revokeRole(BURNER_ROLE, _address);
  }

}
