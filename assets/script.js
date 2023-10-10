// mobile menu
const burgerIcon = document.querySelector("#burger");
const navbarMenu = document.querySelector("#nav-links");

burgerIcon.addEventListener('click', (event) => {
    navbarMenu.classList.toggle("is-active");
    event.preventDefault();
});