x

const frm = document.querySelector("form");
const firstNameInput = document.querySelector("#firstName");
const surNameInput = document.querySelector("#surName");
const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");
const repeatPasswordInput = document.querySelector("#repeatPasswordInput");
const errorMessage = document.querySelector('#errorMessage')
frm.addEventListener("submit", (e) => {
  let errors = [];

  if (firstNameInput) {
    //If have a firstname is register
    errors = getSignUpErrors(
      firstNameInput.value,
      surNameInput.value,
      emailInput.value,
      passwordInput.value,
      repeatPasswordInput.value,
    );
  } else {
    // if aint a firstname is login
    errors = getLoginErrors(emailInput.value, passwordInput.value);
  }

  if (errors.length > 0) {
    e.preventDefault();
    errorMessage.textContent = errors.join('. ')
  }
})

function getSignUpErrors(firstName, surName, email, password, repeatPassword) {
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
  if (password === "" || password === null) {
    errors.push("A senha é necessária");
    passwordInput.parentElement.classList.add("incorrect");
  }
  if (password.length < 8) {
    errors.push('A senha deve conter no mínimo 8 digitos')
    passwordInput.parentElement.classList.add("incorrect");
  }
  if (password !== repeatPassword) {
    errors.push("As senhas não coincidem");
    repeatPasswordInput.parentElement.classList.add("incorrect");
    passwordInput.parentElement.classList.add("incorrect");
  }
  return errors;
}

const allInputs = [firstNameInput, surNameInput, emailInput, passwordInput, repeatPasswordInput]

allInputs.forEach(input => {
  input.addEventListener('input', () => {
    if (input.parentElement.classList.contains('incorrect')) {
      input.parentElement.classList.remove('incorrect')
      errorMessage.innerText = ''
    }
  })
})