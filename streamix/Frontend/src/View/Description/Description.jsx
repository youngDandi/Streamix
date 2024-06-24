import React, { useState, useEffect } from 'react';
import './Description.css';
import MenuDiv from "../../Components/MenuDiv/MenuDiv";
import heart from '../../assets/img/icons8-gostar-50.png';
import trash from '../../assets/img/trash.png'
import redHeart from '../../assets/img/icons8-gostar-50_1.png';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext.jsx';
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
        </div>
      </div>
    </div>
  );
}

export default Description;
