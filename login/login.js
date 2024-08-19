const signIn = document.querySelector(".signin");

signIn.addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  localStorage.setItem("email", email);

  const authenticated = authentication(email, password);
  if (authenticated) {
    window.location.href = "/index.html";
  } else {
    document.getElementById(
      "alerts"
    ).innerHTML = `<div class="alert alert-danger" role="alert">
  Incorrect email or password
</div>`;
  }
});

function authentication(email, password) {
  if (email === "admin@gmail.com" && password === "12345") {
    return true;
  } else return false;
}
