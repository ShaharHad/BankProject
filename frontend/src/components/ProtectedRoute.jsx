import {Navigate} from 'react-router-dom';


const ProtectedRoute = (components) => {


    if(sessionStorage.getItem("token") === null){
        return <Navigate to="/login" />;
    }

    return components.children;
}

export default ProtectedRoute;

