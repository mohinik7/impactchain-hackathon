// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ImpactToken - ERC-721 NFT for certificates of social impact
contract ImpactToken is ERC721, Ownable {
    uint256 public nextTokenId;

    constructor() ERC721("ImpactToken", "IMPACT") {}

    /// @notice Mint a new Impact Token to a recipient
    /// @dev Only the owner (ProjectEscrow) can mint
    function mint(address to) external onlyOwner returns (uint256) {
        uint256 tokenId = nextTokenId;
        _safeMint(to, tokenId);
        nextTokenId++;
        return tokenId;
    }
}
