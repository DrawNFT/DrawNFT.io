// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract DrawNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private tokenCount;

    mapping (address => Counters.Counter) private nonces;

    uint256 private constant TOTAL_SUPPLY = 5555;
    uint256 private constant MINT_PRICE = 0.04 ether;

    address private signOwner = 0x57c5abf82F08dd751645846b21ab14e8f4124Aa5;

    struct SignatureKeys { 
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    constructor() ERC721("DrawNFT", "DRW") {}

    modifier verifyMessage(SignatureKeys calldata signatureKeys) {
        uint256 senderNonce = nonces[msg.sender].current();
        uint256 senderAddress = uint256(uint160(msg.sender));
        string memory message = string.concat(Strings.toString(senderNonce), Strings.toHexString(senderAddress, 20));
        bytes32 hashedMessage = keccak256(abi.encodePacked(message));

        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHashMessage = keccak256(abi.encodePacked(prefix, hashedMessage));

        address signer = ecrecover(prefixedHashMessage, signatureKeys.v, signatureKeys.r, signatureKeys.s);
        require(signer == signOwner, "The provided signature is invalid.");
        _;
        nonces[msg.sender].increment();
    }


    function safeMint(string calldata externalTokenURI, SignatureKeys calldata keys) external payable verifyMessage(keys) returns (uint256) {
        uint256 tokenId = tokenCount.current();
        require(tokenId < TOTAL_SUPPLY, "The requested action exceeds the available token supply.");
        require(msg.value >= MINT_PRICE, "Insufficient ETH has been transmitted. The minimum required amount to mint an NFT is 0.04 ETH.");

        tokenCount.increment();
        uint256 newTokenId = tokenCount.current();
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, externalTokenURI);
        return newTokenId;
    }

    function withdrawMintPayments() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function readNonce(address addr) external view returns (uint256) {
        return nonces[addr].current();
    }   
}
