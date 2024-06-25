import "./Audio.css";
import MenuDiv from "../../Components/MenuDiv/MenuDiv";
import SearchBar from "../../Components/SearchBar/SearchBar";
import avancar from "../../assets/img/forward.png";
import recuar from "../../assets/img/backward.png";
import audioFile from "../../assets/audio/imperfeito.mp3";
import artistPhoto from "../../assets/img/drake.jpg";
import plusIcon from "../../assets/img/icons8-soma-30_1.png";
import addVideo from "../../assets/img/addVideo.png";
import addThumb from "../../assets/img/addThumb.png";
import pause from "../../assets/img/pause.png";
import play from "../../assets/img/play.png";
import Modal1 from "../../Components/Modal1/Modal1";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

function Audio() {
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [audio, setAudio] = useState(null);
  const [index, setIndex] = useState(0);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [artist, setArtist] = useState("");
  const [audios, setAudios] = useState([]);

  const selectSong = (music, newIndex) => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    audioElement.src = music.audioUrl;
    audioElement.load();
    document.getElementById("artistP").src = music.thumbnail;
    document.getElementById("artisTitle").innerHTML = `${music.artist} - ${music.title}`;
    audioElement.play().then(() => setIsPlaying(true));
    setIndex(newIndex);
  };

  const nextSong = () => {
    if (index < audios.length - 1) {
      selectSong(audios[index + 1], index + 1);
    }
  };

  const prevSong = () => {
    if (index > 0) {
      selectSong(audios[index - 1], index - 1);
    }
  };

  useEffect(() => {
    const audioElement = audioRef.current;

    const fetchGenres = async () => {
      try {
        const response = await fetch("src/View/Audio/genres.json");
        const data = await response.json();
        setGenres(data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    const fetchAudios = async () => {
      try {
        const response = await axios.get("http://localhost:3001/audios");
        setAudios(response.data.songs);
      } catch (error) {
        console.error("Error fetching audios:", error);
      }
    };

    fetchGenres();
    fetchAudios();

    const updateProgress = () => {
      if (!audioElement) return;

      setCurrentTime(audioElement.currentTime);
      if (progressRef.current) {
        progressRef.current.value = (audioElement.currentTime / audioElement.duration) * 100;
      }
    };

    if (audioElement) {
      audioElement.addEventListener("timeupdate", updateProgress);
      audioElement.addEventListener("loadedmetadata", () => {
        setDuration(audioElement.duration);
      });
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("timeupdate", updateProgress);
      }
    };
  }, []);

  const playPause = () => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

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
    if (!audioElement) return;

    const progress = event.target.value;
    audioElement.currentTime = (progress / 100) * audioElement.duration;
    setCurrentTime(audioElement.currentTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleAddBtnClick = () => {
    setOpen(true);
  };

  const handleInputChange = (e) => {
    setTitle(e.target.value);
  };

  const handleArtistChange = (e) => {
    setArtist(e.target.value);
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleAudioChange = (e) => {
    setAudio(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", title);
    data.append("thumbnail", thumbnail);
    data.append("audio", audio);
    data.append("genre", selectedGenre);
    data.append("artist", artist);
    console.log(data);

    axios
      .post("http://localhost:3001/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        setOpen(false);
      })
      .catch((error) => {
        console.error("Error uploading audio:", error);
        alert("Error uploading audio: " + error.message);
      });
  };

  return (
    <div className="todaPaginaA">
      <MenuDiv />
      <div className="audioPresentation">
        <div className="searchAdd_audio">
          <SearchBar type="Pesquisa por músicas e etc..." />
          <button className="addContent" onClick={handleAddBtnClick}>
            <img src={plusIcon} alt="search" className="plusIcon" />
          </button>
        </div>
        <div className="Apre_audio">
          <div className="CA">
            <div className="Categorias_audio1">
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
            <h5 id="daSemana">Da semana</h5>
            <div className="borda_audio"></div>
            {audios.map((audio, idx) => (
              <div
                onClick={() => selectSong(audio, idx)}
                className="songDiv"
                key={idx}
              >
                <h3 id="position">0{idx + 1}</h3>
                <div className="tituloNome">
                  <h3 id="ttleSong">{audio.title}</h3>
                  <h5 id="artistN">{audio.artist}</h5>
                </div>
                <h5 id="genreDuration">{audio.genre}</h5>
                <h5 id="genreDuration">{formatTime(audio.duration)}</h5>
              </div>
            ))}
          </div>
          <div className="topMusicos">
            <h2>Top Músicos</h2>
            <h5 id="daSemana">Da semana</h5>
            <div className="borda_perfil"></div>
            <div className="artistInfo">
              <img src={artistPhoto} id="artistPhoto" alt="" />
              <div className="tituloNome">
                <h3 id="ttleSong">Drake</h3>
                <h5 id="artistN">53.000.000 seguidores</h5>
              </div>
            </div>
            <div className="artistInfo">
              <img src={artistPhoto} id="artistPhoto" alt="" />
              <div className="tituloNome">
                <h3 id="ttleSong">Drake</h3>
                <h5 id="artistN">53.000.000 seguidores</h5>
              </div>
            </div>
            <div className="artistInfo">
              <img src={artistPhoto} id="artistPhoto" alt="" />
              <div className="tituloNome">
                <h3 id="ttleSong">Drake</h3>
                <h5 id="artistN">53.000.000 seguidores</h5>
              </div>
            </div>
          </div>
        </div>

        <audio ref={audioRef} id="song">
          <source src={audioFile} type="audio/mp3" />
          Seu navegador não suporta o elemento de áudio.
        </audio>
        <div className="audioPlayer-div reprodution-bar">
          <img
            src={
              audios[index]
                ? audios[index].thumbnail
                : "https://i.scdn.co/image/ab67616d0000b273195914741c73d89485ef678b"
            }
            id="artistP"
            alt=""
          />
          <h9 id="artisTitle">
            {audios[index] ? `${audios[index].artist} - ${audios[index].title}` : "Desconhecido - Sem título"}
          </h9>
          <div className="controls">
            <img
              src={recuar}
              className="icons"
              id="ctrlIcon"
              alt="Recuar"
              onClick={prevSong}
            />
            <img
              src={isPlaying ? pause : play}
              className="icons"
              id="ctrlIcon"
              alt="Play/Pause"
              onClick={playPause}
            />
            <img
              src={avancar}
              className="icons"
              id="ctrlIcon"
              alt="Next"
              onClick={nextSong}
            />
          </div>
          <h9 id="range1">{formatTime(currentTime)}</h9>
          <input
            type="range"
            value={(currentTime / duration) * 100}
            id="progress"
            ref={progressRef}
            onChange={handleProgressChange}
          />
          <h9 id="range2">{formatTime(duration)}</h9>
        </div>
      </div>

      {open && (
        <Modal1 open={open} onClose={() => setOpen(false)}>
          <div className="text-center w-56">
            <div className="corpo">
              <h3 className="titleModel">Adicione o seu áudio</h3>
              <form onSubmit={handleSubmit}>
                <input
                  placeholder="Titulo"
                  onChange={handleInputChange}
                  type="text"
                  className="Input"
                  id="i1"
                />
                {<br/>}
                <input
                  placeholder="Artista"
                  onChange={handleArtistChange}
                  type="text"
                  className="Input"
                  id="i1"
                />
                <select
                  name="generos"
                  id="i1"
                  onChange={handleGenreChange}
                  value={selectedGenre}
                >
                  <option value="" selected disabled>
                    Gênero
                  </option>
                  {genres.map((genre, index) => (
                    <option key={index} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
                <input
                  type="file"
                  id="thumb-select"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  className="Input"
                  id="i2"
                  onClick={() => document.getElementById("thumb-select").click()}
                >
                  <img src={addThumb} alt="upload thumbnail" className="addVideo_Thumb" />
                  Carregar a capa
                </button>
                <input
                  type="file"
                  id="audio-select"
                  accept="audio/*"
                  onChange={handleAudioChange}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  className="Input"
                  id="i2"
                  onClick={() => document.getElementById("audio-select").click()}
                >
                  <img src={addVideo} alt="upload audio" className="addVideo_Thumb" />
                  Carregar o áudio
                </button>
                <div className="btnDiv">
                  <button type="submit" className="btn-confirmar">
                    Confirmar
                  </button>
                  <button
                    type="button"
                    className="btn-cancelar"
                    onClick={() => setOpen(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal1>
      )}
    </div>
  );
}

export default Audio;
