const express = require("express");
const { jwtValid } = require("../controllers/authCheckController");
const router = express.Router();
router.get("/user", jwtValid, (req, res, next) => {
  res.json(req.userInfo);
  next();
});

module.exports = router;
