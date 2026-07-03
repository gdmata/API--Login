const express = require("express");
const router = express.Router();
const server = require("./server");
const get = async (req, res) => {
  res.json({ mensagem: "ok" });
};
router.get("/", get);

class OrderClass {
  static orderIdCounter = 1;
  constructor(userName, userPhone, userAddress, items, paymentMethod) {
    this.orderID = OrderClass.orderIdCounter++;
    this.orderDate = new Date();

    this.userName = userName;
    this.userPhone = userPhone;
    this.userAddress = userAddress;
    this.items = items;
    this.paymentMethod = paymentMethod;

    this.totalPrice = this.calcTotal(items);
  }

  calcTotal(items) {
    return items.reduce((total, item) => {
      total + item.price * item.quantity;
    });
  }

  toDataBase() {
    return {
      orderId: this.orderID,
      userName: this.userName,
      userPhone: this.userPhone,
      userAddress: this.userAddress,
      items: this.items,
      totalPrice: this.totalPrice,
      paymentMethod: this.paymentMethod,
    };
  }
}
router.post("/order", async (req, res) => {
  try {
    const { email, items, paymentMethod } = req.body;
    const db = req.app.locals.db;
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
    res.status(400).json({ mensagem: "deu ruim meu chapa" });
  }
});

//
module.exports = OrderClass;
module.exports = router;
