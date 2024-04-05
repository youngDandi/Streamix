import React from 'react';



const VideoPlayer = ({videoPath, thumbPath}) => {
  

    
    return (
      <div>
      
        <video controls width="600" height="400" poster={thumbPath}>
          <source src={videoPath} type="video/mp4" />
          
         
        </video>
      </div>
    );
  
};

export default VideoPlayer;