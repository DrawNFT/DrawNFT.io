// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/PullPayment.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract DrawNFT is ERC721URIStorage, PullPayment, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter public tokenCount;

    mapping (address => Counters.Counter) public nonces;

    uint256 public constant TOTAL_SUPPLY = 5555;
    uint256 public constant MINT_PRICE = 0.04 ether;

    address public signOwner = 0x57c5abf82F08dd751645846b21ab14e8f4124Aa5;

    event MintedNft(uint256 nftId);

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
        require(signer == signOwner, "Invalid Signature");
        _;
        nonces[msg.sender].increment();
    }

    function safeMint(string memory externalTokenURI, SignatureKeys calldata keys) external payable verifyMessage(keys) returns (uint256) {
        uint256 tokenId = tokenCount.current();
        require(tokenId < TOTAL_SUPPLY, "Exceeds token supply");
        require(msg.value >= MINT_PRICE, "Not enough ETH sent");

        tokenCount.increment();
        uint256 newTokenId = tokenCount.current();
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, externalTokenURI);
        emit MintedNft(newTokenId);
        return newTokenId;
    }

    function withdrawMintPayments() external onlyOwner virtual {
        payable(msg.sender).transfer(address(this).balance);
    }

    function changeSignOwner(address newSignOwner) external onlyOwner {
        require(newSignOwner != address(0), "The zero address");

        signOwner = newSignOwner;
    }

    function readNonce(address addr) external view returns (uint256) {
        return nonces[addr].current();
    }   
}
