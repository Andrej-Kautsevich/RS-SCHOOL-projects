const audio = new Audio();
const playBtn = document.getElementById('play-pause');
let songIndex = 0;
let isPlay = false;

//Songs list
const songsList = [
  {
    name: "Don't Hurt Yourself",
    artist: "Beyonce",
    cover: "assets/img/lemonade.png",
    audio: "assets/audio/beyonce.mp3",
  },
  {
    name: "Don't Start Now",
    artist: "Dua Lipa",
    cover: "assets/img/dontstartnow.png",
    audio: "assets/audio/dontstartnow.mp3",
  },
]

//Start and stop music
playBtn.addEventListener('click', () => {
  playPause();
})

//Play song
const cover = document.querySelector('.cover img');
const songName = document.querySelector('.song-name');
const artistName = document.querySelector('.artist-name')
function playSong(song) {
  cover.setAttribute('src', song.cover);
  songName.innerText = song.name;
  artistName.innerText = song.artist;
  audio.src = song.audio;
  audio.currentTime = 0;
  isPlay = false;
  playPause();
}

function playPause() {
  const playBtnIcon = playBtn.querySelector('img');
  if (isPlay === false) {
    playBtnIcon.setAttribute('src', 'assets/svg/pause.png');
    audio.play();
    isPlay = true;
  } else {
    playBtnIcon.setAttribute('src', 'assets/svg/play.png');
    audio.pause();
    isPlay = false;
  }
}

//skipping back/forward
const backwardBtn = document.getElementById('backward');
const forwardBtn = document.getElementById('forward');

backwardBtn.addEventListener('click', () => skipSong('backward'));
forwardBtn.addEventListener('click', () => skipSong('forward'));
audio.addEventListener('ended', () => skipSong('forward'));

function skipSong(direction) {
  if (direction === 'backward') {
    songIndex = songIndex - 1;
    if (songIndex === -1) {
      songIndex = songsList.length - 1;
    }
    playSong(songsList[songIndex]);
  }
  if (direction === 'forward') {
    songIndex = songIndex + 1;
    if (songIndex >= songsList.length) {
      songIndex = 0;
    }
    playSong(songsList[songIndex]);
  }
}

//progress Bar 
const progressBar = document.getElementById('progress-bar');

audio.addEventListener('loadeddata', () => {
  progressBar.value = audio.currentTime;
  progressBar.setAttribute('max', audio.duration)
})

audio.addEventListener('timeupdate', () => {
  progressBar.value = audio.currentTime;
})

progressBar.addEventListener('change', () => {
  audio.currentTime = progressBar.value;
})






window.addEventListener('DOMContentLoaded', () => {
  audio.src = songsList[0].audio;
  cover.setAttribute('src', songsList[0].cover);
  songName.innerText = songsList[0].name;
  artistName.innerText = songsList[0].artist;
})