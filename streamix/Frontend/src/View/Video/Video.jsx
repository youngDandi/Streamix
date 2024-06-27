import './Video.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import MenuDiv from '../../Components/MenuDiv/MenuDiv';
import SearchBar from '../../Components/SearchBar/SearchBar';
import plusIcon from '../../assets/img/icons8-soma-30_1.png';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Modal1 from '../../Components/Modal1/Modal1';
import addVideo from '../../assets/img/addVideo.png';
import addThumb from '../../assets/img/addThumb.png';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext.jsx';

function Video() {
// Usando o hook useAuth para obter os dados do usuário logado
const { user } = useAuth();

// Exibindo todos os dados do usuário logado no console
useEffect(() => {
  console.log("Dados do usuário logado:", user);
}, [user]);

  const [open, setOpen] = useState(false);
  const [videos, setVideos] = useState([]); // Estado para armazenar os vídeos recebidos do backend
  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('public');
  const genero = ['Sci-Fi', 'Drama', 'Aventura'];
  const [grupoRetornado, setGrupoRetornado] = useState(); // Estado para armazenar o grupo do usuário logado
  const [grupoUserMembro, setGrupoUserMembro] = useState(null);
  
  const handleAddBtnClick = () => {
    setOpen(true);
  };

  const handleInputChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const videoPlayerDivRef = useRef();
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });


   //useEffect dos grupos que vem do backend para o caso o usuario logado ja ser o owner de um grupo
   useEffect(() => {
    const fetchGroups = async () => {
      try {
        console.log(`Iniciando fetch para userId: ${user.id}`);
        // Faz a solicitação ao endpoint usando o userId
        const response = await axios.get(`http://localhost:3001/owner/groups/${user.id}`);
        const gruposUsuario = response.data;
        
        // Log detalhado dos grupos retornados
        console.log("Grupos retornados pelo backend:", JSON.stringify(gruposUsuario, null, 2));
  
        // Verifica se há grupos retornados
        if (!gruposUsuario || gruposUsuario.length === 0) {
          console.log("O usuário ainda não é owner de grupos.");
          return;
        }
  
        // Define os grupos retornados no estado
        setGrupoRetornado(gruposUsuario);
        console.log("Grupos do usuário logado:", JSON.stringify(gruposUsuario, null, 2));
  
      } catch (error) {
        // Log de erro detalhado
        if (error.response && error.response.status === 404) {
          console.error("Nenhum grupo encontrado para o usuário:", error.response.data.message);
        } else {
          console.error("Erro ao buscar grupos:", error.message);
        }
      }
    };
  
    fetchGroups(); // Chama a função fetchGroups ao montar o componente ou quando o usuário mudar
  
  }, [user.id]); // Adiciona user.id como dependência para o useEffect
  
  
