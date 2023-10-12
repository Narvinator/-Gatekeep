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

// const endpoints
const authorize_url = "https://accounts.spotify.com/authorize";
const token_url = "https://accounts.spotify.com/api/token";
const top_artist_url = "https://api.spotify.com/v1/me/top/artists";

var redirectURL = "";

// request auth func
function requestAuthorization() {

    console.log("clickkkk");

    // build url (add on parameters)
    let url = authorize_url;
    url += `?client_id=${client_id}&response_type=code&redirect_uri=${encodeURI(redirect_URI)}&show_dialog=true&scope=user-top-read`

    // assign ref link to url
    window.location.href = url;
}

// init func
function init() {

    // make sure its on redirect
    if (window.location.search.length > 0) {
        // parse redirect url to get returned code 
        var code = parseRedirect();

        // set up queries for get req 
        let url = `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURI(redirect_URI)}`
        url += `&client_id=${client_id}client_secret=${client_secret}`

        // put all tog in req 
        getTokenRequest(url);
    }
}

// func to parse redirect url and get code 
function parseRedirect() {

    // declare code var
    var code = null;

    // sett url to search bar 
    let url = window.location.search;

    // make sure theres queries 
    if (url.length > 0) {

        // url search var 
        let query = new URLSearchParams(url);

        // set code to code value from params
        code = query.get("code");
    }

    // debug log
    console.log(code);

    // return code 
    return code;
}

// func to handle req
function getTokenRequest(url) {

    // xmlhttp var 
    var req = new XMLHttpRequest();

    // open req 
    req.open("POST", token_url, true);

    // headers for post req
    req.setRequestHeader("Authorization", `Basic ${btoa(`${client_id} : ${client_secret}`)}`);
    req.setRequestHeader("Content-Type", "/x-www-form-urlencoded");

    // send 
    req.send(url);

    // debug log 
    console.log(url);

    // feed response to check repsonse 
    req.onload = checkResponse;
}

// func to check responses 
function checkResponse() {

    // successful req
    if (this.status == 200) {

        // parse data
        var token_info = JSON.parse(this.responseText);
        console.log(token_info);

        // set new tokens 
        access_token = token_info.access_token;
        refresh_token = token_info.refresh_token;

        // save tokens to storage 
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
    }
    else {
        // bad req 
        console.log(this.responseText);
    }
}


