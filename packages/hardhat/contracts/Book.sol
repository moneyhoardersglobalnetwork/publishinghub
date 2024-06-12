//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
//This is the contract that will be deployed by the PublishingFactory contract
//The Book contract receives the revenue from the sale of the book
//The Author can withdraw the revenue from the contract which will be sent to the author's address
//The PublishingFactory contract receives half of the revenue balance
// The Book contract inherits the implementation of ERC721
contract Book is ERC721URIStorage, Ownable {
	using Counters for Counters.Counter;
	Counters.Counter private _tokenIdCounter;
	uint256 public bookPrice;
	string internal customBaseURI;
	string internal bookIpfsCid; // IPFS CID of the encrypted book
	string internal bookIpfsCoverCid; // IPFS CID of the encrypted book cover
	bool private isBookIpfsCidSet; // Flag to check if the IPFS CID of the book has been set
	bool private isBookIpfsCoverCidSet; // Flag to check if the IPFS CID of the book has been set
	error NothingToWithdraw(); //Handles the error when the user tries to withdraw the native asset without any native asset in the contract

	constructor(
		string memory tokenName,
		string memory symbol,
		uint256 bookPrice_,
		string memory baseURI_,
		address addressOwner
	) ERC721(tokenName, symbol) {
		bookPrice = bookPrice_;
		customBaseURI = baseURI_;
		transferOwnership(addressOwner);
	}

	//Allows Authors to set the IPFS CID of the book
	function setBookIpfsCid(string memory newIpfsCid, address author) external {
		require(author == owner(), "Not the owner");
		require(!isBookIpfsCidSet, "bookIpfsCid has already been set");
		bookIpfsCid = newIpfsCid;
		isBookIpfsCidSet = true; // Mark bookIpfsCid as set
	}

	//Allows Authors to set the IPFS CID of the book cover
	function setBookIpfsCoverCid(
		string memory newIpfsCoverCid,
		address author
	) external {
		require(author == owner(), "Not the owner");
		require(
			!isBookIpfsCoverCidSet,
			"bookIpfsCoverCid has already been set"
		);
		bookIpfsCoverCid = newIpfsCoverCid;
		isBookIpfsCoverCidSet = true; // Mark bookIpfsCoverCid as set
	}

	//Allows Users to purchase a book we want to versions of this contract Native purchases and USDC purchases
	function purchaseBook(address buyer) public payable returns (uint256) {
		require(msg.value == bookPrice, "Incorrect price");

		uint256 tokenId = _tokenIdCounter.current();
		_tokenIdCounter.increment();

		_safeMint(buyer, tokenId); // Minting the NFT to the sender of the transaction

		return tokenId;
	}

	//We use this function to set the base URI of the book a custom indentifier set by the Author
	function _baseURI() internal view virtual override returns (string memory) {
		return customBaseURI;
	}

	//We use this function to get the IPFS CID of the book
	function getBookIpfsCid() external view returns (string memory) {
		return bookIpfsCid;
	}

	//We use this function to get the IPFS CID of the book cover
	function getBookIpfsCoverCid() external view returns (string memory) {
		return bookIpfsCoverCid;
	}

	/**
	 * Function that allows the owner to withdraw all the Ether in the contract
	 * The function can only be called by the owner of the contract as defined by the isOwner modifier
	 */
	function withdraw() public onlyOwner {
		(bool success, ) = msg.sender.call{ value: address(this).balance }("");
		require(success, "Failed to send Ether");
	}
}
