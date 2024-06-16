import './Video.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import MenuDiv from '../../Components/MenuDiv/MenuDiv';
import SearchBar from '../../Components/SearchBar/SearchBar';
import plusIcon from '../../assets/img/icons8-soma-30_1.png';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Modal1 from '../../Components/Modal1/Modal1';
import addVideo from '../../assets/img/addVideo.png';
import addThumb from '../../assets/img/addThumb.png';
import axios from 'axios';
import { Videos } from '../../mocks/video';
import { Link } from 'react-router-dom';

function Video() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [description, setDescription] = useState();
  const genero = ['Sci-Fi', 'Drama', 'Aventura'];

  const handleAddBtnClick = () => {
    setOpen(true);
  };
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  }

  const handleInputChange = (e) => {
    setTitle(e.target.value);
  };

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const videoPlayerDivRef = useRef();
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

  useEffect(() => {
    // Calcular os limites de arrasto após a montagem do componente
    const videoPlayerDivWidth = videoPlayerDivRef.current.scrollWidth;
    const visibleWidth = videoPlayerDivRef.current.clientWidth;

    // Ajustar os limites com base na largura do contêiner e a largura visível
    setDragConstraints({ left: -videoPlayerDivWidth + visibleWidth, right: 0 });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', title);
    data.append('thumbnail', thumbnail);
    data.append('video', video);
    data.append('description',description)
    // Adiciona o array de gêneros ao FormData
    genero.forEach((gen, index) => {
      data.append(`genre[${index}]`, gen);
    });
    axios
      .post('http://localhost:3001/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert('Error:' + errorCode + ' ' + errorMessage);
      });

    setOpen(false);
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
          <Link
            to={`/Video/${Videos[0].slug}`}
            className='filmPlayerV'
            style={{
              backgroundImage: `url(${Videos[0].thumbnail})`,
            }}
          >
            <div className='viDescriptionV'>
              <h2 id='titleV'>{Videos[0].title}</h2>
              <h5 id='descriptionV'>{Videos[0].description}</h5>
              <div className='videoClassificationV'>
                {Videos[0].genre.map((genre, index) => (
                  <h4 key={index} className={`category${index + 1}V`}>
                    {genre}
                  </h4>
                ))}
              </div>
            </div>
          </Link>

          <div className="filmMiniExpo">
                          <Link to={`/Video/${Videos[1].slug}`} className='filmPlayerMiniDivV'>
                    <div className='filmPlayerMiniV' id='filmPlayer2V'>
                      <div className='videoDescriptionV_mini'>
                        <h2 id='title_miniV'>{Videos[1].title}</h2>
                        <h5 id='descriptionV_mini'>{Videos[1].description}</h5>
                        <div className='videoClassificationV_mini'>
                          {Videos[1].genre.map((genre, index) => (
                            <h4 key={index} className={`category${index + 1}V_mini`}>
                              {genre}
                            </h4>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                  <Link to={`/Video/${Videos[2].slug}`} className='filmPlayerMiniDivV'>
                    <div className='filmPlayerMiniV' id='filmPlayer3V'>
                      <div className='videoDescriptionV_mini'>
                        <h2 id='title_miniV'>{Videos[2].title}</h2>
                        <h5 id='descriptionV_mini'>{Videos[2].description}</h5>
                        <div className='videoClassificationV_mini'>
                          {Videos[2].genre.map((genre, index) => (
                            <h4 key={index} className={`category${index + 1}V_mini`}>
                              {genre}
                            </h4>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
        </div>
        <div className='videoDiv'>
          <h2>Lista de Vídeos</h2>
          <motion.div ref={videoPlayerDivRef} className='videoPlayerDiv' drag='x' dragConstraints={dragConstraints}>
            {Videos.map((video) => (
              <Link
                to={`/Video/${video.slug}`}
                className='viPlayer'
                style={{
                  backgroundImage: `url(${video.thumbnail})`,
                }}
                key={video.slug}
              >
                <motion.div className='videoDescriptionV'>
                  <h2 id='videoTitle'>{video.title}</h2>
                  <h4 id='videoInfo'>
                    {video.year}, {video.genre.join(', ')}
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
                  placeholder='Descricao'
                  type='text'
                  className='Input'
                  id='i1'
                  value={description}
                  onChange={handleDescriptionChange}
                />
                <input
                  type='file'
                  id='thumb-select'
                  accept='image/*'
                  onChange={handleThumbnailChange}
                />
                <button className='Input' id='i2' onClick={() => document.getElementById('thumb-select').click()}>
                    <img src={addThumb} alt="search" className="addVideo_Thumb" />
                    Carregar a thumbnail
                </button>
                <label htmlFor='thumb-select'>Carregar o thumbnail</label>

                <input
                  type='file'
                  id='video-select'
                  accept='video/*'
                  onChange={handleVideoChange}
                />
                <button className='Input' id='i2' onClick={() => document.getElementById('video-select').click()}>
                    <img src={addVideo} alt="search" className="addVideo_Thumb" />
                    Carregar o vídeo
                </button>
                <label htmlFor='video-select'>Carregar o vídeo</label>

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
