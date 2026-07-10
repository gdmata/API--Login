const express = require("express");

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

module.exports = OrderClass;
