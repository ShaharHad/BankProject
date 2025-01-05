import { createContext, useState, useContext } from "react";

// Create the Context
const GlobalContext = createContext(Number);

// Create a Provider Component
export const GlobalProvider = ({ children }) => {
    const [balance, setBalance] = useState(0);
    const baseUrl = import.meta.env.VITE_BASE_URL;

    return (
        <GlobalContext.Provider value={{ balance, setBalance, baseUrl }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobal = () => useContext(GlobalContext);
