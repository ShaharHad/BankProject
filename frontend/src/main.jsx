import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';

import './index.css'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Home from "./pages/Home.jsx";
import Deposit from "./pages/Deposit.jsx";
import Withdraw from "./pages/Withdraw.jsx";
import Transfer from "./pages/Transfer.jsx";
import Transactions from "./pages/Transactions.jsx";
import {GlobalProvider} from "./components/GlobalProvider.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";


import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


const router = createBrowserRouter([
    {path: '/', element: <Login/>},
    {path: '/login', element: <Login/>},
    {path: '/register', element: <Register/>},
    {path: '/user/home', element: <ProtectedRoute> <Home/> </ProtectedRoute>},
    {path: '/user/deposit', element: <ProtectedRoute> <Deposit/> </ProtectedRoute>},
    {path: '/user/withdraw', element: <ProtectedRoute> <Withdraw/> </ProtectedRoute>},
    {path: '/user/transfer', element: <ProtectedRoute> <Transfer/> </ProtectedRoute>},
    {path: '/user/transactions', element: <ProtectedRoute> <Transactions/> </ProtectedRoute>},
])

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <GlobalProvider>
                <RouterProvider router={router}/>
        </GlobalProvider>
    </StrictMode>,
)
