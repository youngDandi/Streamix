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
      <source src= {source} type="video/mp4"></source>
      <p className="vjs-no-js">
          To view this video please enable JavaScript, and consider upgrading to a
          web browser that
          <a href="https://videojs.com/html5-video-support/" target="_blank">
              supports HTML5 video
          </a>
      </p>
  </video>
    );
};

export default VideoJS;