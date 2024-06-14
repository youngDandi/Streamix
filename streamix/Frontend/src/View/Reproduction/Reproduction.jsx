import './Reproduction.css';
import MenuDiv from '../../Components/MenuDiv/MenuDiv';
import VideoJS from '../../Components/VideoJs/videoJs';
import { useParams } from 'react-router-dom/dist';
import { Videos } from '../../mocks/video';
function Reproduction() {
  const { slug } = useParams();

  const video = Videos.find((video) => video.slug === slug);

  return (
    <div className='todaPaginaV'>
      <MenuDiv></MenuDiv>
      <div className='Video'
      style={{backgroundImage: `linear-gradient(to bottom, transparent 0%, rgba(17, 24, 29, 0.8) 90%, rgba(17, 24, 29, 1) 100%), 
  url(${video.thumbnail[1]})`}}
      >
        <div className='videoInfo'>
          <h1 id='title'>{video.title}</h1>
          <h5 id='description'>{video.description} </h5>
          <div className='videoClassification'>
            {video.genre.map((genre, index) => (
              <h4 key={index} className={`category${index + 1}`}>
                {genre}
              </h4>
            ))}
          </div>
        </div>
        <div className='videoPlayer'>
          <VideoJS source={video.url} thumbnail={video.thumbnail[1]} />
        </div>
      </div>
    </div>
  );
}

export default Reproduction;
