const express = require('express');
const router = express.Router();
const { db } = require('../Database/firebase'); // Verifique o caminho correto para o seu arquivo Firebase

// Rota para buscar um vídeo por ID
router.get('/videos/:id', async (req, res) => {
  try {
    const videoId = req.params.id; // Obtém o ID do vídeo da URL

    // Busca o vídeo no Firestore
    const videoRef = db.collection('video').doc(videoId);
    const doc = await videoRef.get();

    if (!doc.exists) {
      return res.status(404).send({ message: 'Vídeo não encontrado' });
    }

    const videoData = doc.data();

    // Retorna os dados do vídeo como resposta
    return res.status(200).send({
      message: 'Vídeo encontrado com sucesso',
      video: {
        id: doc.id,
        title: videoData.title,
        description: videoData.description,
        genre: videoData.genre,
        thumbnail: `http://localhost:3001/${videoData.image.replace(/\\/g, "/")}`, // Verifique o campo correto no seu documento Firestore
        videoUrl: `http://localhost:3001/${videoData.video.replace(/\\/g, "/")}`, // Verifique o campo correto no seu documento Firestore
        visibility: videoData.visibility || 'public', // Verifique o campo correto no seu documento Firestore
      },
    });
  } catch (error) {
    console.error('Erro ao buscar vídeo:', error);
    return res.status(500).send({ message: 'Erro interno ao buscar vídeo' });
  }
});

// Rota para obter detalhes do vídeo por ID
router.get('/:id', async (req, res) => {
    const videoId = req.params.id;
  
    try {
      // Busque o documento de vídeo no Firestore pelo ID
      const docRef = await db.collection('video').doc(videoId).get();
  
      if (!docRef.exists) {
        return res.status(404).send({ message: 'Vídeo não encontrado' });
      }
  
      const videoData = docRef.data();
  
      // Construa o objeto de resposta com os dados necessários
      const response = {
        id: docRef.id,
        title: videoData.title || '',
        description: videoData.description || '',
        genre: videoData.genre || [],
        thumbnail: `http://localhost:3001/${videoData.image.replace(/\\/g, "/")}`, // Verifique o campo correto no seu documento Firestore
        videoUrl: `http://localhost:3001/${videoData.video.replace(/\\/g, "/")}`, // Verifique o campo correto no seu documento Firestore
      };
      console.log("kfvfkkfvkfkf: "+response)
      return res.status(200).send(response);
    } catch (error) {
      console.error('Erro ao buscar vídeo:', error);
      return res.status(500).send({ message: 'Erro interno ao buscar vídeo' });
    }
  });

module.exports = router; // Exporta o router para ser utilizado no servidor
