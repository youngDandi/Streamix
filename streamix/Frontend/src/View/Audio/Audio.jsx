import './Audio.css';
import MenuDiv from "../../Components/MenuDiv/MenuDiv";
import SearchBar from "../../Components/SearchBar/SearchBar"
import AddBar from "../../Components/AddBtn/AddBtn"
import { useNavigate } from 'react-router-dom';

function Audio() {

    const navigate = useNavigate();

  const handleFilmPlayerClick = () => {
    navigate('/Description');
  };

  return (
    <div className='todaPaginaA'>
        <MenuDiv></MenuDiv>
        <div className="audioPresentation">
                    <div className="searchAdd_audio">
                        <SearchBar type='Pesquisa por vídeos e etc...' />
                        <AddBar id="addBtn" />
                    </div>
                    <div className='Apre_audio'>
                        <div className='Categorias_audio'>
                            <text id='radio_audio'>Rádio</text>
                            <text id='name_audio'> Kairos</text>
                        </div>
                        <text id='numberA_audio'>99.1</text>
                    </div>
                    <div className="audioPerfil">
                        <div className="maisPopularesDiv">
                            <h2>Mais Populares</h2>
                            <h5>Da semana</h5>
                            <div className='borda_audio'></div>
                        </div>
                        <div className="topMusicos">

                        </div>
                    </div>
        </div>
          
              
    </div>
  );
}

export default Audio;
