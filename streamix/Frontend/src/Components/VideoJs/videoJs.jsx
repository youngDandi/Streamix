import React from 'react';
const VideoJS = ({source, thumbnail}) => {   
    return (
      <video
      className='video-js'
      id="my-player"
      autoPlay={true}
      muted
      controls
      //preload='auto'
      poster={thumbnail}
      data-setup='{"playbackRates": [0.5, 1, 1.5, 2,3.5,4]}'
      width={600}
      height={400}
      >
      
      <source src={source} type="video/mp4" />
  </video>
    );
};

export default VideoJS;