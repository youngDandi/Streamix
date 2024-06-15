import React from 'react';
import './Reproduction.css';
import MenuDiv from '../../Components/MenuDiv/MenuDiv';
import { useParams } from 'react-router-dom';
import { Videos } from '../../mocks/video';

function Reproduction() {
  const { slug } = useParams();

  const video = Videos.find((video) => video.slug === slug);

  return (
    <div className='todaPaginaV'>
      <MenuDiv />
      <div className='Video'
        style={{ backgroundImage: `linear-gradient(to bottom, transparent 0%, rgba(17, 24, 29, 0.8) 90%, rgba(17, 24, 29, 1) 100%), 
  url(${video.thumbnail[1]})` }}
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
            id="my-player"
            autoPlay={true}
            muted
            controls
            poster={video.thumbnail[1]}
            data-setup='{"playbackRates": [0.5, 1, 1.5, 2, 3.5, 4]}'
            width={600}
            height={400}
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
