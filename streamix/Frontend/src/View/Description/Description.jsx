import './Description.css';

import MenuDiv from "../../Components/MenuDiv/MenuDiv";
// import VideoPlayer from '../../Components/VideoPlayer/VideoPlayer';
import videoPath from '../../assets/img/Interstellar_Trailer.mp4';
import thumbPath from "../../assets/img/interstellar.jpg";


function Description() {

  
  return (
    <div className="todaPaginaD">
        <MenuDiv></MenuDiv>
            <div className='Items'>
              <div className='itemInfo'>
                  <h1 id='titleD'>Interstellar</h1>
                  <h5 id='descriptionD'>Uma equipa de exploradores viaja através de um buraco de minhoca no espaço<br/>
                      numa tentativa de garantir a sobrevivência da humanidade.</h5>
                  <div className='videoClassification'>
                    <h4 className='category1D'>SCI-FI</h4>
                    <h4 className='category2D'>DRAMA</h4>
                    <h4 className='category3D'>AVENTURA</h4>
                  </div>    
              </div>
              <div className='buttonPlayer'>
                
                <button >
                
                  Assistir
                  </button>
                
              </div>
            </div>
        
    </div>
  );
}

export default Description;
