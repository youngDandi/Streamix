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

app.post("/upload", upload.any(), async (req, res) => {
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
