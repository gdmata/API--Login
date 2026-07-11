const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserClass = require("../models/userModel");
require("dotenv").config();
let secret = process.env.JWT_SECRET;

const register = async (req, res) => {
  const db = req.app.locals.db;
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
};

const login = async (req, res) => {
  const db = req.app.locals.db;
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
      res.set(token);
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
};

module.exports = { login, register };
