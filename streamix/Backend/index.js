const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require('multer');
const { db, userAuth } = require("./Database/firebase.js");
const {alterPath} = require("./functions/alterPath.js")
const mm = require("music-metadata");
const { Stream } = require("stream");
const fs = require("fs");
const mime = require("mime-types");
const app = express();
const port =  3001;
const videoRoutes = require('./routes/videoRoutes'); // Importa suas rotas de vídeo


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuração das rotas
app.use('/api', videoRoutes); // Define um prefixo '/api' para todas as rotas do videoRoutes
app.use('/api/video', videoRoutes);



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "assets/";

    if (file.mimetype.startsWith("image/")) {
      uploadPath = "assets/images/";
    } else if (file.mimetype.startsWith("video/")) {
      uploadPath = "assets/videos/";
    } else if (file.mimetype.startsWith("audio/")) {
      uploadPath = "assets/audios/";
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.post("/register", async (req, res) => {
  try {
    const { nome, email, tipo, password } = req.body;
    const userCredential = await userAuth.createUser({
      email: email,
      emailVerified: false,
      password: password,
      displayName: nome,
      disabled: false,
    });
    const user = userCredential;

    // Salvar informações adicionais no Firestore
    await db.collection("users").doc(user.uid).set({
      nome: user.displayName,
      email: user.email,
      tipo: tipo,
    });

    return res.status(200).send({
      status: "Success",
      message: "User data saved successfully",
    });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return res.status(400).send({
      message: "Server Error",
    });
  }
});

// Endpoint para login de usuários
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Autentica o usuário com email e senha
    const userCredential = await userAuth.getUserByEmail(email);
    
    if (!userCredential) {
      return res.status(404).send({ message: "Usuário não encontrado" });
    }

    // Verifica a senha (a verificação real depende de como você armazena e verifica a senha, 
    // mas aqui assumimos que o Firebase Authentication está gerenciando isso)
    const user = userCredential;

    // Obtém as informações adicionais do usuário no Firestore
    const userDoc = await db.collection("users").doc(user.uid).get();

    if (!userDoc.exists) {
      return res.status(404).send({ message: "Informações do usuário não encontradas" });
    }

    // Envia as informações do usuário para o frontend
    return res.status(200).send({
      status: "Success",
      message: "Login successful",
      user: {
        id: user.uid,
        email: user.email,
        nome: userDoc.data().nome,
        tipo: userDoc.data().tipo,
      },
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return res.status(400).send({
      message: "Falha no login",
      error: error.message,
    });
  }
});




app.post("/upload/videos", upload.any(), async (req, res) => {
  try {
    // Log dos arquivos recebidos
    console.log("Arquivos recebidos:", req.files);

    // Verifique se os arquivos estão presentes
    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ message: "Nenhum arquivo foi enviado." });
    }

    // Processa os detalhes dos arquivos
    const fileDetails = req.files.map((file) => ({
      path: path.join(file.destination, file.filename),
      mimetype: file.mimetype,
      originalname: file.originalname,
      size: file.size,
    }));

    // Log dos detalhes dos arquivos
    console.log("Detalhes dos arquivos:", fileDetails);

    // Inicializa o objeto de dados do documento
    let docData = { 
      title: req.body.title,
      description: req.body.description || "",  // Inclui a descrição se estiver disponível
      genre: req.body.genre ? JSON.parse(req.body.genre) : [],  // Adiciona o gênero se presente
      visibility: req.body.visibility || "public"  // Adiciona a visibilidade, padrão para público se não especificado
    };

    // Adiciona as informações de caminho de arquivos ao docData
    fileDetails.forEach((file) => {
      if (file.mimetype.startsWith("image/")) {
        docData.image = file.path;
      } else if (file.mimetype.startsWith("video/")) {
        docData.video = file.path;
      } else if (file.mimetype.startsWith("audio/")) {
        docData.audio = file.path;
      }
    });

    // Log do docData antes de enviar ao Firebase
    console.log("Dados do documento a serem enviados ao Firebase:", docData);

    // Condicional para salvar como vídeo ou áudio
    if (docData.video && docData.image) {
      const docRef = db.collection("video").doc();

      // Tenta salvar no Firebase e loga o sucesso
      await docRef.set(docData);
      console.log("Documento de vídeo salvo com sucesso no Firebase");
      return res.status(200).send({ message: "Success in upload", Sent: "Video" });
    } else if (docData.audio) {
      const docRef = db.collection("audio").doc();

      // Obtém metadados do áudio
      const metadata = await mm.parseFile(docData.audio);
      docData.metadata = metadata;
      docData.artist = req.body.artist;

      // Tenta salvar no Firebase e loga o sucesso
      await docRef.set(docData);
      console.log("Documento de áudio salvo com sucesso no Firebase");
      return res.status(200).send({ message: "Success in upload", Sent: "Audio" });
    } else {
      return res.status(400).send({ message: "Os dados enviados não são válidos para áudio ou vídeo." });
    }
  } catch (error) {
    // Log detalhado do erro
    console.error("Erro ao fazer o upload de dados:", error);

    // Envia uma resposta de erro ao cliente com detalhes adicionais
    return res.status(500).send({
      message: "Erro interno no servidor",
      error: error.message,
      stack: error.stack,
    });
  }
});