//useEffect que retorna todos os grupos em que o usuario logado e membro
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        console.log(`Iniciando fetch para userId: ${user.id}`);
        // Faz a solicitação ao endpoint usando o userId para buscar grupos onde o usuário é membro
        const response = await axios.get(`http://localhost:3001/member/groups/${user.id}`);
        const gruposUsuario = response.data;
        
        // Log detalhado dos grupos retornados
        console.log("Grupos retornados pelo backend:", JSON.stringify(gruposUsuario, null, 2));
  
        // Verifica se há grupos retornados
        if (!gruposUsuario || gruposUsuario.length === 0) {
          console.log("O usuário não é membro de nenhum grupo.");
          return;
        }
  
        // Define os grupos retornados no estado
        setGrupoUserMembro(gruposUsuario);
        console.log("Grupos do usuário logado:", JSON.stringify(gruposUsuario, null, 2));
  
      } catch (error) {
        // Log de erro detalhado
        if (error.response && error.response.status === 404) {
          console.error("Nenhum grupo encontrado para o usuário:", error.response.data.message);
        } else {
          console.error("Erro ao buscar grupos do usuário:", error.message);
        }
      }
    };
  
    
    fetchGroups(); // Chama a função fetchGroups ao montar o componente ou quando o usuário mudar
  
  }, [user.id]); // Adiciona user como dependência para o useEffect


  useEffect(() => {
    // Calcular os limites de arrasto após a montagem do componente
    const videoPlayerDivWidth = videoPlayerDivRef.current.scrollWidth;
    const visibleWidth = videoPlayerDivRef.current.clientWidth;

    // Ajustar os limites com base na largura do contêiner e a largura visível
    setDragConstraints({ right: 0 });

    // Buscar vídeos do backend ao montar o componente
    fetchVideos();
  }, []);

  const fetchVideos = () => {
    axios.get(`http://localhost:3001/videos/${user.id}`)
      .then((response) => {
        console.log('Vídeos recebidos do servidor:', response.data.videosFiltrados);
        setVideos(response.data.videosFiltrados);

        
      })
      .catch((error) => {
        console.error('Erro ao buscar vídeos:', error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verificação de campos obrigatórios
    if (!title || !thumbnail || !videoFile || !description || !visibility) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const data = new FormData();
    data.append('title', title);
    data.append('thumbnail', thumbnail);
    data.append('video', videoFile);
    data.append('description', description);
    data.append('genre', JSON.stringify(genero));

    if (visibility === 'private') {
      data.append('visibility', user.id);
    } else {
      // Verifica se grupoRetornado ou grupoUserMembro são null ou undefined
      if (grupoRetornado == null && grupoUserMembro == null) {
        // Ambos são null ou undefined
        data.append('visibility', 'public');
      } else if (grupoRetornado != null && grupoUserMembro == null) {


        // Apenas grupoUserMembro é null ou undefined
        if (grupoRetornado.some(grupo => grupo.id === visibility)) {
          data.append('visibility', visibility);
        } else {
          data.append('visibility', 'public');
        }


      } else if (grupoRetornado == null && grupoUserMembro != null) {


        // Apenas grupoRetornado é null ou undefined
        if (grupoUserMembro.some(grupo => grupo.id === visibility)) {
          data.append('visibility', visibility);
        } else {
          data.append('visibility', 'public');
        }


      } else {

        // Ambos não são null ou undefined
        if (grupoRetornado.some(grupo => grupo.id === visibility) || grupoUserMembro.some(grupo => grupo.id === visibility)) {
          data.append('visibility', visibility);
        } else {
          data.append('visibility', 'public');
        }

      }
    }
    

    axios.post('http://localhost:3001/upload/videos', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      console.log('Resposta do servidor:', response);
      alert("Success Uploading the "+title+" video.");
      // Lidar com a resposta positiva, como redirecionar ou mostrar uma mensagem de sucesso
      setOpen(false);
      fetchVideos(); // Atualizar a lista de vídeos após o envio bem-sucedido
    })
    .catch((error) => {
      console.error('Erro ao enviar o formulário:', error);
      const errorCode = error.code;
      const errorMessage = error.response?.data || error.message;
      alert('Error:' + errorCode + ' ' + errorMessage);
    });
  };

  return (
    <div className='todaPaginaV'>
      <MenuDiv></MenuDiv>
      <div className='multimediaDivV'>
        <div className='searchAdd'>
          <SearchBar type='Pesquisa por vídeos e etc...' />
          <button className='addContent' onClick={handleAddBtnClick}>
            <img src={plusIcon} alt='search' className='plusIcon' />
          </button>
        </div>
        <div className='filmDivV'>
          {videos.length > 0 && (
            <Link
              to={`/Video/${videos[0].id}`} // Usando id do documento no Firestore como slug
              className='filmPlayerV'
              style={{
                backgroundImage: `url(${videos[0].thumbnail})`,
              }}
            >
              <div className='viDescriptionV'>
                <h2 id='titleV'>{videos[0].title}</h2>
                <h5 id='descriptionV'>{videos[0].description}</h5>
                <div className='videoClassificationV'>
                  {videos[0].genre.map((genre, index) => (
                    <h4 key={index} className={`category${index + 1}V`}>
                      {genre}
                    </h4>
                  ))}
                </div>
              </div>
            </Link>
          )}

          <div className="filmMiniExpo">
            {videos.slice(1, 3).map((video, index) => (
              <Link to={`/Video/${video.id}`} className='filmPlayerMiniDivV' key={index}>
                <div className='filmPlayerMiniV' style={{backgroundImage: `url(${video.thumbnail})`}}>
                  <div className='videoDescriptionV_mini'>
                    <h2 id='title_miniV'>{video.title}</h2>
                    <h5 id='descriptionV_mini'>{video.description}</h5>
                    <div className='videoClassificationV_mini'>
                      {video.genre.map((genre, idx) => (
                        <h4 key={idx} className={`category${idx + 1}V_mini`}>
                          {genre}
                        </h4>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className='videoDiv'>
          <h2>Lista de Vídeos</h2>
          <motion.div ref={videoPlayerDivRef} className='videoPlayerDiv' drag='x' dragConstraints={dragConstraints}>
            {videos.slice(3).map((video, index) => (
              <Link
                to={`/Video/${video.id}`} // Usando id do documento no Firestore como slug
                className='viPlayer'
                style={{
                  backgroundImage: `url(${video.thumbnail})`,
                }}
                key={index}
              >
                <motion.div className='videoDescriptionV'>
                  <h2 id='videoTitle'>{video.title}</h2>
                  <h4 id='videoInfo'>
                    {video.genre.join(', ')}
                  </h4>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
      {open && (
        <Modal1 open={open} onClose={() => setOpen(false)}>
          <div className='text-center w-56'>
            <div className='corpo'>
              <form onSubmit={handleSubmit}>
                <h3 className='titleModel'>Adicione o seu vídeo</h3>
                <input
                  placeholder='Título'
                  type='text'
                  className='Input'
                  id='i1'
                  value={title}
                  onChange={handleInputChange}
                />
                <input
                  placeholder='Descrição'
                  type='text'
                  className='Input'
                  id='i1'
                  value={description}
                  onChange={handleDescriptionChange}
                />
                
                {/* Seletor de visibilidade */}
                
                <select
                  name="visibility"
                  id="i1"
                  onChange={(e) => setVisibility(e.target.value)}
                  value={visibility}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  {grupoRetornado && grupoRetornado.length > 0 &&
                    grupoRetornado.map((grupo) => (
                      <option key={grupo.id} value={grupo.id}>{grupo.groupName}</option>
                    ))
                  }
                  {grupoUserMembro && grupoUserMembro.length > 0 &&
                    grupoUserMembro.map((grupo) => (
                      <option key={grupo.id} value={grupo.id}>{grupo.groupName}</option>
                    ))
                  }
                </select>
                
                <input
                  type='file'
                  id='thumbSelect'
                  accept='image/*'
                  onChange={handleThumbnailChange}
                />
                
                

                <input
                  type='file'
                  id='videoSelect'
                  accept='video/*'
                  onChange={handleVideoChange}
                />
                
                
                <div className='btnDiv'>
                  <button type='submit' className='btn-confirmar'>
                    Confirmar
                  </button>
                  <button
                    type='button'
                    className='btn-cancelar'
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

export default Video;
