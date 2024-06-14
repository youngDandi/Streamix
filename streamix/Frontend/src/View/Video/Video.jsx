import "./Video.css";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import MenuDiv from '../../Components/MenuDiv/MenuDiv';
import SearchBar from '../../Components/SearchBar/SearchBar';
import plusIcon from '../../assets/img/icons8-soma-30_1.png';

import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Modal1 from '../../Components/Modal1/Modal1';
import addVideo from '../../assets/img/addVideo.png';
import addThumb from '../../assets/img/addThumb.png';
import axios from 'axios';
import { Videos } from '../../mocks/video';
import { Link } from 'react-router-dom/dist';
function Video() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);

  const handleAddBtnClick = () => {
    setOpen(true);
  };

  const handleInputChange = (e) => {
    setTitle(e.target.value);
  };

  const handleThumbnailChange = (e) => {
    console.log(e.target);
    setThumbnail(e.target.files[0]);
  };

  const handleVideoChange = (e) => {
    console.log(e.target);
    setVideo(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', title);
    data.append('thumbnail', thumbnail);
    data.append('video', video);
    console.log(data);
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
        setError(errorMessage);
        alert('Error:' + errorCode + ' ' + errorMessage);
      });

    setOpen(false);
  };

  const slickSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
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
              backgroundImage: `url(${Videos[0].thumbnail[1]})`,
            }}
          >
            <div className='viDescriptionV'>
              <h2 id='titleV'>{Videos[0].title}</h2>
              <h5 id='descriptionV'>{Videos[0].description}</h5>
              <div className='videoClassificationV'>
                {/* <h4 className='category1V'>SCI-FI</h4>
                <h4 className='category2V'>DRAMA</h4>
                <h4 className='category3V'>AVENTURA</h4> */}
                {Videos[0].genre.map((genre, index) => (
                  <h4 key={index} className={`category${index + 1}V`}>
                    {genre}
                  </h4>
                ))}
              </div>
            </div>
          </Link>

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
        </div>
        <div className='videoDiv'>
          <h2>Lista de Vídeos</h2>
          <div className='videoPlayerDiv'>
            {/* <Slider {...slickSettings}> */}
            {Videos.map((video) => {
              return (
                <Link
                  to={`/Video/${video.slug}`}
                  className='viPlayer'
                  style={{
                    backgroundImage: `url(${video.thumbnail[0]})`,
                  }}
                  key={video.slug}
                >
                  <div className='videoDescriptionV'>
                    <h2 id='videoTitle'>{video.title}</h2>
                    <h4 id='videoInfo'>
                      {video.year}, {video.genre.join(', ')}
                    </h4>
                  </div>
                </Link>
              );
            })}
            {/* </Slider> */}
          </div>
        </div>
      </div>
      {open && (
        <Modal1 open={open} onClose={() => setOpen(false)}>
          <div className='text-center w-56'>
            <div className='corpo'>
              <form onSubmit={handleSubmit}>
                <h3 className='titleModel'>Adicione o seu video</h3>
                <input
                  placeholder='Titulo'
                  type='text'
                  className='Input'
                  id='i1'
                  value={title}
                  onChange={handleInputChange}
                />

                <input
                  type='file'
                  id='thumb-select'
                  accept='image/*'
                  onChange={handleThumbnailChange}
                />
                <label htmlFor='thumb-select'>Carregar o thumbnail</label>

                <input
                  type='file'
                  id='video-select'
                  accept='video/*'
                  onChange={handleVideoChange}
                />
                <label htmlFor='video-select'>Carregar o vídeo</label>
                {/*                    ----------- TO BE CHANGED AND ADAPTED BY LUÍS --------------------
                               
                               <button className='Input' id='i2'>             
                                    <img src={addThumb} alt="search" className="addVideo_Thumb" />
                                    Carregar a thumbnail
                                </button>
                                <button className='Input' id='i2'>
                                    <img src={addVideo} alt="search" className="addVideo_Thumb" />
                                    Carregar o video
                                    </button>
                             
                                                     ----------- TO BE CHANGED AND ADAPTED BY LUÍS --------------------
                                
                                */}

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
