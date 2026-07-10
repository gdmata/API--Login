const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
let secret = process.env.JWT_SECRET;

const OrderClass = require("../models/orderModel");

const createOrder = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { email, items, paymentMethod } = req.body;
    const userData = await db.collection("usuarios").findOne({ email: email });
    if (!userData) {
      res.status(404).json({ erro: "Usuario não encontrado" });
    }

    let newOrder = new OrderClass(
      userData.userName,
      userData.userPhone,
      userData.userAddress,
      items,
      paymentMethod,
    );
    await db.collection("pedidos").insertOne(newOrder.toDataBase());
    res
      .status(200)
      .json({ mensagem: "TUDO OK", pedido: newOrder.toDataBase() });
  } catch (error) {
    console.log(error);
    res.status(400).json({ mensagem: "Deu ruim parceirinho" });
  }
};
module.exports = { createOrder };
