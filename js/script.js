const video = document.getElementById("video");
const mp4source = document.getElementById("mp4source");
const oggsource = document.getElementById("oggsource");
const titleDiv = document.getElementById("title");
const playBtn = document.getElementById("play");
const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const fullscreenBtn = document.getElementById("fullscreen");
const timeDiv = document.getElementById("time");
const playlistDiv = document.getElementById("playlist");

let playlist = [];
let index = 0;

// Load playlist from JSON (relative to GitHub Pages)
fetch("src/libs/json/playlist.json")
  .then(res => res.json())
  .then(data => {
    playlist = data;
    createThumbnails();
    loadVideo(index);
  })
  .catch(err => console.error("Failed to load playlist:", err));

// Create playlist thumbnails
function createThumbnails() {
  playlist.forEach((v,i)=>{
    const thumb = document.createElement("div");
    thumb.classList.add("thumb");
    thumb.innerHTML = `<img src="src/libs/${v.poster}"><div>${v.title}</div>`;
    thumb.addEventListener("click",()=>{
      index=i;
      loadVideo(index);
      video.play();
      updateActiveThumb();
    });
    playlistDiv.appendChild(thumb);
  });
}

function updateActiveThumb(){
  document.querySelectorAll(".thumb").forEach((el,j)=>{
    el.classList.toggle("active", j===index);
  });
}

// Load video
function loadVideo(i){
  const v = playlist[i];
  titleDiv.textContent = v.title;
  mp4source.src = "src/libs/" + v.mp4;
  oggsource.src = "src/libs/" + v.ogg;
  video.poster = "src/libs/" + v.poster;
  video.load();
  playBtn.textContent = "▶";
  updateActiveThumb();
}

// Play/pause
playBtn.addEventListener("click", ()=>{
  if(video.paused){
    video.play();
    playBtn.textContent = "⏸";
  } else {
    video.pause();
    playBtn.textContent = "▶";
  }
});

// Progress & time
video.addEventListener("timeupdate", ()=>{
  const percent = (video.currentTime/video.duration)*100;
  progress.style.width = percent + "%";
  timeDiv.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
});

// Format MM:SS
function formatTime(sec){
  const m = Math.floor(sec/60);
  const s = Math.floor(sec%60);
  return `${m}:${s<10?"0"+s:s}`;
}

// Click progress
progressContainer.addEventListener("click", e=>{
  const rect = progressContainer.getBoundingClientRect();
  const pos = (e.clientX - rect.left)/rect.width;
  video.currentTime = pos*video.duration;
});

// Volume
volume.addEventListener("input", ()=>{ video.volume = volume.value; });
video.volume = 0.8;
volume.value = 0.8;

// Fullscreen
fullscreenBtn.addEventListener("click", ()=>{
  if(document.fullscreenElement){
    document.exitFullscreen();
  } else {
    document.getElementById("player").requestFullscreen();
  }
});

// Next / Prev
function next(){
  index = (index+1)%playlist.length;
  loadVideo(index);
  video.play();
  playBtn.textContent="⏸";
}
function prev(){
  index = (index-1+playlist.length)%playlist.length;
  loadVideo(index);
  video.play();
  playBtn.textContent="⏸";
}

// Auto-next
video.addEventListener("ended", next);
