// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// 这是一个专辑商店的合约，不要害怕这些代码，只需要知道function是可以交互的，看得懂中文注释就可以做出来哦

contract AlbumStore {

    mapping(uint256 => Album) public albums;
    mapping(address => uint256) public userBalance;
    uint256 public albumCount;
    string public tip1;
    string public tip2;

    constructor(string memory _tip1, string memory _tip2) {
        /**
         * 这些好像是商店上架的专辑呢，比如第一个的专辑名称：So I gave up music
         * 专辑作者：Yorushika
         * 专辑价格：50
         * id：1
         */
        createAlbum("So I gave up music.", "Yorushika", 50);
        /**
         * 第二个的专辑名称：Sunflower
         * 专辑作者：n-buna
         * 专辑价格：50
         * id：2
         */
        createAlbum("Sunflower", "n-buna", 50);
        // 第三个专辑也类似
        createAlbum("Flag", "gamla", 100);
        tip1 = _tip1;
        tip2 = _tip2;
    }

    function viewTip1() public view returns (string memory) {
        // 可以查看第一个提示，不妨可以交互一下
    }

    function viewTip2() public view returns (string memory) {
        // 可以查看第二个提示
    }

    function createAlbum(string memory _name, string memory _artist, uint256 _price) internal {
        // 用于创建一个专辑商品，不过似乎只能内部调用
    }

    function buyAlbum(uint256 _id) public payable {
        // 可以通过这个函数购买专辑，不过要有足够的代币哦
    }

    function benefit(string memory _password) public {
        // 一个福利函数，只要余额小于200就可以领取50代币，不过这个函数好像需要正确的密码才能调用
    }

    function viewAlbumsAddress(uint256 _id) public view returns (address) {
        // 可以通过输入专辑的id来获取专辑合约的地址
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
        
    }

    // 也许flag藏在某首歌的歌词里
    function getLyrics() public view returns (string memory) {
        return Lyrics;
    }
    // 也许某个歌曲的名字就是某些密码呢，但这首歌可不一定在商店合约中
    function getname() public view returns (string memory) {
        return name;
    }
}