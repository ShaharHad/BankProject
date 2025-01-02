import {Navigate} from 'react-router-dom';

const ProtectedRoute = ({children}) => {

    if(sessionStorage.getItem("token") === null){
        return <Navigate to="/login" />;
    }

    return children;
}

export default ProtectedRoute;

