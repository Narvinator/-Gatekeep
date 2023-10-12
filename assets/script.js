// mobile menu
const burgerIcon = document.querySelector("#burger");
const navbarMenu = document.querySelector("#nav-links");
const artistPhoto = document.getElementById("artist-photo");
const artistName = document.getElementById("artist-name");

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

localStorage.setItem("client_id", client_id);
localStorage.setItem("client_secret", client_secret);

// const endpoints
const authorize_url = "https://accounts.spotify.com/authorize";
const token_url = "https://accounts.spotify.com/api/token";
const top_artist_url = "https://api.spotify.com/v1/me/top/artists?limit=3&offset=0";

var redirectURL = "";

// request auth func
function requestAuthorization() {

    //console.log("clickkkk");

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

        // clean url after I get the code needed
        window.history.pushState("", "", redirect_URI);

        // set up queries for get req 
        let url = `&grant_type=authorization_code&code=${code}&redirect_uri=${encodeURI(redirect_URI)}`

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
    //console.log(code);

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
    req.setRequestHeader("Authorization", `Basic ${btoa(client_id + ":"  + client_secret)}`);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    // send 
    req.send(url);

    // debug log 
    //console.log(url);

    // feed response to check repsonse 
    req.onload = checkTokenResponse;
}

// func to check responses 
function checkTokenResponse() {

    // successful req
    if (this.status == 200) {

        // parse data
        var token_info = JSON.parse(this.responseText);
        //console.log(token_info);

        // set new tokens 
        access_token = token_info.access_token;
        refresh_token = token_info.refresh_token;
        expiresIn = token_info.expires_in;

        // save tokens to storage 
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        //check if token expired
        if(expiresIn < 0){
            access_token = refresh_token;
        }

        // get top artist 
        getTopArtist(access_token);
    }
    else {
        // bad req 
        console.log(this.responseText);
    }
}

// func to get top artist 
function getTopArtist(token) {

    //console.log("we made it here");

    // new xml req var
    var request = new XMLHttpRequest();

    // open req
    request.open("GET", top_artist_url, true);

    //set headers for auth 
    request.setRequestHeader("Authorization", "Bearer " + token);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");


    request.send(null);

    //console.log(token);

    // check repsonses
    request.onload = checkArtistResponse;
}

// func to check repsonse on api call
function checkArtistResponse() {

    // if successful call
    if(this.status == 200) {

        // aprse data to get objects
        var top_artist = JSON.parse(this.responseText);

        // list out top 3 artist 
        top_artist.items.forEach(element => {
            console.log(element.name);
        });

        artistPhoto.innerHTML = `<img class= "artist-photo" src="${top_artist.items[0].images[0].url}" alt="${top_artist.items[0].name} photo">`;

        artistName.innerText = top_artist.items[0].name
    } else {
        // bad req
        console.log(this.responseText);
    }
}
