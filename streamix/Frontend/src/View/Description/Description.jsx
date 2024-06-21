import React, { useState, useEffect } from 'react';
import './Description.css';
import MenuDiv from "../../Components/MenuDiv/MenuDiv";
import heart from '../../assets/img/icons8-gostar-50.png';
import redHeart from '../../assets/img/icons8-gostar-50_1.png';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Description() {
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
            <img src={liked ? redHeart : heart} id='iconLike' alt='' />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Description;
