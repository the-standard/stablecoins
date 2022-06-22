// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

// import "hardhat/console.sol";

contract SEuro is ERC20, AccessControl {
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
  // bytes32 public constant DEFAULT_ADMIN_ROLE = keccak256("DEFAULT_ADMIN_ROLE");

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

  function mint(address to, uint256 amount) public {
    require(hasRole(MINTER_ROLE, msg.sender), "invalid-minter");
    _mint(to, amount);
  }

  function burn(address from, uint256 amount) public {
    require(hasRole(BURNER_ROLE, msg.sender), "invalid-burner");
    _burn(from, amount);
  }

  // function grantRoleMint(address admin) {
  // }

  // TODO who are minters - this should be a contract that's controlled by tsd
  // TODO add minters?
  // TODO add burners?
  // TODO remove them!
  // view owners
}