app.post("/upload/audio", upload.any(), async (req, res) => {
  try {
    // Log dos arquivos recebidos
    console.log("Arquivos recebidos:", req.files);

    // Verifique se os arquivos estão presentes
    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ message: "Nenhum arquivo foi enviado." });
    }

    // Processa os detalhes dos arquivos
    const fileDetails = req.files.map((file) => ({
      path: path.join(file.destination, file.filename),
      mimetype: file.mimetype,
      originalname: file.originalname,
      size: file.size,
    }));

    // Log dos detalhes dos arquivos
    console.log("Detalhes dos arquivos:", fileDetails);

    // Inicializa o objeto de dados do documento
    let docData = { 
      title: req.body.title,
      artist: req.body.artist,
      genre: req.body.genre || "",  // Adiciona o gênero se presente
      visibility: req.body.visibility || "public"  // Adiciona a visibilidade, padrão para público se não especificado
    };

    // Adiciona as informações de caminho de arquivos ao docData
    fileDetails.forEach((file) => {
      if (file.mimetype.startsWith("image/")) {
        docData.image = file.path;
      } else if (file.mimetype.startsWith("video/")) {
        docData.video = file.path;
      } else if (file.mimetype.startsWith("audio/")) {
        docData.audio = file.path;
      }
    });

    // Log do docData antes de enviar ao Firebase
    console.log("Dados do documento a serem enviados ao Firebase:", docData);

    // Condicional para salvar como vídeo ou áudio
    if (docData.video && docData.image) {
      const docRef = db.collection("video").doc();

      // Tenta salvar no Firebase e loga o sucesso
      await docRef.set(docData);
      console.log("Documento de vídeo salvo com sucesso no Firebase");
      return res.status(200).send({ message: "Success in upload", Sent: "Video" });
    } else if (docData.audio) {
      const docRef = db.collection("audio").doc();

      // Obtém metadados do áudio
      const metadata = await mm.parseFile(docData.audio);
      docData.metadata = metadata;
      docData.artist = req.body.artist;

      // Tenta salvar no Firebase e loga o sucesso
      await docRef.set(docData);
      console.log("Documento de áudio salvo com sucesso no Firebase");
      return res.status(200).send({ message: "Success in upload", Sent: "Audio" });
    } else {
      return res.status(400).send({ message: "Os dados enviados não são válidos para áudio ou vídeo." });
    }
  } catch (error) {
    // Log detalhado do erro
    console.error("Erro ao fazer o upload de dados:", error);

    // Envia uma resposta de erro ao cliente com detalhes adicionais
    return res.status(500).send({
      message: "Erro interno no servidor",
      error: error.message,
      stack: error.stack,
    });
  }
});

