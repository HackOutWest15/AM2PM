$('a.artist.card').on('click', function() {
    if(!dragCheck) {
        document.querySelector('#swipeview').classList.add('hiddenleft');
        document.querySelector('#artistview').classList.remove('hiddenright');
    }
});
$('a.navback').on('click', function() {
    document.querySelector('#swipeview').classList.remove('hiddenleft');
    document.querySelector('#artistview').classList.add('hiddenright');
});
$('a.getschedule').on('click', function() {
    var request = new XMLHttpRequest();
    request.open('POST', 'http://10.47.12.119:5000/schedule', true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.onload = receivedSchedule;
    request.send(JSON.stringify(liked));
});

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function receivedSchedule() {
    audio.pause();
    $('#scheduleview .main').html('');
    var shows = JSON.parse(this.responseText);
    var lastdate = new Date('1992-10-12');
    for(var i=0; i < shows.length; i++) {
        var date = new Date(shows[i].start_date);
        if(parseInt(shows[i].start_time.substr(0,2)) < 8) {
            date.setDate(date.getDate()-1);
        }
        if(date > lastdate) {
            lastdate = date;
            $('#scheduleview .main').append('<div class="datemarker"><p>'+days[date.getDay()]+'</p></div>');
        }

        $('#scheduleview .main').append('<div class="concert"><p>'+shows[i].name+'<br>'+shows[i].venue+' '+shows[i].start_time+'</p></div>');
    }
    document.querySelector('#scheduleview').classList.remove('hiddenbottom');
}

function requestedResponse () {
    data = JSON.parse(this.responseText);
    shuffle(data);

    localStorage.setItem('data', this.responseText);
    setArtist(currentArtist);
}

function setArtist(cur) {
    if(cur === 2) {
        $('.firstinfo').addClass('hidden');
    }
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
        if(typeof data[cur-1].artist_page_url !== 'undefined') {
            el.href = data[cur-1].artist_page_url;
            $(el).removeClass('hidden');
            $('a.artist.card').off().on('click', function() {
                if(!dragCheck) {
                    document.querySelector('#swipeview').classList.add('hiddenleft');
                    document.querySelector('#artistview').classList.remove('hiddenright');
                }
            });
        } else {
            $('a.artist.card').off().on('click', function() {});
        }
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
        els = document.querySelectorAll('.trackname');
        [].forEach.call(els, function(el) {
            el.innerHTML = '';
        });

        els = document.querySelectorAll('.albumname');
        [].forEach.call(els, function(el) {
            el.innerHTML = '';
        });

        els = document.querySelectorAll('.album.card .photo');
        [].forEach.call(els, function(el) {
            el.style.backgroundImage = "url('beck.jpg')";
        });

        audio.src = '';
        audio.load();
        audio.play();

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

    audio.src = data[currentArtist-1].tracks[currentTrack-1].preview_url;
    audio.load();
    audio.play();
}

function displayBadge(bool, callback) {
    if(bool) {
        document.querySelector('.badge').style.backgroundImage = "url('PopAdd.png')";
    } else {
        document.querySelector('.badge').style.backgroundImage = "url('PopDontAdd.png')";
    }
    $('.badge.invisible').removeClass('invisible');
    $('.badge.hidden').removeClass('hidden');
    setTimeout(function() {
        $('.badge').addClass('hidden');
    }, 1400);
    setTimeout(function() {
        $('.badge').addClass('invisible');
    }, 1050);
}

var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

var data = JSON.parse(localStorage.getItem('data')) || [];
var liked = JSON.parse(localStorage.getItem('liked')) || [];
var currentArtist = localStorage.getItem('currentArtist') || 1;
var currentTrack = 1;
var dragCheck = false;

var audio = document.querySelector('audio');

if(currentArtist > 1) { $('.firstinfo').addClass('hidden'); }

setArtist(currentArtist);

if(localStorage.getItem('data') === null) {
    var request = new XMLHttpRequest();
    request.onload = requestedResponse;
    request.open('GET', 'http://10.47.12.119:5000/artists', true);
    request.send();
}

$(function() {
    $('.draggable').draggable({
        revert: 'invalid',
        revertDuration: 200,
        drag: function(){
            dragCheck = true;
        },
        stop: function(){
            dragCheck = false;
        }
    });

    $('.drop').droppable({
        activeClass: 'ui-state-default',
        hoverClass: 'ui-state-hover',
        drop: function(event, ui) {
            this.classList.add('ui-state-hover');
            if(this.classList.contains('yes')) {
                liked.push(data[currentArtist-1].name || '');
                localStorage.setItem('liked', JSON.stringify(liked));
                
                ui.draggable.parent().addClass('hidden', function() {
                    setTimeout(function() { $('.ui-state-hover').removeClass('ui-state-hover'); }, 150);
                    setTimeout(function() {
                        $('.card.artist .photo').removeAttr('style');
                        if(currentArtist < data.length) {
                            setArtist(++currentArtist);
                        } else {
                            var request = new XMLHttpRequest();
                            request.open('POST', 'http://10.47.12.119:5000/schedule', true);
                            request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
                            request.onload = receivedSchedule;
                            request.send(JSON.stringify(liked));
                        }
                        $('.card.artist.hidden').removeClass('hidden');

                    }, 350);

                    displayBadge(true);
                });
            } else {

                ui.draggable.parent().addClass('hidden', function() {
                    setTimeout(function() { $('.ui-state-hover').removeClass('ui-state-hover'); }, 150);
                    setTimeout(function() {
                        $('.card.artist .photo').removeAttr('style');
                        if(currentArtist < data.length) {
                            setArtist(++currentArtist);
                        } else {
                            var request = new XMLHttpRequest();
                            request.open('POST', 'http://10.47.12.119:5000/schedule', true);
                            request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
                            request.onload = receivedSchedule;
                            request.send(JSON.stringify(liked));
                        }
                        $('.card.artist.hidden').removeClass('hidden');
                    }, 350);

                    displayBadge(false);
                });
            }
        }
    });
});