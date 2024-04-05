import './Reproduction.css';

import MenuDiv from "../../Components/MenuDiv/MenuDiv";
import VideoPlayer from '../../Components/VideoPlayer/VideoPlayer';
import videoPath from '../../assets/img/Interstellar_Trailer.mp4';
import thumbPath from "../../assets/img/interstellar.jpg";

function Reproduction() {

  
  return (
    <div className="todaPaginaV">
        <MenuDiv></MenuDiv>
            <div className='Video'>
              <div className='videoInfo'>
                  <h1 id='title'>Interstellar</h1>
                  <h5 id='description'>Uma equipa de exploradores viaja através de um buraco de minhoca no espaço<br/>
                      numa tentativa de garantir a sobrevivência da humanidade. </h5>
                  <div className='videoClassification'>
                    <h4 className='category1'>SCI-FI</h4>
                    <h4 className='category2'>DRAMA</h4>
                    <h4 className='category3'>AVENTURA</h4>
                  </div>    
              </div>
              <div className='videoPlayer'>
                <VideoPlayer  videoPath={videoPath} thumbPath={thumbPath}/>
                
                
              </div>
            </div>
        
    </div>
  );
}

export default Reproduction;