//Endpoint para criar grupos
app.post("/owner/group", async (req, res) => {
  try {
    const grupo = req.body;

    // Verifica se o array grupo está presente e possui pelo menos duas posições (owner e membros/nome)
    if (!grupo || grupo.length < 2) {
      return res.status(400).send({ message: "O array 'grupo' deve ter pelo menos o owner e membros/nome do grupo." });
    }

    // Extrai o owner e membros do array
    const owner = grupo[0];
    const membros = grupo.slice(1);

    // Obtém a quantidade atual de documentos na coleção 'group'
    const querySnapshot = await db.collection('group').get();
    const quantidadeGrupos = querySnapshot.size; // Tamanho da coleção

    // Cria um objeto para salvar no Firestore com groupName baseado na quantidade de grupos
    const groupData = {
      owner: owner,
      membros: membros,
      createdAt: new Date(),
      groupName: `Grupo ${quantidadeGrupos + 1}`, // Cria um nome de grupo único
    };

    // Adiciona os dados à coleção 'groups' no Firestore
    const docRef = await db.collection('group').add(groupData);

    // Retorna uma resposta de sucesso com o ID do documento criado
    res.status(200).send({
      message: "Grupo criado com sucesso",
      groupId: docRef.id,
    });

  } catch (error) {
    console.error("Erro ao criar grupo:", error);
    res.status(500).send({
      message: "Erro interno ao criar grupo",
      error: error.message,
    });
  }
});








app.get("/assets/:type/:id", async (req, res) => {
  
  const fileType = req.params.type;
  const fileId = req.params.id;
  const filePath = path.join(__dirname, "assets", fileType, fileId);

  if (fileType === "videos" && fs.existsSync(filePath)) {
    const stat = await fs.promises.stat(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    const contentType = mime.lookup(filePath) || "application/octet-stream";

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": contentType,
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": contentType,
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } else {
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Failed to send file:", err);
        res.status(err.status || 500).send("File not found");
      }
    });
  }
});


// Endpoint para retornar grupos com paginação
app.get("/api/groups/:id", async (req, res) => {
  const userId = req.params.id; // Obtém o userId dos parâmetros da URL

  try {
    // Log do userId recebido
    console.log(`Buscando grupos para o userId: ${userId}`);

    // Consulta a coleção 'group' no Firestore para pegar todos os grupos onde o 'owner.id' é igual ao 'userId'
    const snapshot = await db.collection('group').where('owner.id', '==', userId).get();

    // Array para armazenar todos os grupos encontrados
    let gruposEncontrados = [];

    // Itera sobre os documentos retornados
    snapshot.forEach(doc => {
      const groupData = doc.data();
      const grupo = {
        id: doc.id, // ID do documento
        owner: groupData.owner,
        membros: groupData.membros,
        createdAt: groupData.createdAt.toDate(), // Converte Timestamp para Date
        // Removendo a propriedade groupName do retorno
        // groupName: groupData.groupName, // Esta linha é removida pois não queremos retornar o nome do grupo
      };
      gruposEncontrados.push(grupo);
    });

    // Log para verificar os grupos encontrados
    if (gruposEncontrados.length > 0) {
      console.log("Grupos encontrados:", gruposEncontrados);
      res.status(200).send(gruposEncontrados); // Retorna os grupos encontrados
    } else {
      console.log("Nenhum grupo encontrado para o userId especificado.");
      res.status(404).send({ message: "Nenhum grupo encontrado para o userId especificado." });
    }

  } catch (error) {
    // Captura e loga erros no console
    console.error("Erro ao obter grupos:", error);
    // Retorna uma resposta de erro com detalhes do erro
    res.status(500).send({
      message: "Erro interno ao obter grupos",
      error: error.message,
    });
  }
});









