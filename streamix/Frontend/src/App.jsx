import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from './View/Home/Home.jsx';
import Radio from './View/Radio/Radio.jsx';
import Description from './View/Description/Description.jsx';
import Reproduction from "./View/Reproduction/Reproduction.jsx";
import Streaming from "./View/Streaming/Streaming.jsx";
import Login from "./View/Login/Login.jsx";
import SignUp from "./View/SignUp/SignUp.jsx";

function App() {
  return (
    <div className="App">
      <Router>
          <Routes>
              <Route path='/' element={<Login></Login>} />
              <Route path='/Home' element={<Home></Home>} />
              <Route path='/Radio' element={<Radio></Radio>} />
              <Route path='/Description' element={<Description></Description>} />
              <Route path='/Reproduction' element={<Reproduction></Reproduction>} />
              <Route path='/Streaming' element={<Streaming></Streaming>} />
              <Route path='/Login' element={<Login></Login>} />
              <Route path='/SignUp' element={<SignUp></SignUp>} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
