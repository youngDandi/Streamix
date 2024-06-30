const ffmpegStatic = require('ffmpeg-static');
const ffmpeg= require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');


ffmpeg.setFfmpegPath(ffmpegStatic);

function H265Compress(filename,destination,type){

/*
if(type.startsWith("video/")){
ffmpeg().
input(destination.concat(filename)).
videoCodec('libx265').
saveToFile(`assets/temp/${filename}`).
on('progress',(progress)=>{
    if(progress.percent){
        console.log(`Processamente em: ${Math.floor(progress.percent)}%`)
    }
}).on('end',()=>{
    const tempPath = path.join('assets','temp',filename);
    const destPath = path.join(destination,filename);

    fs.rm(destPath, (error) => {
        if (error) {
          if (error.code === 'ENOENT') {
            console.log('File not found for removal, which is expected if it does not exist:', error);
          } else {
            console.log('Erro ao apagar o ficheiro, mensagem:', error);
          }
        } else {
         // console.log('File removed successfully.');
        }
  
        fs.rename(tempPath, destPath, (error) => {
          if (error) {
            console.log('Erro ao mover o ficheiro, mensagem:', error);
          } else {
           // console.log('File moved successfully.');
           // console.log('Compressão terminada.');
          }
        });
      });


}).on('error',(error)=>{
    console.log(error);
})
} else{
    ffmpeg().
    input(destination.concat(filename)).
    audioCodec('libmp3lame').
    saveToFile(`assets/temp/${filename}`).
    on('progress',(progress)=>{
        if(progress.percent){
            console.log(`Processamente em: ${Math.floor(progress.percent)}%`)
        }
    }).on('end',()=>{
        const tempPath = path.join('assets','temp',filename);
        const destPath = path.join(destination,filename);
    
        fs.rm(destPath, (error) => {
            if (error) {
              if (error.code === 'ENOENT') {
                console.log('File not found for removal, which is expected if it does not exist:', error);
              } else {
                console.log('Erro ao apagar o ficheiro, mensagem:', error);
              }
            } else {
             // console.log('File removed successfully.');
            }
      
            fs.rename(tempPath, destPath, (error) => {
              if (error) {
                console.log('Erro ao mover o ficheiro, mensagem:', error);
              } else {
               // console.log('File moved successfully.');
               // console.log('Compressão terminada.');
              }
            });
          });
    
    
    }).on('error',(error)=>{
        console.log(error);
    })    

}
    */

return new Promise((resolve,reject)=>{
const process = ffmpeg().input(path.join(destination,filename));

if(type.startsWith("video/")){
  process.videoCodec("libx265");
} else {
  process.audioCodec("libmp3lame");
}

process.saveToFile(`assets/temp/${filename}`).on('progress',(progress)=>{
  if(progress.percent){
    console.log(`Processando: ${Math.floor(progress.percent)}%`)}}).on('end', async()=>{
      try {
        const tempPath = path.join('assets','temp',filename);
        const destPath = path.join(destination,filename);

        await fs.promises.rm(destPath, {force:true});
        await fs.promises.rename(tempPath,destPath);
        resolve();
      } catch(error){
        reject(`Error during file operations: ${error.message}`)}}).on('error',(error)=>{
          reject(`FFmpe error: ${error.message}`);
        })
});

}

module.exports= {H265Compress};