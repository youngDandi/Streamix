const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
let multer = require("multer");
const { db, userAuth } = require("./Database/firebase.js");
const mm = require('music-metadata');
const { Stream } = require("stream");
const fs = require('fs');
const mime = require('mime-types');
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


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

app.post("/upload", upload.any(), async (req, res) => {
  try {
    const fileDetails = req.files.map((file) => ({
      path: path.join(file.destination, file.filename),
      mimetype: file.mimetype,
      originalname: file.originalname,
      size: file.size,
    }));
     console.log(req.files)
    let docData = { title: req.body.title };

    fileDetails.forEach((file) => {
      if (file.mimetype.startsWith("image/")) {
        docData.image = file.path;
      } else if (file.mimetype.startsWith("video/")) {
        docData.video = file.path;
      } else if (file.mimetype.startsWith("audio/")) {
        docData.audio = file.path;
      }
    });

   if (docData.video && docData.image) {
    const docRef = db.collection('video').doc();
    await docRef.set(docData);
      return res.status(200).send({ message: "Success in upload", Sent: "Video" });
    
    } else {
      
      const docRef = db.collection('audio').doc();
      const metadata = await mm.parseFile(docData.audio);
      docData.metadata = metadata;

      await docRef.set(docData);
      return res.status(200).send({ message: "Success in upload", Sent: "Audio" });
    } 

  } catch (error) {
    console.error("Erro ao fazer o upload de dados:", error);
    return res.status(400).send({
      message: "Server Error",
    });
  }
});

app.get('/assets/:type/:id', async (req, res) => {

  /* 
  Manual testing function, after we will 
  have to adjust this to search the database
  for the file, return the path and stream
  it. */
  const fileType = req.params.type;
  const fileId = req.params.id;
  const filePath = path.join(__dirname, 'assets', fileType, fileId);

  if (fileType === 'videos' && fs.existsSync(filePath)) {
      const stat = await fs.promises.stat(filePath);
      const fileSize = stat.size;
      const range = req.headers.range;
      const contentType = mime.lookup(filePath) || 'application/octet-stream';
      
      if (range) {
          const parts = range.replace(/bytes=/, "").split("-");
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
          const chunksize = (end - start) + 1;
          const file = fs.createReadStream(filePath, { start, end });
          const head = {
              'Content-Range': `bytes ${start}-${end}/${fileSize}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': chunksize,
              'Content-Type': contentType,
          };    
          res.writeHead(206, head);
          file.pipe(res);
      
      } else {
          const head = {
              'Content-Length': fileSize,
              'Content-Type': contentType
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
      }
    );
  }
});

app.get('/audios',async(req,res)=>{
const audiosRef = db.collection('audio');
const snapshot = audiosRef.get();
var songs = [];
(await snapshot).forEach(doc => {
  const song = doc.data();
  // console.log(doc.id,'=>',doc.data());
  console.log(doc.id,'=>',song.metadata.common.genre)
  songs.push({
  "Artist": song.metadata.common.artist ? song.metadata.common.artist : null,
    "Title": song.title ? song.title : null,
    "Genre": Array.isArray(song.metadata.common.genre) && song.metadata.common.genre.length > 0 ? song.metadata.common.genre[0] : null,
    "Duration":song.metadata.format.duration ? song.metadata.format.duration : null,
    "thumbnail": song.image ? song.image : null,
    "audio": song.audio ? song.image : null 
  })
})
return res.status(200).send({
  message:"Audios Returned",
  songs: songs
  
});
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
