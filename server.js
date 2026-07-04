const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { randomUUID } = require("node:crypto");
//
//
//
//
const cors = require("cors");
const app = express();
const router = express.Router();
app.use(express.json());
app.use(cors());
//
const orderRoutes = require("./order");
app.use("/", orderRoutes);
//
app.use(router);
//
//
let secret = process.env.JWT_SECRET;
//
//
//
//MONGO DB
const url = process.env.MONGO_URL;
const { MongoClient } = require("mongodb");
const client = new MongoClient(url);
let db;

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Você se conectou com sucesso ao MongoDB Atlas!");
    // Define o nome do banco de dados que você quer usar
    db = client.db("SushiManiaDB");

    app.locals.db = db;
    return db;
  } catch (erro) {
    console.error("Erro ao conectar no MongoDB:", erro);
  }
}
//
class UserClass {
  #password;
  constructor(userName, userPhone, userAddress, email, password) {
    this.id = randomUUID();
    this.userName = userName;
    this.userPhone = userPhone;
    this.userAddress = userAddress;
    this.email = email;
    this.#password = password;
  }
  async loginMethod(typedPassword) {
    return await bcrypt.compare(typedPassword, this.#password);
  }

  //Salvar usuarios em Json/DB
  toDataBase() {
    return {
      id: this.id,
      userName: this.userName,
      userPhone: this.userPhone,
      userAddress: this.userAddress,
      email: this.email,
      password: this.#password,
    };
  }
}

//

router.post("/registro", async (req, res) => {
  try {
    console.log(req.body);
    const { userName, userPhone, userAddress, email, password } = req.body;

    // acessa a coleção de usuarios do DB
    const userCollection = db.collection("usuarios");

    //Validar no db
    const existingUser = await userCollection.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ erro: "Este E-mail já está cadastrado" });
    }

    const existingPhone = await userCollection.findOne({
      userPhone: userPhone,
    });
    if (existingPhone) {
      return res.status(400).json({ erro: "Este telefone já está cadastrado" });
    }

    //HASH DA PASSWORD

    const hashPassWord = await bcrypt.hash(password, 10);

    //Nova instancia de usuario
    let newUser = new UserClass(
      userName,
      userPhone,
      userAddress,
      email,
      hashPassWord,
    );

    // Salvar o objeto no DB
    await userCollection.insertOne(newUser.toDataBase());

    res.json({
      mensagem: "Usuario criado com sucesso",
      usuario: newUser.userName,
      email: newUser.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao registrar usuario" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userCollection = db.collection("usuarios");

    const userData = await userCollection.findOne({ email: email });
    if (!userData) {
      return res.status(401).json({ erro: "Email ou senha incorretos" });
    }
    const userObj = new UserClass(
      userData.userName,
      userData.userPhone,
      userData.userAddress,
      userData.email,
      userData.password,
    );
    const validPassWord = await userObj.loginMethod(password);
    if (validPassWord) {
      const token = jwt.sign(
        {
          email: userData.email,
          name: userData.userName,
        },
        secret,
        { expiresIn: "1h" },
      );

      return res.status(201).json({
        token,
        mensagem: "Login realizado com sucesso",
        usuario: userObj.userName,
      });
    } else {
      return res.status(401).json({ erro: "Email ou senha incorretos" });
    }
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro inesperado do servidor" });
  }
});

//LIGA SERVER DE MINECRAFT

connectToMongoDB().then(() => {
  app.listen(3000, () => {
    console.log("server tá on");
  });
});
