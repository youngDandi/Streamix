import './Radio.css';
import React, { useState } from 'react';
import MenuDiv from "../../Components/MenuDiv/MenuDiv";
import plusIcon from '../../assets/img/icons8-soma-30_1.png';
import ReactHowler from 'react-howler';
import SearchBar from "../../Components/SearchBar/SearchBar";
import Modal1 from '../../Components/Modal1/Modal1';
import { Radios } from '../../mocks/radio';
import axios from 'axios';

function Radio() {
  const [playingRadioId, setPlayingRadioId] = useState(null);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [open, setOpen] = useState(false);

  // Estados para armazenar os dados dos inputs da modal
  const [nomeInput, setNomeInput] = useState('');
  const [linkInput, setLinkInput] = useState('');
  const [frequenciaInput, setFrequenciaInput] = useState('');

  const handleTogglePlay = (radio) => {
    if (playingRadioId === radio.id) {
      setPlayingRadioId(null);
    } else {
      setPlayingRadioId(radio.id);
      setName(radio.nome);
      setNumber(radio.frequencia);
    }
  };

  const handleAddBtnClick = () => {
    setOpen(true);
  };

  // Função de submissão dos dados da modal
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('nome', nomeInput);
    data.append('link', linkInput);
    data.append('frequencia', frequenciaInput);

    axios
      .post('http://localhost:3001/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log(response);
        // Aqui você pode adicionar lógica para lidar com o sucesso do envio
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert('Error:' + errorCode + ' ' + errorMessage);
      });

    setOpen(false); // Fecha a modal após a submissão
  };

  return (
    <div className='todaPaginaR'>
      <MenuDiv />

      <div className='Apresentacao'>
        <div className="searchAdd_radio">
          <SearchBar type='Pesquisa por rádios e etc...' />
          <button className='addContent' onClick={handleAddBtnClick}>
            <img src={plusIcon} alt="Adicionar" className="plusIcon" />
          </button>
        </div>
        <div className='Apre'>
          <div className='Categorias'>
            
            <text id='nameR'> {name || ""}</text>
          </div>
          <text id='numberR'>{number || ""}</text>
        </div>
        <div className='MaisPopulares'>
          <h1 id='maisPopu'>Lista de Rádios</h1>
          <h5 id='daSema'>Ouvir Agora</h5>
          <div className='borda'></div>
          {Radios.map((radio, index) => (
            <React.Fragment key={radio.id}>
              <div className='RadioDiv' onClick={() => handleTogglePlay(radio)}>
                <h2 id={`numero${index + 1}`}>{`0${index + 1}`}</h2>
                <h3 id={`nome${index + 1}`}>{radio.nome}</h3>
                <h4 id={`frequencia${index + 1}`}>{radio.frequencia}</h4>
                {playingRadioId === radio.id && (
                  <>
                    <div className='live'>LIVE</div>
                    <div className='playing'>
                      <div className='rect1'></div>
                      <div className='rect2'></div>
                      <div className='rect3'></div>
                      <div className='rect4'></div>
                      <div className='rect5'></div>
                    </div>
                  </>
                )}
                <ReactHowler
                  src={radio.link}
                  playing={playingRadioId === radio.id}
                />
              </div>
              <div className='borda'></div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {open && (
        <Modal1 open={open} onClose={() => setOpen(false)}>
          <div className="text-center w-56">
            <div className="corpo">
              <h3 className="titleModel">Adicione a sua rádio</h3>
              <form onSubmit={handleSubmit}>
                <input
                  placeholder='Nome'
                  type='text'
                  className='Input'
                  id='i1'
                  value={nomeInput}
                  onChange={(e) => setNomeInput(e.target.value)}
                />
                <input
                  placeholder='Link'
                  type='text'
                  className='Input'
                  id='i1'
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                />
                <input
                  placeholder='Frequência'
                  type='text'
                  className='Input'
                  id='i1'
                  value={frequenciaInput}
                  onChange={(e) => setFrequenciaInput(e.target.value)}
                />
                <div className="btnDiv">
                  <button type="submit" className="btn-confirmar">Confirmar</button>
                  <button type="button" className="btn-cancelar" onClick={() => setOpen(false)}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        </Modal1>
      )}
    </div>
  );
}

export default Radio;
