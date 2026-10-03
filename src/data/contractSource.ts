export const contractSource = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// 这是一个专辑商店合约。看不懂 Solidity 也没关系，可以试着和函数交互。
contract AlbumStore {
    mapping(uint256 => Album) public albums;
    mapping(address => uint256) public userBalance;
    uint256 public albumCount;
    string public tip1;
    string public tip2;

    constructor(string memory _tip1, string memory _tip2) {
        createAlbum("So I gave up music.", "Yorushika", 50);
        createAlbum("Sunflower", "n-buna", 50);
        createAlbum("Flag", "gamla", 100);
        tip1 = _tip1;
        tip2 = _tip2;
    }

    function viewTip1() public view returns (string memory) {
        // 查看提示一
    }

    function viewTip2() public view returns (string memory) {
        // 查看提示二
    }

    function createAlbum(string memory _name, string memory _artist, uint256 _price) internal {
        // 创建专辑商品
    }

    function buyAlbum(uint256 _id) public payable {
        // 购买专辑；余额需要足够
    }

    function benefit(string memory _password) public {
        // 密码正确时领取福利余额
    }

    function viewAlbumsAddress(uint256 _id) public view returns (address) {
        // 根据 ID 查询专辑地址
    }
}`;
