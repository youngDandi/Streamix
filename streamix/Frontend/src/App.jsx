import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from './View/Home/Home.jsx';
import Radio from './View/Radio/Radio.jsx';
import Video from "./View/Video/Video.jsx";
import Description from './View/Description/Description.jsx';
import Reproduction from "./View/Reproduction/Reproduction.jsx";

import Login from "./View/Login/Login.jsx";
import SignUp from "./View/SignUp/SignUp.jsx";
import Audio from "./View/Audio/Audio.jsx";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/Home' element={<Home />} />
          <Route path='/Radio' element={<Radio />} />
          <Route path='/Video' element={<Video />} />
          <Route path='/Description' element={<Description />} />
          <Route path='/Reproduction' element={<Reproduction />} />
          
          <Route path='/Login' element={<Login />} />
          <Route path='/SignUp' element={<SignUp />} />
          <Route path='/Audio' element={<Audio />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
