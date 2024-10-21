import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../utils/constants';

// Create a context to share state across components
export const TransactionContext = React.createContext();

// Helper function to get Ethereum contract instance
const getEthereumContract = () => {
    if (!window.ethereum) {
        console.error("MetaMask is not installed.");
        throw new Error("MetaMask is not installed. Please install it to use this app.");
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionContract;
};

export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount') || 0);
    const [transaction, setTransactions] = useState([]);
    // Update form data based on user input
    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    };

    const getAllTransactions = async () => {
        try{
            if(!ethereum) return alert("please install metamask");
            const transactionContract = getEthereumContract();
            const availableTransactions = await transactionContract.getAllTransactions();

            const structuredTransactions = availableTransactions.map((transaction) => ({
                addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
          message: transaction.message,
          keyword: transaction.keyword,
          amount: parseInt(transaction.amount._hex) / (10 ** 18)
            }))
            console.log(structuredTransactions)
            setTransactions(structuredTransactions);
            
        } catch (error) {
            console.log(error);
        }
    }

    // Check if MetaMask wallet is connected
    const checkIfWalletIsConnected = async () => {
        try {
            if (!window.ethereum) {
                console.warn("MetaMask is not installed. Please install it.");
                return;
            }

            const accounts = await window.ethereum.request({ method: 'eth_accounts' });

            if (accounts.length) {
                setCurrentAccount(accounts[0]);
                console.log(`Connected account: ${accounts[0]}`);
                getAllTransactions();
            } else {
                console.log("No connected accounts found.");
            }
        } catch (error) {
            console.error("Error checking wallet connection:", error);
        }
    };

    const checkIfTransactionExist = async () => {
try {
    const transactionContract = getEthereumContract();
    const transactionCount = await transactionContract.getTransactionCount();
    window.localStorage.setItem("transactionCount", transactionCount)

} catch(error){
    console.error("Error connecting wallet:", error);
    throw new Error("No Ethereum object.");

}

    }

    // Function to connect MetaMask wallet
    const connectWallet = async () => {
        try {
            if (!window.ethereum) return alert("Please install MetaMask");

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setCurrentAccount(accounts[0]);
            console.log(`Connected wallet: ${accounts[0]}`);
        } catch (error) {
            console.error("Error connecting wallet:", error);
            throw new Error("No Ethereum object.");
        }
    };

    // Function to send a transaction
    const sendTransaction = async () => {
        try {
            if (!window.ethereum) return alert("Please install MetaMask");

            const { addressTo, amount, keyword, message } = formData;
            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);

            // Validation: ensure all form fields are filled
            if (!addressTo || !amount || !keyword || !message) {
                alert("Please fill in all fields.");
                return;
            }

            // Request to send a transaction via MetaMask
            await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', // 21000 Gwei
                    value: parsedAmount._hex, // Convert ETH to hexadecimal
                }]
            });

            // Call smart contract method after sending the transaction
            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

            setIsLoading(true);
            console.log(`Transaction loading - ${transactionHash.hash}`);
            await transactionHash.wait(); // Wait for the transaction to be mined
            setIsLoading(false);
            console.log(`Transaction successful - ${transactionHash.hash}`);

            // Get the updated transaction count from the smart contract
            const transactionCount = await transactionContract.getTransactionCount();
            setTransactionCount(transactionCount.toNumber());
            localStorage.setItem('transactionCount', transactionCount.toNumber());
            window.reload()

        } catch (error) {
            console.error("Error sending transaction:", error);
            alert("Transaction failed. Please check the console for more details.");
        }
    };

    // Check if MetaMask wallet is connected on component mount
    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionExist();
    }, []);

    return (
        <TransactionContext.Provider value={{
            connectWallet,
            currentAccount,
            formData,
            setFormData,
            handleChange,
            sendTransaction,
            transaction,
            isLoading,
            transactionCount
        }}>
            {children}
        </TransactionContext.Provider>
    );
};
