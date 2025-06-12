function toggleMenu() {
  const navMenu = document.getElementById("nav-menu");
  if (navMenu.style.display === "flex") {
    navMenu.style.display = "none";
  } else {
    navMenu.style.display = "flex";
  }
}

function tambahKeranjang(namaProduk) {
  alert(`${namaProduk} telah ditambahkan ke keranjang.`);
}