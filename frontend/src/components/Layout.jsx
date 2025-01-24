import {Outlet} from "react-router-dom";

import Navbar from "./NavBar.jsx";

const Layout = () => {
    return (
        <div>
            <Navbar />
            <Outlet/>
        </div>
    );
};

export default Layout;
