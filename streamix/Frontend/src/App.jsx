import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from './View/Home/Home.jsx';
import Radio from './View/Radio/Radio.jsx';
import Description from './View/Description/Description.jsx';
import Streaming from "./View/Streaming/Streaming.jsx";
function App() {
  return (
    <div className="App">
      <Router>
          <Routes>
              <Route path='/' element={<Streaming></Streaming>} />
              <Route path='/Home' element={<Home></Home>} />
              <Route path='/Radio' element={<Radio></Radio>} />
              <Route path='/Description' element={<Description></Description>} />
              <Route path='/Streaming' element={<Streaming></Streaming>} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
