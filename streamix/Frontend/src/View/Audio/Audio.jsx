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
import { useAuth } from '../../hooks/AuthContext.jsx';




function Audio() {
// Usando o hook useAuth para obter os dados do usuário logado
const { user } = useAuth();


// Exibindo todos os dados do usuário logado no console
useEffect(() => {
  console.log("Dados do usuário logado:", user);
}, [user]);

  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [open, setOpen] = useState(false);
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [audio, setAudio] = useState(null);
  const [index, setIndex] = useState(0);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [artist, setArtist] = useState("");
  const [audios, setAudios] = useState([]);
  const [visibility, setVisibility] = useState('public');
  const [users, setUsers] = useState([]); // Estado para armazenar os dados dos usuários
  const [grupo, setGrupo] = useState([user]);
  const [grupoRetornado, setGrupoRetornado] = useState(null); // Estado para armazenar o grupo do usuário logado


  const selectSong = (music, newIndex) => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    audioElement.src = music.audioUrl;
    audioElement.load();
    document.getElementById("artistP").src = music.thumbnail;
    document.getElementById("artisTitle").innerHTML = `${music.artist} - ${music.title}`;
    audioElement.play().then(() => setIsPlaying(true)).catch((error) => {
      console.error("Erro ao reproduzir áudio:", error);
      alert("Erro ao reproduzir áudio. Verifique o caminho do arquivo e o formato.");
    });
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

  //useEffect dos grupos que vem do backend para o caso o usuario logado ja ser o owner de um grupo
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        console.log(`Iniciando fetch para userId: ${user.id}`);
        // Faz a solicitação ao endpoint usando o userId
        const response = await axios.get(`http://localhost:3001/api/groups/${user.id}`);
        const grupoUsuario = response.data;
        
        // Log detalhado do grupo retornado
        console.log("Grupo retornado pelo backend:", JSON.stringify(grupoUsuario, null, 2));

        // Verifica se há um grupo retornado
        if (!grupoUsuario || Object.keys(grupoUsuario).length === 0) {
          console.log("O usuário ainda não é owner de grupo.");
          return;
        }
        
          // Tornar o botão invisível após enviar os dados com sucesso
        // const botaoAdicionar = document.getElementById('btnGrupoAdicionar');
        // if (botaoAdicionar) {
        //  botaoAdicionar.style.display = 'none'; // Torna o botão invisível
        //}
        // Define o grupo do usuário logado
        setGrupoRetornado(grupoUsuario);
        console.log("Grupo do usuário logado:", JSON.stringify(grupoUsuario, null, 2));
  
      } catch (error) {
        // Log de erro detalhado
        if (error.response && error.response.status === 404) {
          console.error("Nenhum grupo encontrado para o usuário:", error.response.data.message);
        } else {
          console.error("Erro ao buscar grupos:", error.message);
        }
      }
    };
  
    fetchGroups();
  }, [user.id]);
  




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

    const fetchUsers = async () => {
      try {
        // Fazendo a requisição ao endpoint /users para buscar os dados dos usuários
        const response = await axios.get("http://localhost:3001/users");
        setUsers(response.data.users); // Salvando os dados dos usuários no estado
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchGenres();
    fetchAudios();
    fetchUsers();

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
      audioElement.play().catch((error) => {
        console.error("Erro ao reproduzir áudio:", error);
        alert("Erro ao reproduzir áudio. Verifique o caminho do arquivo e o formato.");
      });
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

  const handleGrupoBotaoClick = () => {
    setOpenGroupModal(true);
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

    // Verificação de campos obrigatórios
    if (!title || !thumbnail || !audio || !selectedGenre || !artist || !visibility) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    const data = new FormData();
    data.append("title", title);
    data.append("thumbnail", thumbnail);
    data.append("audio", audio);
    data.append("genre", selectedGenre);
    data.append("artist", artist);
    data.append('visibility', visibility);

    axios
      .post("http://localhost:3001/upload/audio", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        alert("Success Uploading the "+title+" audio.");
        setOpen(false);
      })
      .catch((error) => {
        console.error("Error uploading audio:", error);
        alert("Error uploading audio: " + error.message);
      });
  };

  //Funcao para criar o grupo
  const handleInvite = (usuario) => {
    // Verifica se o usuário já está no grupo para evitar duplicações
  if (grupo.some(member => member.id === usuario.id)) {
    alert(`O usuário: ${usuario.nome} já foi convidado para o grupo.`);
    return;
  }

  // Atualiza o estado do grupo com o novo usuário convidado
  setGrupo((prevGrupo) => {
    const novoGrupo = [...prevGrupo, usuario];
    console.log("Membros do grupo:", novoGrupo);
    return novoGrupo;
  });

  // Exibe um alerta confirmando a adição do usuário ao grupo
  alert(`O usuário: ${usuario.nome} foi convidado para o grupo do ${user.nome}`);
};
  

const handleCreateGroup = async () => {
  try {
    // Envia o array `grupo` para o backend
    const response = await axios.post("http://localhost:3001/api/group", grupo);
    console.log("Resposta do backend:", response.data);
    alert("Grupo criado com sucesso!");

    // Tornar o botão invisível após enviar os dados com sucesso
    const botaoAdicionar = document.getElementById('btnGrupoAdicionar');
    if (botaoAdicionar) {
      botaoAdicionar.style.display = 'none'; // Torna o botão invisível
    }
  } catch (error) {
    console.error("Erro ao criar o grupo:", error);
    alert("Erro ao criar o grupo. Tente novamente.");
  }
};



  const handleDeleteAudio = async (audio, indexToDelete) => {
    try {
      const audioId = audio.id; // Use o ID do áudio para deletar
      console.log("ID do áudio a ser eliminado:", audioId);
      
      const response = await axios.delete(`http://localhost:3001/delete/audio/${audioId}`);
      
      console.log(response.data.message);
  
      // Atualizar a lista de áudios após a eliminação
      const updatedAudios = audios.filter((_, idx) => idx !== indexToDelete);
      setAudios(updatedAudios);
    } catch (error) {
      console.error("Erro ao eliminar áudio:", error);
      alert("Erro ao eliminar áudio. Verifique o console para mais detalhes.");
    }
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
                
                className="songDiv"
                key={idx}
              >
                <h3 id="position">0{idx + 1}</h3>
                <div className="tituloNome" onClick={() => selectSong(audio, idx)}>
                  <h3 id="ttleSong">{audio.title}</h3>
                  <h5 id="artistN">{audio.artist}</h5>
                </div>
                <h5 id="genreDuration">{audio.genre}</h5>
                <h5 id="genreDuration">{formatTime(audio.duration)}</h5>
                <button id="btnDelete" onClick={() => handleDeleteAudio(audio, idx)}>
                  Eliminar
                </button>
              </div>
            ))}
          </div>
          <div className="topMusicos">

            <div className="grupoEbotao">
              <div className="grupo">
                <h2>Grupo</h2>
              <h5 id="daSemana">membros</h5>
              </div>
              <button id="btnGrupoAdicionar" onClick={handleGrupoBotaoClick}>Adicionar</button>
            </div>
              
            <div className="borda_perfil"></div>
              {
                  grupoRetornado ? (
                    <div className="grupoDetalhes">
                      {/* Exibição do Owner */}
                      <div className="artistInfo">
                        <img src={artistPhoto} id="artistPhoto" alt="Foto do owner" />
                        <div className="tituloNome">
                          <h3 id="OwnerName">{grupoRetornado.owner.nome}</h3>
                          <h5 id="groupEmail">{grupoRetornado.owner.email}</h5>
                        </div>
                      </div>

                      {/* Exibição dos Membros */}
                      
                        
                        {grupoRetornado.membros.length > 0 ? (
                          grupoRetornado.membros.map((membro) => (
                            <div key={membro.id} className="artistInfo">
                              <img
                                src={artistPhoto || "defaultPhoto.png"}
                                id="artistPhoto"
                                alt={`Foto de ${membro.nome}`}
                              />
                              <div className="tituloNome">
                                <h3 id="ttleSong">{membro.nome}</h3>
                                <h5 id="groupEmail">{membro.email}</h5>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>Nenhum membro no grupo.</p>
                        )}
                      </div>
                    
                  ) : (
                    <p>O usuário ainda não é owner de grupo.</p>
                  )
                }


            
            
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
                {/* Seletor de visibilidade */}
                
                  <label htmlFor='visibilitySelect'>Visibilidade do vídeo:</label>
                  <select
                    id='i1'
                    
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                  >
                    <option value='public'>Público</option>
                    <option value='private'>Privado</option>
                  </select>
                
                <input
                  type="file"
                  id="thumb-select"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  
                />
                
                <input
                  type="file"
                  id="audio-select"
                  accept="audio/*"
                  onChange={handleAudioChange}
                 
                />
                
                <div className="btnDiv">
                  
                <button className="btn-confirmar" type="submit">
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

      {openGroupModal && (
        <Modal1 open={openGroupModal} onClose={() => setOpenGroupModal(false)}>
          <div className="text-center w-56">
            <div className="corpo">
              <h3 className="titleModel">Adicione usuários ao grupo</h3>
                  {users
                      .filter((usuario) => usuario.id !== user.id) // Excluir o usuário logado da lista
                      .map((usuario) => (
                        <div key={usuario.id} className="userInfo">
                          <img src={artistPhoto} id="artistPhoto" alt="Artist" />
                          <div className="usertituloNome">
                            <h3 id="userName">{usuario.nome}</h3>
                            <h5 id="artistN">{usuario.email}</h5>
                          </div>
                          <button id="btnGrupoConvidar" onClick={() => handleInvite(usuario)}>Convidar</button>
                        </div>
                  ))}
                <div className="btnDiv">
                  <button  className="btn-confirmar" onClick={handleCreateGroup}>
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
            </div>
          </div>
        </Modal1>
      )}

    </div>
  );
}

export default Audio;
