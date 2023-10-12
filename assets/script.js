// mobile menu
const burgerIcon = document.querySelector("#burger");
const navbarMenu = document.querySelector("#nav-links");

burgerIcon.addEventListener('click', (event) => {
    navbarMenu.classList.toggle("is-active");
    event.preventDefault();
});

// redirect uri
var redirect_URI = "http://127.0.0.1:5500/index.html";

// string var for req 
var client_id = "a6e8b54904ef4eba84907002452c0ba0";
var client_secret = "65c09d5e68ca4d0a8439a607c8b7e44c";

