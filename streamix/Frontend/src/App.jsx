import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './View/Home/Home.jsx';
import Radio from './View/Radio/Radio.jsx';
import Video from "./View/Video/Video.jsx";
import Description from './View/Description/Description.jsx';
import Reproduction from "./View/Reproduction/Reproduction.jsx";
import Login from "./View/Login/Login.jsx";
import SignUp from "./View/SignUp/SignUp.jsx";
import Audio from "./View/Audio/Audio.jsx";
import { AuthProvider } from '../../Frontend/src/hooks/AuthContext.jsx';

function App() {
  return (
    <div className='App'>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/Home' element={<Home />} />
            <Route path='/Radio' element={<Radio />} />

            {/* Rota para a página principal de vídeos */}
            <Route path='/Video' element={<Video />} />
            
            {/* Rota para exibir detalhes do vídeo por _id */}
            <Route path='/Video/:id' element={<Description />} />

            {/* Rota para reprodução de vídeo por _id */}
            <Route path='/Play/:id' element={<Reproduction />} />

            <Route path='/Login' element={<Login />} />
            <Route path='/SignUp' element={<SignUp />} />
            <Route path='/Audio' element={<Audio />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;

