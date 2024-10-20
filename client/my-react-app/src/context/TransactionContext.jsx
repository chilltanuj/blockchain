import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const getEthereumContract = () => {
    if (typeof window.ethereum === 'undefined') {
        console.error("MetaMask is not installed.");
        throw new Error("MetaMask is not installed. Please install it to use this app.");
    }

    console.log("Ethereum object:", window.ethereum); // Debugging line

    const provider = new ethers.Browserproviders(window.ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionContract;
};

export const TransactionProvider = ({ children }) => {
    const [currentAccount, setConnectedAccount] = useState(null);
    const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount') || 0);

    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    };

    const checkIfWalletIsConnected = async () => {
        if (!window.ethereum) return alert("Please install MetaMask");

        const accounts = await window.ethereum.request({ method: 'eth_accounts' });

        if (accounts.length) {
            setConnectedAccount(accounts[0]);
        } else {
            console.log("No accounts found");
        }
    };

    const connectWallet = async () => {
        try {
            if (!window.ethereum) return alert("Please install MetaMask");

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setConnectedAccount(accounts[0]);
        } catch (error) {
            console.log(error);
            throw new Error("No Ethereum object.");
        }
    };

    const sendTransaction = async () => {
        try {
            if (!window.ethereum) return alert("Please install MetaMask");
            const { addressTo, amount, keyword, message } = formData;
            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.parseEther(amount);

            if (!addressTo || !amount || !keyword || !message) {
                throw new Error("Please fill in all fields.");
            }

            await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208',
                    value: parsedAmount._hex,
                }]
            });

            const transactionHash = await transactionContract.addBlockchain(addressTo, parsedAmount, message, keyword);

            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success - ${transactionHash.hash}`);

            const transactionCount = await transactionContract.getTransactionCount();
            setTransactionCount(transactionCount.toNumber());
            localStorage.setItem('transactionCount', transactionCount.toNumber());

        } catch (error) {
            console.log(error);
            throw new Error("Transaction failed.");
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction }}>
            {children}
        </TransactionContext.Provider>
    );
};
