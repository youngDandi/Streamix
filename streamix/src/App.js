import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from './FrontEnd/View/Home/Home.js';
import Radio from './FrontEnd/View/Radio/Radio.js';
import Video from './FrontEnd/View/Video/Video.js'

function App() {
  return (
    <div className="App">
      <Router>
          <Routes>
              <Route path='/' element={<Video></Video>} />
              <Route path='' element={<Video></Video>} />
              <Route path='' element={<Radio></Radio>} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
