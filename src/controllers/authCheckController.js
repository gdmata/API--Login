const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { userInfo } = require("node:os");
require("dotenv").config();
let secret = process.env.JWT_SECRET;
//
//
const jwtValid = (req, res, next) => {
  const token = req.headers["authorization"];
  if (token) {
    const jwtAuth = token.split(" ")[1];
    jwt.verify(jwtAuth, secret, (err, userInfo) => {
      if (err) {
        console.error(err);
        res.status(401).end();
        return;
      }
      req.userInfo = userInfo;
      next();
    });
  } else {
    res.status(400).end();
    return;
  }
  //
};

module.exports = { jwtValid };
