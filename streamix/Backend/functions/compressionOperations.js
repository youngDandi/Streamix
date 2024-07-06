const ffmpegStatic = require('ffmpeg-static');
const ffmpeg= require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');


ffmpeg.setFfmpegPath(ffmpegStatic);



function H265Compress(filename, destination, type) {
  console.log(`Iniciando compressão: ${filename}`);
  console.log(`Destino: ${destination}`);
  console.log(`Tipo: ${type}`);
  
  return new Promise((resolve, reject) => {
    const inputPath = path.join(destination, filename);
    console.log(`Arquivo de entrada: ${inputPath}`);
    
    const process = ffmpeg().input(inputPath);

    if (type.startsWith("video/")) {
      console.log("Tipo de arquivo: vídeo");
      process.videoCodec("libx265");
    } else {
      console.log("Tipo de arquivo: áudio");
      process.audioCodec("libmp3lame");
    }

    const tempFilePath = `assets/temp/${filename}`;
    console.log(`Arquivo temporário: ${tempFilePath}`);
    
    process.saveToFile(tempFilePath)
      .on('progress', (progress) => {
        if (progress.percent) {
          console.log(`Processando: ${Math.floor(progress.percent)}%`);
        }
      })
      .on('end', async () => {
        console.log("Compressão concluída.");
        try {
          const tempPath = path.join('assets', 'temp', filename);
          const destPath = path.join(destination, filename);

          console.log(`Caminho temporário: ${tempPath}`);
          console.log(`Caminho destino: ${destPath}`);

          // Remove o arquivo de destino se ele já existir
          await fs.promises.rm(destPath, { force: true });
          console.log(`Arquivo destino removido (se existia): ${destPath}`);

          // Move o arquivo comprimido do caminho temporário para o destino final
          await fs.promises.rename(tempPath, destPath);
          console.log(`Arquivo movido para o destino final: ${destPath}`);


          

          resolve();
        } catch (error) {
          console.error(`Erro durante operações de arquivo: ${error.message}`);
          reject(`Error during file operations: ${error.message}`);
        }
      })
      .on('error', (error) => {
        console.error(`Erro do FFmpeg: ${error.message}`);
        reject(`FFmpeg error: ${error.message}`);
      });
  });
}




module.exports= {H265Compress};