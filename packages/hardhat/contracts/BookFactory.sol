// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Book.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BookFactory {
    struct BookInfo {
        address bookAddress;
        string name;
        string symbol;
        uint256 price;
        string baseURI;
        string bookIpfsCid;
        string coverIpfsCid;
        address creator;
        uint256 maxCopies;
    }

    struct Minter {
        uint256 minted;
        uint256 mintedAtBlock;
        bool hasMintedBefore;
        uint256 minter_AllTime_Minted;
    }

    IERC20 public usdcToken;
    address public owner;
    mapping(address => Minter) public minters;
    uint256 public feePercentageForPurchase = 1; // 1% fee for book purchases
    uint256 public feeForCreation; // Fee for creating a new book

    address[] public bookAddresses;
    mapping(address => BookInfo) public books;

    event BookCreated(
        address indexed bookAddress,
        string tokenName,
        string symbol,
        string baseURI,
        string bookIpfsCid,
        string coverIpfsCid,
        address creator
    );
    event BookPurchased(
        address indexed buyer,
        address indexed bookAddress,
        uint256 tokenId
    );
    event BookIpfsCidSet(address indexed bookAddress, string bookIpfsCid);
    event BookCoverIpfsCidSet(address indexed bookAddress, string coverIpfsCid);
    event BookPriceUpdated(address indexed bookAddress, uint256 newPrice);
    event CreationFeeUpdated(uint256 newFee);
    event MaxCopiesUpdated(address indexed bookAddress, uint256 maxCopies);

    error NothingToWithdraw();

    constructor(address _owner, uint256 _creationFee) {
        usdcToken = IERC20(0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582);
        owner = _owner;
        feeForCreation = _creationFee;
    }

    function createBook(
        string memory name,
        string memory symbol,
        uint256 bookPrice,
        string memory baseURI,
        string memory bookIpfsCid,
        string memory coverIpfsCid
    ) public returns (address) {
        require(
            usdcToken.transferFrom(msg.sender, address(this), feeForCreation),
            "USDC transfer for creation fee failed"
        );

        Book newBook = new Book(name, symbol, bookPrice, baseURI, msg.sender);

        BookInfo memory newBookInfo = BookInfo({
            bookAddress: address(newBook),
            name: name,
            symbol: symbol,
            price: bookPrice,
            baseURI: baseURI,
            bookIpfsCid: bookIpfsCid,
            coverIpfsCid: coverIpfsCid,
            creator: msg.sender,
            maxCopies: 1000 // Default maximum copies
        });

        books[address(newBook)] = newBookInfo;
        bookAddresses.push(address(newBook));

        emit BookCreated(
            address(newBook),
            name,
            symbol,
            baseURI,
            bookIpfsCid,
            coverIpfsCid,
            msg.sender
        );
    }

    function setBookIpfsCid(
        address bookAddress,
        string memory newIpfsCid
    ) public {
        BookInfo storage bookToSetIpfsCid = books[bookAddress];
        require(
            bookToSetIpfsCid.bookAddress != address(0),
            "Book does not exist"
        );

        Book bookInstance = Book(bookAddress);
        require(
            msg.sender == bookInstance.owner(),
            "Only book owner can set IPFS CID"
        );

        bookInstance.setBookIpfsCid(newIpfsCid, msg.sender);
        bookToSetIpfsCid.bookIpfsCid = newIpfsCid;
        emit BookIpfsCidSet(bookAddress, newIpfsCid);
    }

    function setBookCoverIpfsCid(
        address bookAddress,
        string memory newIpfsCid
    ) public {
        BookInfo storage bookToSetCoverIpfsCid = books[bookAddress];
        require(
            bookToSetCoverIpfsCid.bookAddress != address(0),
            "Book does not exist"
        );

        Book bookInstance = Book(bookAddress);
        require(
            msg.sender == bookInstance.owner(),
            "Only book owner can set cover IPFS CID"
        );

        bookToSetCoverIpfsCid.coverIpfsCid = newIpfsCid;
        emit BookCoverIpfsCidSet(bookAddress, newIpfsCid);
    }

    function purchaseBook(address bookAddress) public {
        BookInfo memory bookToPurchase = books[bookAddress];
        require(
            bookToPurchase.bookAddress != address(0),
            "Book does not exist"
        );

        uint256 price = bookToPurchase.price;
        require(price > 0, "Book price not set");

        uint256 feeAmount = (price * feePercentageForPurchase) / 100;
        uint256 payoutAmount = price - feeAmount;

        bool success = usdcToken.transferFrom(msg.sender, address(this), price);
        require(success, "USDC transfer failed");

        usdcToken.transfer(bookToPurchase.creator, payoutAmount);

        Book bookInstance = Book(bookAddress);
        uint256 tokenId = bookInstance.purchaseBook(msg.sender);
        emit BookPurchased(msg.sender, bookAddress, tokenId);
    }

    function setBookPrice(address bookAddress, uint256 newPrice) public {
        BookInfo storage bookToSetPrice = books[bookAddress];
        require(
            bookToSetPrice.bookAddress != address(0),
            "Book does not exist"
        );

        Book bookInstance = Book(bookAddress);
        require(
            msg.sender == bookInstance.owner(),
            "Only book owner can set price"
        );

        bookToSetPrice.price = newPrice;
        emit BookPriceUpdated(bookAddress, newPrice);
    }

    function setMaxCopies(address bookAddress, uint256 maxCopies) public {
        BookInfo storage bookToSetMaxCopies = books[bookAddress];
        require(
            bookToSetMaxCopies.bookAddress != address(0),
            "Book does not exist"
        );

        Book bookInstance = Book(bookAddress);
        require(
            msg.sender == bookInstance.owner(),
            "Only book owner can set max copies"
        );
        require(maxCopies > 0, "Max copies must be greater than zero");

        bookToSetMaxCopies.maxCopies = maxCopies;
        emit MaxCopiesUpdated(bookAddress, maxCopies);
    }

    function getBookPrice(address bookAddress) public view returns (uint256) {
        BookInfo memory bookToGetPrice = books[bookAddress];
        require(
            bookToGetPrice.bookAddress != address(0),
            "Book does not exist"
        );

        return bookToGetPrice.price;
    }

    function getBookIpfsCid(
        address bookAddress
    ) public view returns (string memory) {
        BookInfo memory bookToGetIpfsCid = books[bookAddress];
        require(
            bookToGetIpfsCid.bookAddress != address(0),
            "Book does not exist"
        );

        return bookToGetIpfsCid.bookIpfsCid;
    }

    function getBookCoverIpfsCid(
        address bookAddress
    ) public view returns (string memory) {
        BookInfo memory bookToGetCoverIpfsCid = books[bookAddress];
        require(
            bookToGetCoverIpfsCid.bookAddress != address(0),
            "Book does not exist"
        );

        return bookToGetCoverIpfsCid.coverIpfsCid;
    }

    function getAllBookAddresses() public view returns (address[] memory) {
        return bookAddresses;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function setCreationFee(uint256 newFee) public onlyOwner {
        feeForCreation = newFee;
        emit CreationFeeUpdated(newFee);
    }

    function withdrawToken(
        address _beneficiary,
        address _token
    ) public onlyOwner {
        uint256 amount = IERC20(_token).balanceOf(address(this));
        if (amount == 0) revert NothingToWithdraw();
        IERC20(_token).transfer(_beneficiary, amount);
    }
}
