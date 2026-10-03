//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// 这是一个solidity智能合约，用于存储和购买音乐专辑。用户可以创建专辑，购买专辑，并查看专辑的详细信息，包括歌词。每个专辑都有一个唯一的ID、名称、艺术家、价格和所有者地址。用户余额用于购买专辑，只有专辑的所有者可以设置歌词。
contract AlbumStore {

    mapping(uint256 => Album) public albums;
    mapping(address => uint256) public userBalance;
    uint256 public albumCount;

    constructor() {
        albumCount = 0;
        createAlbum("So I gave up music.", "Yorushika", 50);
        createAlbum("Sunflower", "n-buna", 50);
        createAlbum("Flag", "n-buna", 100);
    }

    event AlbumCreated(uint256 id, string name, string artist, uint256 price, address owner);

    function createAlbum(string memory _name, string memory _artist, uint256 _price) internal {
        albumCount++;
        albums[albumCount] = new Album(albumCount, _name, _artist, _price, msg.sender);
        emit AlbumCreated(albumCount, _name, _artist, _price, msg.sender);
    }

    function buyAlbum(uint256 _id) public payable {
        Album album = albums[_id];
        require(msg.value >= album.price(), "Insufficient funds to buy the album.");
        userBalance[msg.sender] += msg.value;
        album.owner() = msg.sender;
    }

    function benefit(string memory _password) public {
        require(keccak256(abi.encodePacked(_password)) == 0x8ead82a1cf2ef0bacec4a37e827449c34c127f5a0253b22aae73d4ac10cabe3a, "Incorrect password.");
        require(userBalance[msg.sender] <= 200, "You have enough balance, no need to benefit.");
        userBalance[msg.sender] += 50;
    }

    string public tip1 = "Tip 1";
    string public tip2 = "Tip 2";

    function viewTip1() public view returns (string memory) {
        return tip1;
    }

    function viewTip2() public view returns (string memory) {
        return tip2;
    }

}

contract Album {
    uint256 public id;
    string public name;
    string public artist;
    uint256 public price;
    address public owner;
    string public Lyrics;

    constructor(uint256 _id, string memory _name, string memory _artist, uint256 _price, address _owner) {
        id = _id;
        name = _name;
        artist = _artist;
        price = _price;
        owner = _owner;
        Lyrics = "";
    }

    function setLyrics(string memory _lyrics) public {
        require(msg.sender == owner, "Only the owner can set the lyrics.");
        Lyrics = _lyrics;
    }

    /// 也许flag藏在某首歌的歌词里
    function getLyrics() public view returns (string memory) {
        return Lyrics;
    }
}