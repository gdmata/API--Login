const express = require("express");
const router = express.Router();
const server = require("../../server");
const get = async (req, res) => {
  res.json({ mensagem: "ok" });
};
router.get("/", get);

router.post("/order", async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(400).json({ mensagem: "deu ruim meu chapa" });
  }
});

//
module.exports = OrderClass;
module.exports = router;
