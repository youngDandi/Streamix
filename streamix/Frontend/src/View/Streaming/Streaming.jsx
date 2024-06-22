import './Streaming.css';
import React, { useEffect } from 'react';
import MenuDiv from "../../Components/MenuDiv/MenuDiv";
import { useAuth } from '../../hooks/AuthContext.jsx';
import VideoJS from '../../Components/VideoJs/videoJs';
function Streaming() {
// Usando o hook useAuth para obter os dados do usuário logado
const { user } = useAuth();

// Exibindo todos os dados do usuário logado no console
useEffect(() => {
  console.log("Dados do usuário logado:", user);
}, [user]);
  
  return (
    <div className="todaPaginaS">
        <MenuDiv></MenuDiv>
            <div className='VideoS'>
              <div className='videoInfoS'>
                  <h1 id='title'>Serviço de Streaming</h1>
                  
                      
              </div>
              <div className='videoPlayerS'>
                <iframe 
                  src="http://192.168.137.108:4747/video" 
                 
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  title="Video Stream"
                ></iframe>
        </div>
            </div>
        
    </div>
  );
}

export default Streaming;
