const frm = document.querySelector("#regForm");

frm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const regData = {
    userName: frm.registerName.value,
    email: frm.regMail.value,
    password: frm.regPass.value,
    userPhone: frm.regPhone.value,
    userAddress: frm.regAddress.value,
  };
  try {
    const res = await fetch("http://localhost:3000/registro", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(regData),
    });
    const dadosConvertidos = await res.json();
    if (res.ok) {
      alert("Cadastrado com sucesso" + " " + dadosConvertidos.usuario);
    } else {
      alert("Erro na solicitação, tente novamente!");
    }
  } catch (error) {
    console.error(error);
  }
});
