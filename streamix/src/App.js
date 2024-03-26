import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from './FrontEnd/View/Home.js';
import Radio from './FrontEnd/View/Radio.js';


function App() {
  return (
    <div className="App">
      <Router>
          <Routes>
              <Route path='/' element={<Radio></Radio>} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
