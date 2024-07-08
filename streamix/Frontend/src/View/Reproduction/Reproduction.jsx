import React, { useState, useEffect } from 'react';
import './Reproduction.css';
import MenuDiv from '../../Components/MenuDiv/MenuDiv';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext.jsx';

function Reproduction() {
// Usando o hook useAuth para obter os dados do usuário logado
const { user } = useAuth();



// Exibindo todos os dados do usuário logado no console
useEffect(() => {
  console.log("Dados do usuário logado:", user);
}, [user]);

  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`http://192.168.1.9:3001/api/video/${id}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar informações do vídeo');
        }
        const data = await response.json();
        setVideo(data); // Define os dados do vídeo no estado
      } catch (error) {
        console.error('Erro ao buscar informações do vídeo:', error);
      }
    };

    fetchVideo();
  }, [id]);

  if (!video) {
    return <div className='todaPaginaV'>Carregando...</div>;
  }

  return (
    <div className='todaPaginaV'>
      <MenuDiv />
      <div className='Video'
        style={{ backgroundImage: `linear-gradient(to bottom, transparent 0%, rgba(17, 24, 29, 0.8) 90%, rgba(17, 24, 29, 1) 100%), 
  url(${video.thumbnail})` }}
      >
        <div className='videoInfo'>
          <h1 id='title'>{video.title}</h1>
          <h5 id='description'>{video.description}</h5>
          <div className='videoClassification'>
            {video.genre.map((genre, index) => (
              <h4 key={index} className={`category${index + 1}`}>
                {genre}
              </h4>
            ))}
          </div>
        </div>
        <div className='videoPlayer'>
          <video
            className='video-js'
            autoPlay
            muted
            controls
            poster={video.thumbnail}
            data-setup='{"playbackRates": [0.5, 1, 1.5, 2, 3.5, 4]}'
            style={{ width: '80%', height: 'auto', maxWidth: '1000px' }} // Ajuste aqui
          >
            <source src={video.videoUrl} type="video/mp4" />
            Seu navegador não suporta o formato de vídeo.
          </video>
        </div>
      </div>
    </div>
  );
}

export default Reproduction;
