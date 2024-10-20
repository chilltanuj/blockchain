// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Transactions {
    uint256 transactionCounter;
    
    event Transfer(address from, address receiver, uint amount, string message, uint256 timestamp, string keyboard);

    struct TransferStruct {
        address sender;
        address receiver;
        uint amount;
        string message;
        uint timestamp;
        string keyboard;
    }

    TransferStruct[] transactions;

    function addToBlockchain(address payable receiver, uint amount, string memory message, string memory keyboard) public {
        transactionCounter += 1;  // Use transactionCounter
        transactions.push(TransferStruct(msg.sender, receiver, amount, message, block.timestamp, keyboard));

        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyboard);
    }

    function getAllTransactions() public view returns (TransferStruct[] memory) {
        return transactions;  // Return the transactions array
    }

    function getTransactionCount() public view returns (uint256) {
        return transactionCounter;  // Use transactionCounter
    }
}
