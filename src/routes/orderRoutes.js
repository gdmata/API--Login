const express = require("express");
const router = express.Router();
const { jwtValid } = require("../controllers/authCheckController.js");
const { createOrder } = require("../controllers/orderController.js");
const get = async (req, res) => {
  res.json({ mensagem: "ok" });
};
router.get("/", get);

router.post("/order", jwtValid, createOrder);

//

module.exports = router;
