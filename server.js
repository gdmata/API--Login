const express = require("express");
require("dotenv").config();
const orderRoutes = require("./src/routes/orderRoutes");
const userRoutes = require("./src/routes/userRoutes");
const cors = require("cors");
//
//
//
//
const app = express();
exports.app = app;
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(express.static("src"));
//
app.use(orderRoutes);
app.use(userRoutes);
///
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

//

//LIGA SERVER DE MINECRAFT

connectToMongoDB().then(() => {
  app.listen(3000, () => {
    console.log("server tá on");
  });
});
