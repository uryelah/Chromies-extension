window.onload = () => {
  setTimeout(() => {
    const x = document.getElementById("login");
    const y = document.getElementById("register");
    const z = document.getElementById("btn");
  
    document.getElementById('login-btn').addEventListener('click', e => {
      x.style.left = "5px";
      y.style.left = "450px";
      z.style.left = "0";
    });
  
    document.getElementById('register-btn').addEventListener('click', e => {
      x.style.left = "-400px";
      y.style.left = "10px";
      z.style.left = "100px";
    });
  }, 500);
};
