import './style.css';
import confetti from 'canvas-confetti';

// YT Player Data
let ytPlayer = null;
let isAudioPlaying = false;

// DOM Elements
const entranceScreen = document.getElementById('entrance');
const enterBtn = document.getElementById('enter-btn');
const scrollContainer = document.getElementById('journey-scroll');
const musicToggleBtn = document.getElementById('music-toggle');
const blowBtn = document.getElementById('blow-candles-btn');
const flames = document.querySelectorAll('.flame');
const typeTextContainer = document.getElementById('typewriter-text');
const fullLetterText = typeTextContainer.innerText;

// Loading YouTube Player for "Arz Kiya Hai"
window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player('yt-player', {
    height: '1',
    width: '1',
    videoId: 'bP8ATWCvqzw',
    playerVars: { 'autoplay': 0, 'controls': 0, 'loop': 1, 'playlist': 'bP8ATWCvqzw' }
  });
};

const tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Audio Logic
function playMusic() {
  isAudioPlaying = true;
  musicToggleBtn.classList.add('playing');
  
  if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
    try {
      ytPlayer.playVideo();
    } catch (e) {
      console.warn('YT Playback failed', e);
    }
  }
}

function stopMusic() {
  isAudioPlaying = false;
  musicToggleBtn.classList.remove('playing');
  if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
    ytPlayer.pauseVideo();
  }
}

musicToggleBtn.addEventListener('click', () => {
  if (isAudioPlaying) { stopMusic(); } else { playMusic(); }
});

// START THE JOURNEY
enterBtn.addEventListener('click', () => {
  entranceScreen.classList.add('fade-out');
  scrollContainer.classList.remove('hidden');
  document.body.style.overflowY = 'auto'; // Re-enable scrolling
  
  // Confetti Earthy Burst on entrance
  confetti({
    particleCount: 60,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#edebe4', '#8c7d6c', '#6b5c4d'], // Vintage colors
    shapes: ['circle']
  });

  playMusic();
});

// Avoid scrolling on entrance screen
document.body.style.overflowY = 'hidden';

// INTERSECTION OBSERVER FOR PARALLAX/FADE REVEALS
const revealElements = document.querySelectorAll('.obs-reveal');
let typeWriterTriggered = false;

const revealCallback = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      // Check if it's the letter typing out
      if (entry.target.querySelector('.typewriter-box') && !typeWriterTriggered) {
        typeWriterTriggered = true;
        typeTextContainer.innerText = '';
        triggerTypewriter(fullLetterText, 0);
      }
    }
  });
};

const revealObserver = new IntersectionObserver(revealCallback, {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// Typewriter Effect
function triggerTypewriter(text, i) {
  if (i < text.length) {
    typeTextContainer.innerHTML += text.charAt(i);
    setTimeout(() => triggerTypewriter(text, i + 1), 40); // Typing speed
  }
}

// Interactive Cake Blowing
blowBtn.addEventListener('click', () => {
  flames.forEach(flame => flame.classList.add('off'));
  
  blowBtn.innerText = "✨ Wish Granted ✨";
  blowBtn.style.color = "#8c7d6c";
  blowBtn.style.border = "none";
  
  // Earthy Vintage Confetti Drop
  const duration = 2500;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#edebe4', '#8c7d6c', '#fff']
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#edebe4', '#8c7d6c', '#fff']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
});
