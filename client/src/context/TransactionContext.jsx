import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;
const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionsContract;
}

export const TransactionProvider = ({children}) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [formData, setFormData] = useState({addressTo: "", amount: "", gif: "", message: ""});
    const handleChange = (e, name) => {
        setFormData((prevState) => ({...prevState, [name]: e.target.value}));
    }
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
    const [transactions, setTransactions] = useState([]);

    const getAllTransactions = async () => {
        try{
            if(!ethereum) return alert("Please install Metamask");
            const transactionsContract = getEthereumContract();
            const availableTransactions = await transactionsContract.getAllTransactions();
            const structuredTransactions = availableTransactions.map((transaction) => ({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message: transaction.message,
                gif: transaction.gif,
                amount: parseInt(transaction.amount._hex) / (10 ** 18)
            }))
            console.log(structuredTransactions);
            setTransactions(structuredTransactions);
        } catch(error) {
            console.log(error);
        }
    }

    const checkIfWalletIsConnected = async () => {
        try{
            if(!ethereum) return alert("Please install Metamask");

            const accounts = await ethereum.request({method: "eth_accounts"});

            if(accounts.length){
                setCurrentAccount(accounts[0]);
                getAllTransactions();
            } else {
                console.log('No account found');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const checkIfTransactionsExist = async () => {
        try{
            const transactionsContract = getEthereumContract();
            const transactionCount = await transactionsContract.getTransactionCount();

            window.localStorage.setItem("transactionCount", transactionCount);
        } catch (error) {
            console.log(error);
            throw new Error('No ethereum object');
        }
    }

    const connectWallet = async () => {
        try{
            if(!ethereum) return alert("Please install Metamask");
            const accounts = await ethereum.request({method: "eth_requestAccounts"});
            setCurrentAccount(accounts[0]);
        } catch (error){
            console.log(error);
            throw new Error('No ethereum object');
        }
    }

    const sendTransaction = async () => {
        try{
            if(!ethereum) return alert("Please install Metamask");

            const { addressTo, amount, gif, message } = formData;
            const parsedAmount = ethers.utils.parseEther(amount);
            const transactionsContract = getEthereumContract();

            await ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: "0x5208",
                    value: parsedAmount._hex
                }]
            });

            const transactionHash = await transactionsContract.sendToBlockChain(addressTo, parsedAmount, message, gif);

            setIsLoading(true);
            await transactionHash.wait();
            setIsLoading(false);

            const transactionCount = await transactionsContract.getTransactionCount();

            setTransactionCount(transactionCount.toNumber());
        } catch(error) {
            console.log(error);
            throw new Error('No ethereum object');
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionsExist();
    }, []);

    return (
        <TransactionContext.Provider value={{connectWallet, currentAccount, formData, setFormData, 
            handleChange, sendTransaction, transactions, isLoading}}>
            {children}
        </TransactionContext.Provider>
    )
}