import React, { useState, useEffect } from 'react';
import './Description.css';
import MenuDiv from "../../Components/MenuDiv/MenuDiv";
import heart from '../../assets/img/icons8-gostar-50.png';
import trash from '../../assets/img/trash.png';
import update from '../../assets/img/update.png';
import redHeart from '../../assets/img/icons8-gostar-50_1.png';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext.jsx';
import Modal1 from "../../Components/Modal1/Modal1";
import axios from 'axios';
function Description() {
// Usando o hook useAuth para obter os dados do usuário logado
const { user } = useAuth();

// Exibindo todos os dados do usuário logado no console
useEffect(() => {
  console.log("Dados do usuário logado:", user);
}, [user]);

  const [liked, setLiked] = useState(false);
  const [video, setVideo] = useState(null);
  const { id } = useParams(); // Obtém o ID da rota usando useParams
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editVideo, setEditVideo] = useState({ id: "", title: "", description: "", visibility:"", videoFile: null, imageFile: null});
  const [grupoRetornado, setGrupoRetornado] = useState(null); // Estado para armazenar o grupo do usuário logado
  const [grupoUserMembro, setGrupoUserMembro] = useState(null);

  const handleUpdateVideo = (video) => {
    console.log("handleUpdateVideo chamado com:", video); // Loga o vídeo que está sendo atualizado
  
    setEditVideo({
      id: video.id,
      title: video.title,
      description: video.description,
      visibility: video.visibility,
      audioFile: video.audioFile, // Certifique-se de que isso está correto conforme sua estrutura de dados
      imageFile: video.imageFile, // Certifique-se de que isso está correto conforme sua estrutura de dados
    });
  
    console.log("Estado editVideo atualizado para:", {
      id: video.id,
      title: video.title,
      description: video.description,
      visibility: video.visibility,
      audioFile: video.audioFile,
      imageFile: video.imageFile,
    });
  
    setOpenEditModal(true);
    console.log("Modal de edição aberto");
  };
  

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    console.log("handleEditSubmit chamado");
  
    try {
      const formData = new FormData();
  
      // Adiciona os dados do vídeo ao FormData
      formData.append("title", editVideo.title);
      console.log("Título adicionado ao FormData:", editVideo.title);
  
      formData.append("description", editVideo.description);
      console.log("Descrição adicionada ao FormData:", editVideo.description);
  
  
      formData.append("visibility", editVideo.visibility);
      console.log("Visibilidade adicionada ao FormData:", editVideo.visibility);
  
      if (editVideo.audioFile) {
        formData.append("audioFile", editVideo.audioFile);
        console.log("Arquivo de áudio adicionado ao FormData:", editVideo.audioFile);
      }
  
      if (editVideo.imageFile) {
        formData.append("imageFile", editVideo.imageFile);
        console.log("Arquivo de imagem adicionado ao FormData:", editVideo.imageFile);
      }
  
      console.log("FormData preparado para envio:", formData);
  
      // Faz a requisição PUT usando axios
      const response = await axios.put(`http://localhost:3001/update/video/${editVideo.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("Resposta da requisição:", response.data);
      alert("Vídeo atualizado com sucesso!");
      setOpenEditModal(false);
      console.log("Modal de edição fechado");
  
      // Atualiza a lista de vídeos, se necessário
      // Exemplo: fetchVideos();
    } catch (error) {
      console.error("Erro ao atualizar vídeo:", error);
      alert("Erro ao atualizar vídeo. Verifique o console para mais detalhes.");
    }
  };
  


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
    const fetchVideo = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/videos/${id}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar vídeo');
        }
        const data = await response.json();
        setVideo(data.video); // Define os dados do vídeo no estado
      } catch (error) {
        console.error('Erro ao buscar vídeo:', error);
      }
    };

    fetchVideo(); // Chama a função para buscar o vídeo ao montar o componente
  }, [id]); // Dependência id para garantir que a busca seja refeita quando o ID mudar


  // Função para deletar vídeo
  const handleDeleteVideo = async () => {
    if (!video || !video.id) {
      alert("Erro ao deletar vídeo: ID do vídeo não encontrado.");
      return;
    }

    const confirmation = window.confirm("Tem certeza que deseja deletar este vídeo?");
    if (!confirmation) return;

    try {
      const videoId = video.id; // Use o ID do vídeo para deletar
      console.log("ID do vídeo a ser eliminado:", videoId);

      const response = await axios.delete(`http://localhost:3001/delete/video/${videoId}`);

      console.log(response.data.message);

      // Após a eliminação, redirecionar o usuário ou atualizar a interface
      alert("Vídeo Eliminado com sucesso!!");
      
      // Aqui, você pode redirecionar o usuário para outra página
      // ou atualizar o estado para remover o vídeo atual da visualização.
      // Exemplo de redirecionamento para a página principal:
      // window.location.href = '/';
    } catch (error) {
      console.error("Erro ao eliminar vídeo:", error);
      alert("Erro ao eliminar vídeo. Verifique o console para mais detalhes.");
    }
  };


  const handleClick = () => {
    setLiked(!liked);
  };

  // Verifica se video ainda está carregando
  if (!video) {
    return <div className='todaPaginaD'>Carregando...</div>;
  }

  return (
    <div className='todaPaginaD'>
      <MenuDiv></MenuDiv>
      <div
        className='Items'
        style={{
          backgroundImage: `linear-gradient(to bottom, transparent 0%, rgba(17, 24, 29, 0.8) 90%, rgba(17, 24, 29, 1) 100%), 
  url(${video.thumbnail})`,
          backgroundSize: 'cover', // Garantir que a imagem ocupe todo o espaço
          backgroundRepeat: 'no-repeat', // Prevenir a repetição da imagem
          backgroundPosition: 'center', // Centralizar a imagem
          backgroundAttachment: 'fixed'
        }}
      >
        <div className='itemInfo'>
          <h1 id='titleD'>{video.title}</h1>
          <h5 id='descriptionD'>{video.description}</h5>
          <div className='videoClassification'>
            {video.genre.map((genre, index) => (
              <h4 key={index} className={`category${index + 1}D`}>
                {genre}
              </h4>
            ))}
          </div>
        </div>
        <div className='buttonPlayer'>
          <button><Link to={`/Play/${id}`} >Assistir</Link></button>
          <div className='likeBtn' onClick={handleClick}>
            <img src={liked ? redHeart : heart} id='icon' alt='' />
          </div>
          <div className='likeBtn' onClick={handleDeleteVideo}>
            <img src={trash} id='icon' alt='' />
          </div>
          <div className='likeBtn' onClick={() => handleUpdateVideo(video)}>
            <img src={update} id='iconUpdate' alt='' />
          </div>
        </div>
      </div>

      {openEditModal && (
  <Modal1 open={openEditModal} onClose={() => setOpenEditModal(false)}>
    <div className="text-center w-56">
      <div className="corpo">
        <h3 className="titleModel">Edite o Vídeo</h3>
        <form onSubmit={handleEditSubmit}>
        <input
    placeholder="Título"
    id="i1"
    value={editVideo.title}
    onChange={(e) => setEditVideo({ ...editVideo, title: e.target.value })}
  />
  <input
    placeholder="Descrição"
    id="i1"
    value={editVideo.description}
    onChange={(e) => setEditVideo({ ...editVideo, description: e.target.value })}
  />
  <select
    id="i1"
    name="visibility"
    value={editVideo.visibility}
    onChange={(e) => setEditVideo({ ...editVideo, visibility: e.target.value })}
  >
    <option value="public">Público</option>
    <option value="private">Privado</option>
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
    type="file"
    id="video-select"
    accept="video/*"
    onChange={(e) => setEditVideo({ ...editVideo, audioFile: e.target.files[0] })}
  />
  <input
    type="file"
    id="image-select"
    accept="image/*"
    onChange={(e) => setEditVideo({ ...editVideo, imageFile: e.target.files[0] })}
  />        
          
          
          <div className="btnDiv">
            <button type="submit" className="btn-confirmar" >Salvar </button>
            <button type="button" className="btn-cancelar" onClick={() => setOpenEditModal(false)}> Cancelar </button>
          </div>
          
        </form>
      </div>
    </div>
  </Modal1>
)}
    </div>
  );
}

export default Description;
