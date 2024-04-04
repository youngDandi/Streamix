import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from './View/Home.jsx';
import Radio from './View/Radio.jsx';


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
