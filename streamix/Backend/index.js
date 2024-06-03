const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
let multer = require("multer");
const { db, userAuth } = require("./Database/firebase.js");

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

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
