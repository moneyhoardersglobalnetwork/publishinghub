// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./Book.sol";  // Assume Book.sol contains your original Book contract
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract PublishingFactoryUsdc is Ownable {
  // Struct to keep more information about each Book
  struct BookInfo {
      address bookAddress;
      string name;
      string symbol;
      uint256 price;
      string baseURI;
  }

  // Array to keep track of all deployed Books' addresses
  address[] public bookAddresses;
  //Charge a fee to create a new Book
  uint256 public feeForCreation; // Fee for creating a new book
  IERC20 public usdcToken; // USDC is our fee token //mUSDC on Testnets
  

  // Mapping from book address to BookInfo struct
  mapping(address => BookInfo) public books;

  // Event to emit when a new Book contract is deployed
  event BookCreated(address indexed bookAddress, string tokenName, string symbol, uint256 price, string baseURI);
  event BookPurchased(address indexed buyer, address indexed bookAddress, uint256 tokenId);
  event BookIpfsCidSet(address indexed bookAddress, string ipfsCid);
  event BookCoverIpfsCidSet(address indexed bookAddress, string ipfsCoverCid);
  event CreationFeeUpdated(uint256 newFee);
  error NothingToWithdraw();
  //We pass are fee token address to the constructor hard coded
   constructor(uint256 _creationFee) {
        usdcToken = IERC20(0xc4BdC44885Ca364962272E5Fd026C05Be9AD924A); // mUSDC on Testnets a mock USDC token
        feeForCreation = _creationFee;
    }


  function createBook(string memory name, string memory symbol, uint256 bookPrice, string memory baseURI, uint256 usdcAmount) external returns (address) {
    console.log("Book's baseURI is %s", baseURI);
    // UCDS is our fee token
     require(usdcToken.balanceOf(msg.sender) >= feeForCreation, "You need more USDC to Mint MHGD Tokens SORRY!");
      require(usdcToken.transferFrom(msg.sender, address(this), usdcAmount), "Transfer of USDC failed");
    // Deploy a new Book contract and set its base URI, book price, and token name
    Book newBook = new Book(name, symbol, bookPrice, baseURI, msg.sender);

    // Create BookInfo struct
    BookInfo memory newBookInfo = BookInfo({
      bookAddress: address(newBook),
      name: name,
      symbol: symbol,
      price: bookPrice,
      baseURI: baseURI
    });

    // Add the newly created BookInfo to the mapping
    books[address(newBook)] = newBookInfo;

    // Add the newly created Book address to the array
    bookAddresses.push(address(newBook));

    console.log("Book created succesfully with address %s", address(newBook));

    // Emit an event for the frontend to catch
    emit BookCreated(address(newBook), name, symbol, bookPrice, baseURI);

    return address(newBook);
  }

  //function to set ipfsCid of the book we use https: CID for direct linking from frontend
  function setBookIpfsCid(address bookAddress, string memory newIpfsCid) public {
      // Look up the book info from the mapping
      BookInfo memory bookToSetIpfsCid = books[bookAddress];

      // Make sure the book exists
      require(bookToSetIpfsCid.bookAddress != address(0), "Book does not exist");

      // Create a new instance from the address
      Book bookInstance = Book(bookAddress);

      // Call the setBookIpfsCid function on the Book contract
      bookInstance.setBookIpfsCid(newIpfsCid, msg.sender);
      emit BookIpfsCidSet(bookAddress, newIpfsCid);
  }

    //function to set ipfsCoverCid of the book we use https: CID for direct linking from frontend
  function setBookCoverIpfsCid(address bookAddress, string memory newIpfsCoverCid) public {
      // Look up the book info from the mapping
      BookInfo memory bookToSetIpfsCoverCid = books[bookAddress];

      // Make sure the book exists
      require(bookToSetIpfsCoverCid.bookAddress != address(0), "Book does not exist");

      // Create a new instance from the address
      Book bookInstance = Book(bookAddress);

      // Call the setBookIpfsCoverCid function on the Book contract
      bookInstance.setBookIpfsCoverCid(newIpfsCoverCid, msg.sender);
      emit BookCoverIpfsCidSet(bookAddress, newIpfsCoverCid);
  }

  function purchaseBookFromAddress(address bookAddress ) public payable {
    // Look up the book info from the mapping
    BookInfo memory bookToPurchase = books[bookAddress];

    // Make sure the book exists
    require(bookToPurchase.bookAddress != address(0), "Book does not exist");

    // Check if the correct price is sent
    require(msg.value == bookToPurchase.price, "Incorrect price");

    // Create a new instance from the address
    Book bookInstance = Book(bookAddress);

    // Call the purchase function on the Book contract
    uint256 tokenId = bookInstance.purchaseBook{value: msg.value}(msg.sender);
    emit BookPurchased(msg.sender, bookAddress, tokenId);

    // Emit an event or log (optional)
    console.log("Book with token ID %s purchased successfully", tokenId);
  }


  // Get all book addresses (for frontend to then query each book's info)
  function getAllBookAddresses() public view returns (address[] memory) {
    return bookAddresses;
  }

  function getBookIpfsCid(address bookAddress) public view returns (string memory) {
    // Look up the book info from the mapping
    BookInfo memory bookToGetIpfsCid = books[bookAddress];

    // Make sure the book exists
    require(bookToGetIpfsCid.bookAddress != address(0), "Book does not exist");

    // Create a new instance from the address
    Book bookInstance = Book(bookAddress);

    // Call the getBookIpfsCid function on the Book contract
    string memory bookIpfsCid = bookInstance.getBookIpfsCid();

    return bookIpfsCid;
	}

   function getBookIpfsCoverCid(address bookAddress) public view returns (string memory) {
    // Look up the book info from the mapping
    BookInfo memory bookToGetIpfsCoverCid = books[bookAddress];

    // Make sure the book exists
    require(bookToGetIpfsCoverCid.bookAddress != address(0), "Book does not exist");

    // Create a new instance from the address
    Book bookInstance = Book(bookAddress);

    // Call the getBookIpfsCid function on the Book contract
    string memory bookIpfsCoverCid = bookInstance.getBookIpfsCoverCid();

    return bookIpfsCoverCid;
	}

  /**
	 * Function that allows the owner to withdraw all the Ether in the contract
	 * The function can only be called by the owner of the contract as defined by the onlyOwner modifier
	 */
	function withdraw() public onlyOwner {
		(bool success, ) = msg.sender.call{ value: address(this).balance }("");
		require(success, "Failed to send Ether");
	}

  // Allows factory owner to withdraw the USDC tokens by passing in the USDC token address
     function withdrawToken(
        address _beneficiary,
        address _token
    ) public onlyOwner {
        uint256 amount = IERC20(_token).balanceOf(address(this));
        if (amount == 0) revert NothingToWithdraw();
        IERC20(_token).transfer(_beneficiary, amount);
    }

	/**
	 * Function that allows the contract to receive ETH
	 */
	receive() external payable {}
}