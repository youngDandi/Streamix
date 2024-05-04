import './Streaming.css';
import MenuDiv from "../../Components/MenuDiv/MenuDiv";

import VideoJS from '../../Components/VideoJs/videoJs';
function Streaming() {

  
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
