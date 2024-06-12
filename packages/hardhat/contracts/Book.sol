// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Book is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    uint256 public bookPrice;
    string internal customBaseURI;
    string internal bookIpfsCid;
    bool private isBookIpfsCidSet;

    mapping(uint256 => uint256) public totalSupplyMapping;

    constructor(
        string memory tokenName,
        string memory symbol,
        uint256 _bookPrice,
        string memory baseURI_,
        address addressOwner
    ) ERC721(tokenName, symbol) {
        bookPrice = _bookPrice;
        customBaseURI = baseURI_;
        transferOwnership(addressOwner);
    }

    function setBookIpfsCid(string memory newIpfsCid, address author) external {
        require(author == owner(), "Not the owner");
        require(!isBookIpfsCidSet, "bookIpfsCid has already been set");
        bookIpfsCid = newIpfsCid;
        isBookIpfsCidSet = true;
    }

    function purchaseBook(address buyer) public payable returns (uint256) {
        require(msg.value == bookPrice, "Incorrect price");

        uint256 tokenId = _tokenIdCounter.current();


        _tokenIdCounter.increment();
        _safeMint(buyer, tokenId);

        return tokenId;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return customBaseURI;
    }

    function getBookIpfsCid() external view returns (string memory) {
        return bookIpfsCid;
    }

    function totalSupply(uint256 tokenId) public view returns (uint256) {
        return _tokenIdCounter.current() - tokenId;
    }
}
