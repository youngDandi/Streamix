import React, { useState } from 'react';
import './Display.css';
import ReactHowler from 'react-howler';

function Display({ soundType }) {
  const [isPlayingRadio1, setIsPlayingRadio1] = useState(false);
  const [isPlayingRadio2, setIsPlayingRadio2] = useState(false);
  const [isPlayingRadio3, setIsPlayingRadio3] = useState(false);
  const [isPlayingRadio4, setIsPlayingRadio4] = useState(false);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');

  const handleTogglePlayRadio1 = () => {
    setIsPlayingRadio1(!isPlayingRadio1);
    setName(document.getElementById('nome1').innerText);
    setNumber(document.getElementById('frequencia1').innerText);
  };

  const handleTogglePlayRadio2 = () => {
    setIsPlayingRadio2(!isPlayingRadio2);
    setName(document.getElementById('nome2').innerText);
    setNumber(document.getElementById('frequencia2').innerText);
  };

  const handleTogglePlayRadio3 = () => {
    setIsPlayingRadio3(!isPlayingRadio3);
    setName(document.getElementById('nome3').innerText);
    setNumber(document.getElementById('frequencia3').innerText);
  };

  const handleTogglePlayRadio4 = () => {
    setIsPlayingRadio4(!isPlayingRadio4);
    setName(document.getElementById('nome4').innerText);
    setNumber(document.getElementById('frequencia4').innerText);
  };

  return (
    <div className='Apresentacao'>
      <div className='Apre'>
        <div className='Categorias'>
          <text id='soundTypeV'>{soundType}</text>
          <text id='nameV'>{name}</text>
        </div>
        <text id='numberV'>{number}</text>
      </div>

      <div className='MaisPopulares'>
        <h1 id='maisPopu'>Mais Populares</h1>
        <h5 id='daSema'>Da semana</h5>
        <div className='borda'></div>

        <div className='RadioDiv' onClick={handleTogglePlayRadio1}>
          <h2 id='numero1'>01</h2>
          <h3 id='nome1'>Rádio Kairos</h3>
          <h4 id='frequencia1'>98.4</h4>
          {isPlayingRadio1 && (
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
            src='https://radios.vpn.sapo.pt/AO/radio9.mp3'
            playing={isPlayingRadio1}
          />
        </div>

        <div className='borda'></div>

        <div className='RadioDiv' onClick={handleTogglePlayRadio2}>
          <h2 id='numero2'>02</h2>
          <h3 id='nome2'>Rádio Mais</h3>
          <h4 id='frequencia2'>99.1</h4>
          {isPlayingRadio2 && (
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
            src='https://radios.vpn.sapo.pt/AO/radio10.mp3'
            playing={isPlayingRadio2}
          />
        </div>

        <div className='borda'></div>

        <div className='RadioDiv' onClick={handleTogglePlayRadio3}>
          <h2 id='numero3'>03</h2>
          <h3 id='nome3'>Rádio Escola</h3>
          <h4 id='frequencia3'>81.4</h4>
          {isPlayingRadio3 && (
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
            src='https://radios.vpn.sapo.pt/AO/radio1.mp3'
            playing={isPlayingRadio3}
          />
        </div>

        <div className='borda'></div>

        <div className='RadioDiv' onClick={handleTogglePlayRadio4}>
          <h2 id='numero4'>04</h2>
          <h3 id='nome4'>Rádio Lac</h3>
          <h4 id='frequencia4'>89.9</h4>
          {isPlayingRadio4 && (
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
            src='https://radios.vpn.sapo.pt/AO/radio14.mp3?1685629053605'
            playing={isPlayingRadio4}
          />
        </div>

        <div className='borda'></div>
      </div>
    </div>
  );
}

export default Display;
