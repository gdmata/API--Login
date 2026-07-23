const { randomUUID } = require("node:crypto");
const bcrypt = require("bcrypt");

class UserClass {
  #password;
  constructor(userName, userPhone, email, password) {
    this.id = randomUUID();
    this.userName = userName;
    this.userPhone = userPhone;
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
      email: this.email,
      password: this.#password,
    };
  }
}

module.exports = UserClass;