// Rota para obter vídeos
app.get("/videos", async (req, res) => {
  try {
    const videosRef = db.collection("video");
    
    // Verifica se a coleção de vídeos existe
    if (!videosRef) {
      return res.status(400).send({
        message: "Falha ao obter a coleção de vídeos do banco de dados."
      });
    }
    
    const snapshot = await videosRef.get();
    const videos = [];

    snapshot.forEach((doc) => {
      const video = doc.data();
      videos.push({
        id: doc.id, // ID do documento Firestore
        title: video.title ? video.title : null,
        description: video.description ? video.description : null,
        genre: video.genre ? video.genre : [],
        thumbnail: video.image ? `http://localhost:3001/${video.image.replace(/\\/g, "/")}` : null,
        videoUrl: video.video ? `http://localhost:3001/${video.video.replace(/\\/g, "/")}` : null,
        visibility: video.visibility ? video.visibility : "public", // Adicionando a visibilidade do vídeo
      });
    });

    return res.status(200).send({
      message: "Vídeos retornados com sucesso.",
      videos: videos,
    });
  } catch (error) {
    console.error("Erro ao buscar vídeos:", error);
    return res.status(500).send({
      message: "Erro interno no servidor ao buscar vídeos.",
      error: error.message,
    });
  }
});

// Novo endpoint para retornar todos os usuários
app.get("/users", async (req, res) => {
  try {
    const usersRef = db.collection("users");
    
    // Verifica se a referência da coleção "users" é válida
    if (!usersRef) {
      return res.status(400).send({
        message: "Falha ao coletar a coleção do banco de dados"
      });
    }

    // Obtém os documentos da coleção "users"
    const snapshot = await usersRef.get();
    let users = [];

    // Itera sobre cada documento na coleção "users"
    snapshot.forEach((doc) => {
      const user = doc.data();

      // Adiciona o usuário à lista de usuários, com verificação de campos
      users.push({
        id: doc.id, // ID do documento Firestore
        nome: user.nome || null, // Nome do usuário
        email: user.email || null // Email do usuário
      });
    });

    // Console.log das informações dos usuários
    console.log("Usuários retornados:", users);

    return res.status(200).send({
      message: "Usuários retornados",
      users: users,
    });
  } catch (error) {
    // Log do erro e envio de resposta com o erro detalhado
    console.error("Erro ao buscar usuários:", error);
    return res.status(500).send({
      message: "Erro interno no servidor",
      error: error.message,
      stack: error.stack,
    });
  }
});


app.get("/audios", async (req, res) => {
  try {
    const audiosRef = db.collection("audio");
    if (!audiosRef) {
      return res.status(400).send({
        message: "Falha ao coletar a coleção do banco de dados"
      });
    }

    const snapshot = await audiosRef.get();
    let songs = [];

    snapshot.forEach((doc) => {
      const song = doc.data();
      
      // Verifica e extrai o nome do artista, se disponível
      const artist = song.artist || (song.metadata && song.metadata.common && song.metadata.common.artist) || null;

      songs.push({
        id: doc.id, // ID do documento Firestore
        artist: artist, // Nome do artista vindo do Firebase
        title: song.title || null,
        genre: song.genre || null, // Ajusta para utilizar diretamente song.genre
        duration: song.duration || (song.metadata && song.metadata.format && song.metadata.format.duration) || null,
        thumbnail: song.image ? `http://localhost:3001/${song.image.replace(/\\/g, "/")}` : null,
        audioUrl: song.audio ? `http://localhost:3001/${song.audio.replace(/\\/g, "/")}` : null,
      });
    });

    // Console.log das informações dos áudios
    console.log("Áudios retornados:", songs);

    return res.status(200).send({
      message: "Áudios retornados",
      songs: songs,
    });
  } catch (error) {
    // Log do erro e envio de resposta com o erro detalhado
    console.error("Erro ao buscar áudios:", error);
    return res.status(500).send({
      message: "Erro interno no servidor",
      error: error.message,
      stack: error.stack,
    });
  }
});

