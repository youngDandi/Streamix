import React, { useState } from 'react';
import './Description.css';

import MenuDiv from "../../Components/MenuDiv/MenuDiv";
import heart from '../../assets/img/icons8-gostar-50.png';
import redHeart from '../../assets/img/icons8-gostar-50_1.png';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Videos } from '../../mocks/video';
import { Link } from 'react-router-dom/dist';

function Description() {
  const [liked, setLiked] = useState(false);

  const { slug } = useParams();

  const handleClick = () => {
    setLiked(!liked);
  };

  const video = Videos.find((video) => video.slug === slug);

  return (
    <div className='todaPaginaD'>
      <MenuDiv></MenuDiv>
      <div
        className='Items'
        style={{
          backgroundImage: `linear-gradient(to bottom, transparent 0%, rgba(17, 24, 29, 0.8) 90%, rgba(17, 24, 29, 1) 100%), 
  url(${video.thumbnail[1]})`,
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
          <Link to={`/Play/${slug}`}>Assistir</Link>

          <div className='likeBtn' onClick={handleClick}>
            <img src={liked ? redHeart : heart} id='iconLike' alt='' />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Description;
