import './Video.css';
import MenuDiv from "../../Components/MenuDiv/MenuDiv";
import SearchBar from "../../Components/SearchBar/SearchBar"
import plusIcon from '../../assets/img/icons8-soma-30_1.png';

import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Modal1 from '../../Components/Modal1/Modal1';
import addVideo from "../../assets/img/addVideo.png";
import addThumb from "../../assets/img/addThumb.png";
function Video() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

  const handleFilmPlayerClick = () => {
    navigate('/Description');
  };

  const handleAddBtnClick = () => {
        
    setOpen(true);
    
};

  return (
    <div className='todaPaginaV'>
        <MenuDiv></MenuDiv>
        <div className="multimediaDivV">
              <div className="searchAdd">
                  <SearchBar type='Pesquisa por vídeos e etc...' />
                  <button className='addContent' onClick={handleAddBtnClick}>
                    <img src={plusIcon} alt="search" className="plusIcon"  />
                              
                  </button>
                </div>
              <div className="filmDivV">
              
                        <div className="filmPlayerV" id='filmPlayer1V' onClick={handleFilmPlayerClick}>
                            
                          
                            <div className="viDescriptionV" >
                                    <h2 id='titleV'>Interstellar</h2>
                                    <h5 id='descriptionV'>Uma equipa de exploradores viaja através de um buraco de minhoca no espaço<br/>
                                        numa tentativa de garantir a sobrevivência da humanidade. </h5>
                                    <div className='videoClassificationV'>
                                        <h4 className='category1V'>SCI-FI</h4>
                                        <h4 className='category2V'>DRAMA</h4>
                                        <h4 className='category3V'>AVENTURA</h4>
                                    </div> 
                            </div>  
                        </div>
                
                <div className="filmPlayerMiniDivV">
                    <div className="filmPlayerMiniV" id='filmPlayer2V'>
                      <div className="videoDescriptionV_mini">
                            <h2 id='title_miniV'>Oppenheimer</h2>
                            <h5 id='descriptionV_mini'>A história do papel de J. Robert Oppenheimer no desenvolvimento<br/>
                            da bomba atômica durante a Segunda Guerra Mundial. </h5>
                              <div className='videoClassificationV_mini'>
                                <h4 className='category1V_mini'>SCI-FI</h4>
                                <h4 className='category2V_mini'>DRAMA</h4>
                                <h4 className='category3V_mini'>AVENTURA</h4>
                              </div> 
                        </div>
                      </div>
                      
                </div>
                
        </div>
            <div className="videoDiv">
              <h2>Lista de Vídeos</h2>
              <div className="videoPlayerDiv">
                  <div className="viPlayer" id='viPlayer1'>
                        <div className="videoDescriptionV">
                                  <h2 id='videoTitle'>1988</h2>
                                  <h4 id='videoInfo'>2021, Sci-Fi</h4>            
                        </div>
                  </div>
                  <div className="viPlayer" id='viPlayer2'>
                        <div className="videoDescriptionV">
                                        <h2 id='videoTitle'>Peaky Blinders</h2>
                                        <h4 id='videoInfo'>2016, Action</h4>            
                        </div>
                  </div>
                  <div className="viPlayer" id='viPlayer3'>
                        <div className="videoDescriptionV">
                                        <h2 id='videoTitle'>Vikings Valhala</h2>
                                        <h4 id='videoInfo'>2019, Action</h4>            
                        </div>
                  </div>
                  <div className="viPlayer" id='viPlayer4'>
                        <div className="videoDescriptionV">
                                        <h2 id='videoTitle'>Dark</h2>
                                        <h4 id='videoInfo'>2020, Sci-Fi</h4>            
                        </div>
                  </div>
              </div>
            </div>
        </div>
        {open && <Modal1 open={open} onClose={() => setOpen(false)}>
                        <div className="text-center w-56">
                            
                            <div className="corpo">
                                <h3 className="titleModel">Adicione o seu video</h3>

                                <input placeholder='Titulo' type='text' className='Input' id='i1'/>
                                <button className='Input' id='i2'>
                                    <img src={addThumb} alt="search" className="addVideo_Thumb" />
                                    Carregar a thumbnail
                                </button>
                                <button className='Input' id='i2'>
                                    <img src={addVideo} alt="search" className="addVideo_Thumb" />
                                    Carregar o video
                                    </button>
                                
                                <div className="btnDiv">
                                    <button className="btn-confirmar">Confirmar</button>
                                    <button className="btn-cancelar" onClick={() => setOpen(false)}>Cancelar</button>

                                </div>
                            </div>
                            
                        </div>
                        </Modal1>
                        } 
    </div>
  );
}

export default Video;
