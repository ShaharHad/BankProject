import {createContext, useState, useContext, useEffect, useRef} from "react";

// Create the Context
const GlobalContext = createContext(Number);

// Create a Provider Component
export const GlobalProvider = (components) => {
    const children = components.children;
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const isTransactionsChanged = useRef(true);
    const account = useRef({});
    const baseUrl = import.meta.env.VITE_BASE_URL;

    const setNewBalance = (newBalance) => {
        sessionStorage.setItem("balance", newBalance);
        setBalance(newBalance);
    }

    useEffect(() => {
        setBalance(sessionStorage.getItem("balance"));
        if(sessionStorage.getItem("account")!= null){
            const storedAccount = sessionStorage.getItem("account");
            if(storedAccount != null){
                account.current = JSON.parse(storedAccount);
            }
        }
    }, [])

    return (
        <GlobalContext.Provider value={{ balance, setBalance, baseUrl,
            transactions, setTransactions, isTransactionsChanged, account, setNewBalance}}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobal = () => useContext(GlobalContext);
