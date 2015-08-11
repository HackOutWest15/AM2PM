document.querySelector('a.artist.card').addEventListener('click', function() {
    document.querySelector('#swipeview').classList.add('hiddenleft');
    document.querySelector('#artistview').classList.remove('hiddenright');
});
document.querySelector('a.navback').addEventListener('click', function() {
    document.querySelector('#swipeview').classList.remove('hiddenleft');
    document.querySelector('#artistview').classList.add('hiddenright');
});

document.addEventListener('keydown', function(e) {
    if(!document.getElementById('swipeview').classList.contains('hiddenleft')) {
        if(e.which === 37 ) {
            if(currentArtist < data.length) {
                setArtist(++currentArtist);
            }
        } else if(e.which === 39) {
            liked.push({'id': data[currentArtist-1].name});
            localStorage.setItem('liked', JSON.stringify(liked));
            console.log(JSON.stringify(liked));

            if(currentArtist < data.length) {
                setArtist(++currentArtist);
            }
        }
    }
});

function requestedResponse () {
    data = JSON.parse(this.responseText);
    localStorage.setItem('data', this.responseText);
    setArtist(currentArtist);
}

function setArtist(cur) {
    if(data.length === 0) return;

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
        if(typeof data[cur-1].image_url !== 'undefined') {
            el.style.backgroundImage = "url('"+data[cur-1].image_url+"')";
        }
    });

    currentTrack = 1;
    setTrack(currentTrack);

    localStorage.setItem('currentArtist', currentArtist);
}

function setTrack(cur) {
    if(typeof data[currentArtist-1].tracks === 'undefined') {
        return;
    }

    els = document.querySelectorAll('.trackname');
    [].forEach.call(els, function(el) {
        el.innerHTML = data[currentArtist-1].tracks[currentTrack-1].name;
    });

    els = document.querySelectorAll('.albumname');
    [].forEach.call(els, function(el) {
        el.innerHTML = data[currentArtist-1].tracks[currentTrack-1].album.name;
    });

    els = document.querySelectorAll('.album.card .photo');
    [].forEach.call(els, function(el) {
        el.style.backgroundImage = "url('"+data[currentArtist-1].tracks[currentTrack-1].album.image_url+"')";
    });

    audio = document.querySelector('audio');
    audio.src = data[currentArtist-1].tracks[currentTrack-1].preview_url;
    audio.load();
    audio.play();
}

var data = JSON.parse(localStorage.getItem('data')) || [];
var liked = JSON.parse(localStorage.getItem('liked')) || [];
var currentArtist = localStorage.getItem('currentArtist') || 1;
var currentTrack = 1;

setArtist(currentArtist);

var request = new XMLHttpRequest();
request.onload = requestedResponse;
request.open('get', 'http://10.47.12.157:5000/artists', true);
//request.open('get', 'data.json', true);
request.send();