// mobile menu
const burgerIcon = document.querySelector("#burger");
const navbarMenu = document.querySelector("#nav-links");

// hooks
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

// store in mem
localStorage.setItem("client_id", client_id);
localStorage.setItem("client_secret", client_secret);

// const endpoints
// spotify
const authorize_url = "https://accounts.spotify.com/authorize";
const token_url = "https://accounts.spotify.com/api/token";
const top_artist_url = "https://api.spotify.com/v1/me/top/artists?limit=3&offset=0";

var redirectURL = "";

// youtube
const youtube_url = "https://www.googleapis.com/youtube/v3/search";
const youtube_API_key = "AIzaSyBJtFp0GmTRzERQ9HotaSFepsZfwuDJ0OQ";

var song_req = "";

const song_title_1 = document.getElementById("song-title-1");
const song_title_2 = document.getElementById("song-title-2");
const song_title_3 = document.getElementById("song-title-3");

const song_photo_1 = document.getElementById("song-album-1");
const song_photo_2 = document.getElementById("song-album-2");
const song_photo_3 = document.getElementById("song-album-3");

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

// spotify api 

// request auth func
function requestAuthorization() {

    //console.log("clickkkk");

    // build url (add on parameters)
    let url = authorize_url;
    url += `?client_id=${client_id}&response_type=code&redirect_uri=${encodeURI(redirect_URI)}&show_dialog=true&scope=user-top-read`

    // assign ref link to url
    window.location.href = url;
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

    // get req 
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
            //console.log(element.name);
        });

        // edit inner html to have img and put artist img with alt 
        artistPhoto.innerHTML = `<img class="artist-photo" src="${top_artist.items[0].images[0].url}" alt="${top_artist.items[0].name} photo">`;

        // edit inner text to store name of artist 
        artistName.innerText = top_artist.items[0].name

        getUnreleased(top_artist.items[0].name);
    } else {
        // bad req
        console.log(this.responseText);
    }
}

// youtube api
function getUnreleased(artist) {

    // made new xml var to handle get req
    var req = new XMLHttpRequest();

    // copy endpoint url
    var search_url = youtube_url;

    // build url to get top 3 unreleased search results from artist
    search_url += "?part=snippet";
    search_url += "&key=" + youtube_API_key;
    search_url += "&type=video";
    search_url += "&maxResults=3";
    search_url += "&q=" + artist + " unreleased songs";

    // opened get req using new url 
    req.open("GET", search_url, true);
    req.send(null);

    // check repsonse 
    req.onload = checkUnreleasedResponse;
}

// func to check response
function checkUnreleasedResponse() {
    // successful call
    if(this.status == 200) {
        //console.log(this.responseText);

        //console.log("woohoo");\

        // var to store data
        var videos = JSON.parse(this.responseText);

        // first video 
        //console.log(videos.items[0].snippet.thumbnails.default.url);
        //console.log(videos);
        // console.log(videos.items[0].id.videoId);
        // console.log(videos.items[0].snippet.title);
        // getting title
        var name_one = videos.items[0].snippet.title;

        //setting title
        song_title_1.innerText = name_one;

        // setting img
        song_photo_1.innerHTML = `<img class="artist-photo" src="${videos.items[0].snippet.thumbnails.default.url}">`


        // second video 
        // console.log(videos.items[1].id.videoId);
        // console.log(videos.items[1].snippet.title);
        // getting title
        var name_two = videos.items[1].snippet.title;

        //setting title
        song_title_2.innerText = name_two;

        // setting img
        song_photo_2.innerHTML = `<img class="artist-photo" src="${videos.items[1].snippet.thumbnails.default.url}">`


        // third video 
        // console.log(videos.items[2].id.videoId);
        // console.log(videos.items[2].snippet.title);
        // getting title
        var name_three = videos.items[2].snippet.title;

        //setting title
        song_title_3.innerText = name_three;

        // setting img
        song_photo_3.innerHTML = `<img class="artist-photo" src="${videos.items[2].snippet.thumbnails.default.url}">` 
    } else {
        // bad req
        console.log("awww");
    }
}
