import {useLocation} from "react-router-dom";

import NavBar from "../components/NavBar";


const Home = () => {

    const {state} = useLocation();

  return (
      <div>
          <NavBar user_info={state} />
          <h1>Welcome {state.name}</h1>
          <p>Choose your action</p>
          <button>Summery</button>
          <button>Dashboard</button>
          <button>Withdraw</button>
          <button>Send money</button>

      </div>
  )
}

export default Home