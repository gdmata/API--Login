const frm = document.querySelector("form");
const firstNameInput = document.querySelector("#firstName");
const surNameInput = document.querySelector("#surName");
const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");
const repeatPasswordInput = document.querySelector("#repeatPasswordInput");
const userPhoneInput = document.querySelector("#userPhone");
///
const errorMessage = document.querySelector("#errorMessage");
frm.addEventListener("submit", async (e) => {
  const firstName = firstNameInput.value;
  const surName = surNameInput.value;
  const regPhone = userPhoneInput.value;
  const userMail = emailInput.value;
  const password = () => {
    if (passwordInput.value === repeatPasswordInput.value) {
      return passwordInput.value;
    } else {
      return console.log("Passwords don't match");
    }
  };

  const regData = {
    userName: `${firstName} ${surName}`,
    userPhone: regPhone,
    password: password(),
    email: userMail,
  };
  console.log(regData);

  let errors = [];

  if (firstNameInput) {
    //If have a firstname is register
    errors = getSignUpErrors(
      firstNameInput.value,
      surNameInput.value,
      emailInput.value,
      userPhoneInput.value,
      passwordInput.value,
      repeatPasswordInput.value,
    );
  } else {
    // if aint a firstname is login
    errors = getLoginErrors(emailInput.value, passwordInput.value);
  }

  if (errors.length > 0) {
    e.preventDefault();
    errorMessage.textContent = errors.join(". ");
  }
  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(regData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log("Fetch failed", error);
  }
});

function getSignUpErrors(
  firstName,
  surName,
  email,
  regPhone,
  password,
  repeatPassword,
) {
  let errors = [];
  if (firstName === "" || firstName === null) {
    errors.push("O nome é necessário");
    firstNameInput.parentElement.classList.add("incorrect");
  }
  if (surName === "" || surName === null) {
    errors.push("O sobrenome é necessário");
    surNameInput.parentElement.classList.add("incorrect");
  }
  if (email === "" || email === null) {
    errors.push("O email é necessário");
    emailInput.parentElement.classList.add("incorrect");
  }
  if (isNaN(regPhone)) {
    errors.push("Insira um número válido");
    userPhoneInput.parentElement.classList.add("incorrect");
  }
  if (regPhone === "" || regPhone === null) {
    errors.push("O telefone é necessário");
    userPhoneInput.parentElement.classList.add("incorrect");
  }
  if (password === "" || password === null) {
    errors.push("A senha é necessária");
    passwordInput.parentElement.classList.add("incorrect");
  }
  if (password.length < 8) {
    errors.push("A senha deve conter no mínimo 8 digitos");
    passwordInput.parentElement.classList.add("incorrect");
  }
  if (password !== repeatPassword) {
    errors.push("As senhas não coincidem");
    repeatPasswordInput.parentElement.classList.add("incorrect");
    passwordInput.parentElement.classList.add("incorrect");
  }
  return errors;
}

const allInputs = [
  firstNameInput,
  surNameInput,
  emailInput,
  passwordInput,
  repeatPasswordInput,
  userPhoneInput,
];

allInputs.forEach((input) => {
  input.addEventListener("input", () => {
    if (input.parentElement.classList.contains("incorrect")) {
      input.parentElement.classList.remove("incorrect");
      errorMessage.innerText = "";
    }
  });
});
