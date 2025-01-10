/* elementlere ulasip obje olarak kullanma, yakalama*/
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const repeatButton = document.getElementById("repeat");
const shuffleButton = document.getElementById("shuffle");
const audio = document.getElementById("audio");
const songImage = document.getElementById("song-image");
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");
const pauseButton = document.getElementById("pause");
const playButton = document.getElementById("play");
const playListButton = document.getElementById("playlist");

const maxDuration = document.getElementById("max-duration");
const currentTimeRef = document.getElementById("current-time");

const progressBar = document.getElementById("progress-bar");
const playListContainer = document.getElementById("playlist-container");
const closeButton = document.getElementById("close-button");
const playListSongs = document.getElementById("playlist-songs");

const currentProgress = document.getElementById("current-progress");

// Sırası
let index;

//Döngü
let loop = true;

//Şarkı Listesi

const songList = [
  {
    name: "Gelo Ew Ki Bu",
    link: "assets/assets_gelo-ew-ki-bu.mp3",
    artist: "Aram Tigran",
    image: "assets/aram-tigran.jpeg",
  },
  {
    name: "Gitme Kal",
    link: "assets/assets_yara-bere-icindeyim.mp3",
    artist: "Hira-i Zerdust",
    image: "assets/hirai.jpeg",
  },
  {
    name: "Aramam",
    link: "assets/assets_aramam.mp3",
    artist: "İbrahim Tatlıses",
    image: "assets/ibrahim-tatlises.jpeg",
  },
  {
    name: "Ax Eman",
    link: "assets/assets_ax-eman.mp3",
    artist: "Rewsan Celiker",
    image: "assets/rewsan-celiker.jpeg",
  },
  {
    name: "Dinle",
    link: "assets/assets_dinle.mp3",
    artist: "Mahsun Kırmızıgül",
    image: "assets/mahsun.jpeg",
  },
];

// Şarkı Atama

const setSong = (arrayIndex) => {
  let { name, link, artist, image } = songList[arrayIndex];
  audio.src = link;
  songName.innerHTML = name;
  songArtist.innerHTML = artist;
  songImage.src = image;

  // Zamanı Ayarlama
  audio.onloadedmetadata = () => {
    maxDuration.innerText = timeFormatter(audio.duration);
  };
  // Şarkı Listesini Gizle
  playListContainer.classList("hide");
  //şarkıyı oynat
  playAudio();
};

//Şarkıyı Çal

const playAudio = () => {
  audio.play();
  pauseButton.classList.remove("hide"); // Görüün
  playButton.classList.add("hide"); // Kaybol
};
// Şarkı kendiliğinden bittiğinde bir sonrakine geç
audio.onended = () => {
  nextSong();
};
// şarkıyı durdur
const pauseAudio = () => {
  audio.pause();
  pauseButton.classList.add("hide");
  playButton.classList.remove("hide");
};
//Sonraki şarkıya geç

const nextSong = () => {
  if (loop) {
    if (index === songList.length - 1) {
      index = 0;
    } else {
      index += 1;
    }
    setSong(index);
  } else {
    let randIndex = Math.floor(Math.random() * songList.length);
    setSong(randIndex);
  }
  playAudio();
};

// Önceki şarkıya gel

const previousSong = () => {
  pauseAudio();
  if (index > 0) {
    index -= 1;
  } else {
    index = songList.length - 1;
  }
  setSong(index);
  playAudio();
};

// zaman Düzenleyici

const timeFormatter = (timeInput) => {
  let minute = Math.floor(timeInput / 60);
  minute = minute < 10 ? "0" + minute : minute;
  let second = Math.floor(timeInput % 60);
  second = second < 10 ? "0" + second : second;
  return `${minute}:${second}`;
};

// tekrar Açma Kapama
repeatButton.addEventListener("click", () => {
  if (repeatButton.classList.contains("active")) {
    repeatButton.classList.remove("active");
    audio.loop = false;
  } else {
    repeatButton.classList.add("active");
    audio.loop = true;
  }
});

// Karıştırıcı tıklandığında

shuffleButton.addEventListener("click", () => {
  if (shuffleButton.classList.contains("active")) {
    shuffleButton.classList.remove("active");
    audio.loop = true;
  } else {
    shuffleButton.classList.add("active");
    audio.loop = false;
  }
});

// Anlık Zamanı Yakala
setInterval(() => {
  currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
  //Progressi ilerlet
  currentProgress.style.width = audio.currentTime / audio.duration.toFixed(3);
}, 1000);

// Liste ekranını getir

playListButton.addEventListener("click", () => {
  playListContainer.classList.remove("hide");
});

// Liste ekranını kapat

closeButton.addEventListener("click", () => {
  playListContainer.classList.add("hide");
});

// Liste Oluşturma

const initializePlaylist = () => {
  for (let i in songList) {
    playListSongs.innerHTML += `<li class="playlistSong" onclick="setSong(${i})">
        <div class="playlist-image-container">
        <img src="${songList[i].image}"/></div>
        <div class="playlist-song-details">
        <span id="playlist-song-name">${songList[i].name}</span>
        <span id="playlist-song-artist-album">
        ${songList[i].artist}</span>
        </div>
        </li>`;
  }
};

// progress bar ayarlama

progressBar.addEventListener("click", (event) => {
  let coorStart = progressBar.getBoundingClientRect().left;

  let coorEnd = event.clientX;
  let progress = (coorEnd - coorStart) / progressBar.offsetWidth;
  currentProgress.style.width = progress * 100 + "%";
  audio.currentTime = progress * audio.duration;
  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
});

// zamanı Ayarla
audio.addEventListener("timeupdate", () => {
  currentTimeRef.innerText = timeFormatter(audio.currentTime);
});

//siradaki butona tiklanildiginda
nextButton.addEventListener("click", nextSong);

//durdur butonuna tiklanildiginda
pauseButton.addEventListener("click", pauseAudio);

//oynat butonuna tiklanildiginda
playButton.addEventListener("click", playAudio);

//geri tusuna tiklanildiginda
prevButton.addEventListener("click", previousSong);

// ekran Yükleme

window.onload = () => {
  initializePlaylist();
  index = 0;
  setSong(index);
  pauseAudio();
};
