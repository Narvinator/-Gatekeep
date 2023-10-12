// mobile menu
const burgerIcon = document.querySelector("#burger");
const navbarMenu = document.querySelector("#nav-links");

// burgerIcon.addEventListener('click', (event) => {
//     navbarMenu.classList.toggle("is-active");
//     event.preventDefault();
// });

$("#sign-in-button").on("click", requestAuthorization);

// redirect uri
var redirect_URI = "http://127.0.0.1:5500/index.html";

// string var for req 
var client_id = "a6e8b54904ef4eba84907002452c0ba0";
var client_secret = "65c09d5e68ca4d0a8439a607c8b7e44c";

// const for first part of auth url
const authorize_url = "https://accounts.spotify.com/authorize";

// request auth func
function requestAuthorization(){

    console.log("clickkkk");

    // store for later
    localStorage.setItem("client_id", client_id);
    localStorage.getItem("client_secret", client_secret);

    // build url (add on parameters)
    let url = authorize_url;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_URI);
    url += "&show_dialog=true";
    url += "&scope=user-top-read";

    // assign ref link to url
    window.location.href = url;
}