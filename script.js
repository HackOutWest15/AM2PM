document.querySelector('a.artist.card').addEventListener('click', function() {
    document.querySelector('#swipeview').classList.add('hiddenleft');
    document.querySelector('#artistview').classList.remove('hiddenright');
});
document.querySelector('a.navback').addEventListener('click', function() {
    document.querySelector('#swipeview').classList.remove('hiddenleft');
    document.querySelector('#artistview').classList.add('hiddenright');
});

function requestedResponse () {
    data = JSON.parse(this.responseText);
    localStorage.setItem('data', this.responseText);
    setArtist();
}

function setStuff() {
    if(data.length === 0) return;

    cur = Math.floor(Math.random() * data.length) + 1;

    var els = document.querySelectorAll('.totalartistsnum');
    [].forEach.call(els, function(el) {
        el.innerHTML = data.length;
    });

    els = document.querySelectorAll('.currentartistnum');
    [].forEach.call(els, function(el) {
        el.innerHTML = cur;
    });

    els = document.querySelectorAll('.artistname');
    [].forEach.call(els, function(el) {
        el.innerHTML = data[cur-1].name;
    });

    els = document.querySelectorAll('.artisturl');
    [].forEach.call(els, function(el) {
        el.href = data[cur-1].artist_page_url;
    });

    els = document.querySelectorAll('.artist.card .photo');
    [].forEach.call(els, function(el) {
        el.style.backgroundImage = "url('"+data[cur-1].image_url+"')";
    });

    /*
    // track.name, track.preview_url, track.album.name track.album.image_url
    // https://p.scdn.co/mp3-preview/c3a9cbf983b8b76fbc07e0807fc5918957caa8ba

    els = document.querySelectorAll('.trackname');
    [].forEach.call(els, function(el) {
        el.innerHTML = data[cur-1].tracks[0].name;
    });

    els = document.querySelectorAll('.album');
    [].forEach.call(els, function(el) {
        el.innerHTML = data[cur-1].tracks[0].album.name;
    });

    els = document.querySelectorAll('.album.card .photo');
    [].forEach.call(els, function(el) {
        el.style.backgroundImage = "url('"+data[cur-1].tracks[0].album.image_url+"')";
    });

    els = document.querySelector('#audioplayer');
    */
}

var data = JSON.parse(localStorage.getItem('data')) || [];
var cur = 1;

setStuff();

var request = new XMLHttpRequest();
request.onload = requestedResponse;
request.open('get', 'http://10.47.12.157:5000/artists', true);
//request.open('get', 'data.json', true);
request.send();