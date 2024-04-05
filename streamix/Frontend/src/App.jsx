import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from './View/Home/Home.jsx';
import Radio from './View/Radio/Radio.jsx';
import Reproduction from './View/Reproduction/Reproduction.jsx';
import Description from './View/Description/Description.jsx';
function App() {
  return (
    <div className="App">
      <Router>
          <Routes>
              <Route path='/' element={<Reproduction></Reproduction>} />
              <Route path='' element={<Home></Home>} />
              <Route path='' element={<Radio></Radio>} />
              <Route path='' element={<Description></Description>} />
              <Route path='' element={<Reproduction></Reproduction>} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
