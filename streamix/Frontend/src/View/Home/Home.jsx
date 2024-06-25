import React, { useRef, useState, useEffect } from 'react';
import './Home.css';
import MenuDiv from "../../Components/MenuDiv/MenuDiv";
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/AuthContext.jsx';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {

  const {user} = useAuth();
  const [videos, setVideos] = useState([]); // Estado para armazenar os vídeos recebidos do backend
  const musicPlayerDivRef = useRef();
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

  
  useEffect(() => {
    // Log dos dados do usuário logado
    console.log('Dados do usuário logado:', user);

    // Calcular os limites de arrasto após a montagem do componente
    const musicPlayerDivWidth = musicPlayerDivRef.current.scrollWidth;
    const visibleWidth = musicPlayerDivRef.current.clientWidth;

    // Ajustar os limites com base na largura do contêiner e a largura visível
    setDragConstraints({ left: -musicPlayerDivWidth + visibleWidth, right: 0 });
    fetchVideos();
  }, [user]);

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

  return (
    <div className='todaPagina'>
      <MenuDiv />
      <div className="multimediaDiv">
        <div className="filmDiv">
          <div className="filmPlayer" >
          {videos.length > 0 && (
            <Link
              to={`/Video/${videos[0].id}`} // Usando id do documento no Firestore como slug
              className='filmPlayerV'
              style={{backgroundImage: `url(${videos[0].thumbnail})`}}
              
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
          </div>
          <div className="filmPlayerMiniDiv">
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
        <div className="musicDiv">
          <h2>Lista de Músicas</h2>
          <motion.div
            className="musicPlayerDiv"
            whileTap={{ cursor: "grabbing" }}
            drag="x"
            dragConstraints={dragConstraints}
            ref={musicPlayerDivRef}
            style={{ display: 'flex' }}
          >
            <motion.div className="musicPlayer" id='musicPlayer1'>
              <div className="musicDescriptionH">
                <h2 id='musicTitle'>Take Care</h2>
                <h4 id='artistName'>Drake</h4>
              </div>
            </motion.div>
            <motion.div className="musicPlayer" id='musicPlayer2'>
              <div className="musicDescriptionH">
                <h2 id='musicTitle'>Freeblack</h2>
                <h4 id='artistName'>6lack</h4>
              </div>
            </motion.div>
            <motion.div className="musicPlayer" id='musicPlayer3'>
              <div className="musicDescriptionH">
                <h2 id='musicTitle'>Dark Sky Paradise</h2>
                <h4 id='artistName'>Big Sean</h4>
              </div>
            </motion.div>
            <motion.div className="musicPlayer" id='musicPlayer4'>
              <div className="musicDescriptionH">
                <h2 id='musicTitle'>Jackboys</h2>
                <h4 id='artistName'>Travis Scott</h4>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Home;
