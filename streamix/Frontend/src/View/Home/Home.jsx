import './Home.css';
import MenuDiv from "../../Components/MenuDiv/MenuDiv";


function Home() {
  return (
    <div className='todaPagina'>
        <MenuDiv></MenuDiv>
        <div className="multimediaDiv">
              <div className="filmDiv">
                <div className="filmPlayer" id='filmPlayer1'>
                  <div className="videoDescriptionH">
                      <h2 id='title'>Interstellar</h2>
                      <h5 id='descriptionH'>Uma equipa de exploradores viaja através de um buraco de minhoca no espaço<br/>
                        numa tentativa de garantir a sobrevivência da humanidade. </h5>
                        <div className='videoClassificationH'>
                          <h4 className='category1H'>SCI-FI</h4>
                          <h4 className='category2H'>DRAMA</h4>
                          <h4 className='category3H'>AVENTURA</h4>
                        </div> 
                  </div>  
                </div>
                <div className="filmPlayerMiniDiv">
                    <div className="filmPlayerMini" id='filmPlayer2'>
                      <div className="videoDescriptionH_mini">
                            <h2 id='title_mini'>Oppenheimer</h2>
                            <h5 id='descriptionH_mini'>A história do papel de J. Robert Oppenheimer no desenvolvimento<br/>
                            da bomba atômica durante a Segunda Guerra Mundial. </h5>
                              <div className='videoClassificationH_mini'>
                                <h4 className='category1H_mini'>SCI-FI</h4>
                                <h4 className='category2H_mini'>DRAMA</h4>
                                <h4 className='category3H_mini'>AVENTURA</h4>
                              </div> 
                        </div>
                      </div>
                      <div className="filmPlayerMini" id='filmPlayer3'>
                      <div className="videoDescriptionH_mini">
                            <h2 id='title_mini'>Dark</h2>
                            <h5 id='descriptionH_mini'>Uma criança desaparecida faz com que quatro famílias se ajudem em busca de respostas. O que elas não poderiam imaginar é que esse mistério estaria ligado a inúmeros outros segredos da pequena cidade.<br/>
                               </h5>
                              <div className='videoClassificationH_mini'>
                                <h4 className='category1H_mini'>SCI-FI</h4>
                                <h4 className='category2H_mini'>DRAMA</h4>
                                <h4 className='category3H_mini'>AVENTURA</h4>
                              </div> 
                        </div>
                      </div>
                </div>
                
        </div>
            <div className="musicDiv">
              <h2>Lista de Músicas</h2>
              <div className="musicPlayerDiv">
                  <div className="musicPlayer" id='musicPlayer1'>
                        <div className="musicDescriptionH">
                                  <h2 id='musicTitle'>Take Care</h2>
                                  <h4 id='artistName'>Drake</h4>            
                        </div>
                  </div>
                  <div className="musicPlayer" id='musicPlayer2'>
                        <div className="musicDescriptionH">
                                        <h2 id='musicTitle'>Freeblack</h2>
                                        <h4 id='artistName'>6lack</h4>            
                        </div>
                  </div>
                  <div className="musicPlayer" id='musicPlayer3'>
                        <div className="musicDescriptionH">
                                        <h2 id='musicTitle'>Dark Sky Paradise</h2>
                                        <h4 id='artistName'>Big Sean</h4>            
                        </div>
                  </div>
                  <div className="musicPlayer" id='musicPlayer4'>
                        <div className="musicDescriptionH">
                                        <h2 id='musicTitle'>Jackboys</h2>
                                        <h4 id='artistName'>Travis Scott</h4>            
                        </div>
                  </div>
              </div>
            </div>
        </div>
        
        
    </div>
  );
}

export default Home;
