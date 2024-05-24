import './Audio.css';
import MenuDiv from "../../Components/MenuDiv/MenuDiv";
import SearchBar from "../../Components/SearchBar/SearchBar";
import AddBar from "../../Components/AddBtn/AddBtn";
import { useNavigate } from 'react-router-dom';
import audioFile from '../../assets/audio/imperfeito.mp3';
import artistPhoto from '../../assets/img/drake.jpg';
import backward from '../../assets/img/backward.png';
import pause from '../../assets/img/pause.png';
import forward from '../../assets/img/forward.png';
import play from '../../assets/img/play.png';
import { useEffect, useRef, useState } from 'react';

function Audio() {
    const navigate = useNavigate();
    const audioRef = useRef(null);
    const progressRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audioElement = audioRef.current;
        const updateProgress = () => {
            setCurrentTime(audioElement.currentTime);
            if (progressRef.current) {
                progressRef.current.value = (audioElement.currentTime / audioElement.duration) * 100;
            }
        };
        if (audioElement) {
            audioElement.addEventListener('timeupdate', updateProgress);
            audioElement.addEventListener('loadedmetadata', () => {
                setDuration(audioElement.duration);
            });
        }
        return () => {
            if (audioElement) {
                audioElement.removeEventListener('timeupdate', updateProgress);
            }
        };
    }, []);

    const playPause = () => {
        const audioElement = audioRef.current;
        if (audioElement.paused) {
            audioElement.play();
            setIsPlaying(true);
        } else {
            audioElement.pause();
            setIsPlaying(false);
        }
    };

    const handleProgressChange = (event) => {
        const audioElement = audioRef.current;
        const progress = event.target.value;
        audioElement.currentTime = (progress / 100) * audioElement.duration;
        setCurrentTime(audioElement.currentTime);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
                    
                    <div className="CA">
                        
                        <div className='Categorias_audio1'>
                        <h1>#1</h1>    
                        <h4>Playlist</h4>
                        <h1>Rap Caviar</h1>
                        </div>
                        <div className="Categorias_audio2">
                            <h4>Artista</h4>
                            <h1>Drake</h1>
                        </div>
                    </div>
                    
                </div>
                <div className="audioPerfil">
                    <div className="maisPopularesDiv">
                        <h2>Mais Populares</h2>
                        <h5 id='daSemana'>Da semana</h5>
                        <div className='borda_audio'></div>
                        <div className="songDiv">
                            <h3 id='position'>01</h3>
                            <div className="tituloNome">
                                <h3 id='ttleSong'>Rapper Favorito</h3>
                                <h5 id='artistN'>Kelson Most Wanted</h5>
                            </div>
                            <h5 id='genreDuration'>Rap/Hip-Hop</h5>
                            <h5 id='genreDuration'>3:14</h5>
                        </div>
                        <div className="songDiv">
                            <h3 id='position'>02</h3>
                            <div className="tituloNome">
                                <h3 id='ttleSong'>Rapper Favorito</h3>
                                <h5 id='artistN'>Kelson Most Wanted</h5>
                            </div>
                            <h5 id='genreDuration'>Rap/Hip-Hop</h5>
                            <h5 id='genreDuration'>3:14</h5>
                        </div>
                        <div className="songDiv">
                            <h3 id='position'>03</h3>
                            <div className="tituloNome">
                                <h3 id='ttleSong'>Rapper Favorito</h3>
                                <h5 id='artistN'>Kelson Most Wanted</h5>
                            </div>
                            <h5 id='genreDuration'>Rap/Hip-Hop</h5>
                            <h5 id='genreDuration'>3:14</h5>
                        </div>
                    </div>
                    <div className="topMusicos">
                        <h2>Top Músicos</h2>
                        <h5 id='daSemana'>Da semana</h5>
                        <div className='borda_perfil'></div>
                        <div className="artistInfo">
                            <img src={artistPhoto} id="artistPhoto" alt=""/>
                            <div className="tituloNome">
                                <h3 id='ttleSong'>Drake</h3>
                                <h5 id='artistN'>53.000.000 seguidores</h5>
                            </div>
                        </div>
                        <div className="artistInfo">
                            <img src={artistPhoto} id="artistPhoto" alt=""/>
                            <div className="tituloNome">
                                <h3 id='ttleSong'>Drake</h3>
                                <h5 id='artistN'>53.000.000 seguidores</h5>
                            </div>
                        </div>
                        <div className="artistInfo">
                            <img src={artistPhoto} id="artistPhoto" alt=""/>
                            <div className="tituloNome">
                                <h3 id='ttleSong'>Drake</h3>
                                <h5 id='artistN'>53.000.000 seguidores</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <audio ref={audioRef} id='song'>
                    <source src={audioFile} type="audio/mp3" />
                    Seu navegador não suporta o elemento de áudio.
                </audio>
                <div className="audioPlayer-div">
                    <img src={artistPhoto} id="artistP" alt=""/>
                    <h9 id='artisTitle'>Drake - Take Care</h9>
                    <div className="controls">
                        
                        <img 
                            src={isPlaying ? pause : play} 
                            className="icons" 
                            id='ctrlIcon' 
                            alt="Play/Pause" 
                            onClick={playPause}
                        />
                        
                    </div>
                    <h9 id="range1">{formatTime(currentTime)}</h9>
                    <input 
                        type='range' 
                        value={currentTime / duration * 100} 
                        id='progress' 
                        ref={progressRef}
                        onChange={handleProgressChange}
                    />
                    <h9 id="range2">{formatTime(duration)}</h9>
                </div>
            </div>
        </div>
    );
}

export default Audio;
