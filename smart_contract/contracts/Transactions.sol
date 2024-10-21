// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Transactions {
    uint256 transactionCounter;  // Keeps track of the number of transactions

    // Event to log the transfer details
    event Transfer(address from, address receiver, uint256 amount, string message, uint256 timestamp, string keyword);

    // Struct to represent a transfer
    struct TransferStruct {
        address sender;
        address receiver;
        uint256 amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    TransferStruct[] transactions;  // Array to store transactions

    // Function to add a transaction to the blockchain
    function addToBlockchain(address payable receiver, uint256 amount, string memory message, string memory keyword) public {
        transactionCounter += 1;  // Increment transaction counter
        transactions.push(TransferStruct(msg.sender, receiver, amount, message, block.timestamp, keyword));

        // Emit the transfer event
        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);
    }

    // Function to retrieve all transactions
    function getAllTransactions() public view returns (TransferStruct[] memory) {
        return transactions;  // Return the array of transactions
    }

    // Function to get the total transaction count
    function getTransactionCount() public view returns (uint256) {
        return transactionCounter;  // Return the number of transactions
    }
}
