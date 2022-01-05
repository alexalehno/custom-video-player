"use strict";

// ......................Custom Video-player..........................//

const player = document.querySelector(".player");
const video = document.querySelector(".video");
const playBig = document.querySelector(".play__big");
const playSmall = document.querySelector(".play__small");
const toggle = document.querySelectorAll(".toggle");
const videoDuration = document.querySelector(".duration");
const videoVolume = document.querySelector(".volume");
const soundBtn = document.querySelector(".sound");
const fullScreenBtn = document.querySelector(".fullscreen");
const controls = document.querySelector(".control");

defaultVolume();

let playSpeed = 1;
let vol = video.volume;

function defaultVolume() {
  videoVolume.value = 20;
  video.volume = videoVolume.value / 100;
  changeProgressStyle(videoVolume, videoVolume.value)
}

function changeProgressStyle(el, value) {
  el.style.background = `linear-gradient(to right, #710707 0%, #710707 ${value}%, #c4c4c4 ${value}%, #c4c4c4 100%)`;
}

function togglePlay() {
  if (video.paused) {
    video.play();
    playBig.style.opacity = "0";
    playSmall.style.backgroundImage = 'url("./assets/svg/video/pause.svg")';
  } else {
    video.pause();
    playBig.style.opacity = "";
    playSmall.style.backgroundImage = "";
  }
}

function handleDuration() {
  videoDuration.value = (video.currentTime / video.duration) * 100;
  changeProgressStyle(videoDuration, videoDuration.value)

  if (video.duration === video.currentTime) {
    playBig.style.opacity = "";
    playSmall.style.backgroundImage = "";
  }
}

function handleVolume() {
  vol = videoVolume.value / 100;
  video.volume = vol;
  changeProgressStyle(videoVolume, videoVolume.value)

  if (video.volume === 0) {
    soundBtn.style.backgroundImage = 'url("./assets/svg/video/mute.svg")';
  } else {
    soundBtn.style.backgroundImage = "";
  }
}

function soundToggle() {
  if (video.volume !== 0) {
    video.volume = 0;
    videoVolume.value = video.volume;
    soundBtn.style.backgroundImage = 'url("./assets/svg/video/mute.svg")';
  } else {
    video.volume = vol;
    videoVolume.value = vol * 100;
    soundBtn.style.backgroundImage = "";
  }

  if (video.volume === 0) {
    soundBtn.style.backgroundImage = 'url("./assets/svg/video/mute.svg")';
  }
  changeProgressStyle(videoVolume, videoVolume.value);
}

function soundUp() {
  if (video.volume >= 1) return;
  vol += 0.1;
  video.volume = vol.toFixed(1);
  videoVolume.value = video.volume * 100;
  changeProgressStyle(videoVolume, videoVolume.value);
  soundBtn.style.backgroundImage = 'url("./assets/svg/video/volume.svg")';
}

function soundDown() {
  if (video.volume <= 0) {
    vol = 0;
    return;
  }
  vol -= 0.1;
  video.volume = vol.toFixed(1);
  videoVolume.value = video.volume * 100;

  changeProgressStyle(videoVolume, videoVolume.value);

  if (video.volume === 0) {
    soundBtn.style.backgroundImage = 'url("./assets/svg/video/mute.svg")';
  }
}

function changeCurrrentTime() {
  video.currentTime = (videoDuration.value * video.duration) / 100;
}

function fullScreen() {
  if (!document.fullscreenElement) {
    player.requestFullscreen();
    fullScreenBtn.style.backgroundImage =
      'url("./assets/svg/video/fullscreen_exit.svg")';
  } else {
    if (document.fullscreenEnabled) {
      document.exitFullscreen();
      fullScreenBtn.style.backgroundImage =
        'url("./assets/svg/video/fullscreen.svg")';
    }
  }
}

function showSpeedInd() {
  const speedIndicator = document.querySelector(".speed-indicator");
  speedIndicator.innerHTML = playSpeed + 'x';
  speedIndicator.style.opacity = 1;
  speedIndicator.style.zIndex = 9;

  setTimeout(() => {
    speedIndicator.style.opacity = '';
    speedIndicator.style.zIndex = '';
  }, 1000);
}

function speedHandler(num, flag) {
  playSpeed += num;

  if (flag) {
    if (playSpeed > 2) playSpeed = 2;
  } else {
    if (playSpeed < 0.25) playSpeed = 0.25;
  }

  video.playbackRate = playSpeed;
  showSpeedInd()
}

function pressTwoKeys(k1, k1a, k2, func) {
  let key1 = false;
  let key2 = false;

  document.addEventListener('keydown', (e) => {
    if (e.code === k1 || e.code === k1a) key1 = true;
    if (e.code === k2) key2 = true;
    if (key1 && key2) func()
  })

  document.addEventListener('keyup', e => {
    if (e.code === k1 || e.code === k1a) key1 = false;
    if (e.code === k2) key2 = false;
  })
}

function keyboardHandler(e) {
  if (e.target.tagName === 'INPUT') return;
  switch (e.code) {
    case "Space":
      e.preventDefault();
      togglePlay();
      break;
    case "KeyM":
      soundToggle();
      break;
    case "KeyF":
      fullScreen();
      break;
    case "ArrowUp":
      soundUp();
      break;
    case "ArrowDown":
      soundDown();
      break;
  }
}

pressTwoKeys('ShiftLeft', 'ShiftRight', 'Period', () => speedHandler(0.25, true));
pressTwoKeys('ShiftLeft', 'ShiftRight', 'Comma', () => speedHandler(-0.25, false));

toggle.forEach((el) => el.addEventListener("click", togglePlay));
video.addEventListener("click", togglePlay);
video.addEventListener("timeupdate", handleDuration);
videoVolume.addEventListener("input", handleVolume);
videoDuration.addEventListener("input", changeCurrrentTime);
soundBtn.addEventListener("click", soundToggle);
fullScreenBtn.addEventListener("click", fullScreen);
document.documentElement.addEventListener("fullscreenchange", () => {
  controls.classList.toggle("control-fullscreen");
});
document.addEventListener("keydown", (e) => keyboardHandler(e));