// Endpoint para deletar um grupo da coleção 'group'
app.delete('/api/group/:id', async (req, res) => {
  const groupId = req.params.id;

  try {
    console.log("Tentando deletar o grupo com ID:", groupId);

    // Referência ao documento do grupo no Firestore
    const docRef = db.collection('group').doc(groupId);
    const doc = await docRef.get();

    if (!doc.exists) {
      console.log("Grupo não encontrado no Firestore para o ID:", groupId);
      return res.status(404).send({
        message: "Grupo não encontrado"
      });
    }

    // Obtém os dados do documento antes de deletar
    const groupData = doc.data();
    console.log("Dados do grupo a ser deletado:", groupData);

    // Deleta o documento da coleção 'group' no Firestore
    await docRef.delete();
    console.log("Documento de grupo deletado do Firestore para o ID:", groupId);

    // Responde ao cliente com sucesso
    return res.status(200).send({
      message: "Grupo deletado com sucesso"
    });

  } catch (error) {
    console.error("Erro ao deletar o grupo:", error);
    return res.status(500).send({
      message: "Erro interno no servidor",
      error: error.message
    });
  }
});



// Rota para deletar um áudio da coleção 'audio'
app.delete('/delete/audio/:id', async (req, res) => {
  const audioId = req.params.id;

  try {
    console.log("Tentando deletar o áudio com ID:", audioId);

    // Referência ao documento do áudio no Firestore
    const docRef = db.collection('audio').doc(audioId);
    const doc = await docRef.get();

    if (!doc.exists) {
      console.log("Áudio não encontrado no Firestore para o ID:", audioId);
      return res.status(404).send({
        message: "Áudio não encontrado"
      });
    }

    // Obtém os dados do documento antes de deletar
    const audioData = doc.data();
    console.log("Dados do áudio a ser deletado:", audioData);

    // Inicializa os caminhos dos arquivos
    const audioFilePath = audioData.audio ? path.join(__dirname, audioData.audio) : null;
    const imageFilePath = audioData.image ? path.join(__dirname, audioData.image) : null;

    // Função auxiliar para deletar arquivo
    const deleteFile = (filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Erro ao deletar o arquivo:", err);
          } else {
            console.log("Arquivo deletado com sucesso:", filePath);
          }
        });
      } else {
        console.log("Arquivo não encontrado no sistema de arquivos:", filePath);
      }
    };

    // Verifica e deleta os arquivos com base nos caminhos fornecidos
    if (audioFilePath && imageFilePath) {
      // Deleta ambos os arquivos, áudio e imagem
      console.log("Deletando áudio: "+audioFilePath+" e imagem: "+imageFilePath);
      deleteFile(audioFilePath);
      deleteFile(imageFilePath);
    } else if (audioFilePath) {
      // Deleta apenas o arquivo de áudio
      console.log("Deletando áudio: "+audioFilePath);
      deleteFile(audioFilePath);
    } else if (imageFilePath) {
      // Deleta apenas o arquivo de imagem
      console.log("Deletando apenas a imagem: "+imageFilePath);
      deleteFile(imageFilePath);
    } else {
      console.log("Nenhum arquivo de áudio ou imagem encontrado para deletar.");
    }

    // Deleta o documento da coleção 'audio' no Firestore
    await docRef.delete();
    console.log("Documento de áudio deletado do Firestore para o ID:", audioId);

    // Responde ao cliente com sucesso
    return res.status(200).send({
      message: "Áudio deletado com sucesso"
    });

  } catch (error) {
    console.error("Erro ao deletar o áudio:", error);
    return res.status(500).send({
      message: "Erro interno no servidor",
      error: error.message
    });
  }
});


