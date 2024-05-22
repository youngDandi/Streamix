import React, { useState } from 'react';
import './Description.css';

import MenuDiv from "../../Components/MenuDiv/MenuDiv";
import heart from '../../assets/img/icons8-gostar-50.png';
import redHeart from '../../assets/img/icons8-gostar-50_1.png';
import { useNavigate } from 'react-router-dom';

function Description() {

  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  const handleClick = () => {
    setLiked(!liked);
  };

  const handleBtnAssistir = () => {
    navigate('/Reproduction');
  };

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
                
                  
                    <button onClick={handleBtnAssistir}>Assistir</button>
                     
                    
                    <div className="likeBtn" onClick={handleClick}>
                      <img src={liked ? redHeart : heart} id="iconLike" alt=""/>
                    </div>
              </div>
            </div>
        
    </div>
  );
}

export default Description;
