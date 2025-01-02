import { createContext, useState, useContext } from "react";

// Create the Context
const GlobalContext = createContext(Number);

// Create a Provider Component
export const GlobalProvider = ({ children }) => {
    const [balance, setBalance] = useState(0);

    return (
        <GlobalContext.Provider value={{ balance, setBalance }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobal = () => useContext(GlobalContext);