// Endpoint para deletar um vídeo da coleção 'video'
app.delete('/delete/video/:id', async (req, res) => {
  const videoId = req.params.id;

  try {
    console.log("Tentando deletar o vídeo com ID:", videoId);

    // Referência ao documento do vídeo no Firestore
    const docRef = db.collection('video').doc(videoId);
    const doc = await docRef.get();

    if (!doc.exists) {
      console.log("Vídeo não encontrado no Firestore para o ID:", videoId);
      return res.status(404).send({
        message: "Vídeo não encontrado"
      });
    }

    // Obtém os dados do documento antes de deletar
    const videoData = doc.data();
    console.log("Dados do vídeo a ser deletado:", videoData);

    // Inicializa os caminhos dos arquivos
    const videoFilePath = videoData.video ? path.join(__dirname, videoData.video) : null;
    const imageFilePath = videoData.image ? path.join(__dirname, videoData.image) : null;

    // Função auxiliar para deletar arquivo
    const deleteFile = (filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Erro ao deletar o arquivo:", err);
          } else {
            console.log("Arquivo deletado com sucesso:", filePath);
          }
        });
      } else {
        console.log("Arquivo não encontrado no sistema de arquivos:", filePath);
      }
    };

    // Verifica e deleta os arquivos com base nos caminhos fornecidos
    if (videoFilePath && imageFilePath) {
      // Deleta ambos os arquivos, vídeo e imagem
      console.log("Deletando vídeo: " + videoFilePath + " e imagem: " + imageFilePath);
      deleteFile(videoFilePath);
      deleteFile(imageFilePath);
    } else if (videoFilePath) {
      // Deleta apenas o arquivo de vídeo
      console.log("Deletando vídeo: " + videoFilePath);
      deleteFile(videoFilePath);
    } else if (imageFilePath) {
      // Deleta apenas o arquivo de imagem
      console.log("Deletando apenas a imagem: " + imageFilePath);
      deleteFile(imageFilePath);
    } else {
      console.log("Nenhum arquivo de vídeo ou imagem encontrado para deletar.");
    }

    // Deleta o documento da coleção 'video' no Firestore
    await docRef.delete();
    console.log("Documento de vídeo deletado do Firestore para o ID:", videoId);

    // Responde ao cliente com sucesso
    return res.status(200).send({
      message: "Vídeo deletado com sucesso"
    });

  } catch (error) {
    console.error("Erro ao deletar o vídeo:", error);
    return res.status(500).send({
      message: "Erro interno no servidor",
      error: error.message
    });
  }
});


// Adiciona a rota para enviar dados para a coleção radio
app.post('/api/radio', async (req, res) => {
  const { nome, link, frequencia, visibility } = req.body;

  if (!nome || !link || !frequencia) {
    return res.status(400).send({ message: "Nome, link e frequência são obrigatórios" });
  }

  try {
    const radioData = {
      nome,
      link,
      frequencia,
      visibility: visibility || "public", // Define a visibilidade como público por padrão
    };

    // Adiciona os dados à coleção 'radio' no Firestore
    const docRef = await db.collection('radio').add(radioData);
    
    res.status(200).send({
      message: "Rádio adicionada com sucesso",
      radioId: docRef.id,
    });
  } catch (error) {
    console.error("Erro ao adicionar rádio:", error);
    res.status(500).send({
      message: "Erro interno no servidor",
      error: error.message,
    });
  }
});

// Endpoint para retornar as rádios da coleção 'radio'
app.get("/radios", async (req, res) => {
  try {
    const radiosRef = db.collection("radio");
    const snapshot = await radiosRef.get();
    
    if (snapshot.empty) {
      return res.status(404).send({
        message: "Nenhuma rádio encontrada",
      });
    }
    
    const radios = [];
    snapshot.forEach((doc) => {
      const radioData = doc.data();
      radios.push({
        id: doc.id, // Inclui o ID do documento para referência futura
        nome: radioData.nome,
        link: radioData.link,
        frequencia: radioData.frequencia,
        visibility: radioData.visibility,
      });
    });
    
    res.status(200).send({
      message: "Rádios retornadas com sucesso",
      radios: radios,
    });
  } catch (error) {
    console.error("Erro ao buscar rádios:", error);
    res.status(500).send({
      message: "Erro interno no servidor",
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
