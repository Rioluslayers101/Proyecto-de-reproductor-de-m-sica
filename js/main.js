let list_songs = document.getElementById("list-song-container");
let cover_image = document.getElementById("cover-image");
let title_song = document.getElementById("title-song");
let artist_song = document.getElementById("artist-song");
let audio = document.getElementById("audio-playing");
let progress_bar = document.getElementById("progress-bar");
let songLength = document.getElementById("SongLength");
let currentTime = document.getElementById("CurrentSongTime")
const volumen = document.querySelector('.volumen')

let song_selected = {};
let is_playing = false;
let canciones = [
  {
    id: 1,
    caratula: "caratulas/if.jpg",
    cancion: "canciones/R5 - If.mp3",
    artista: "R5",
    titulo: "IF",
  },
  {
    id: 2,
    caratula: "caratulas/mama.jpg",
    cancion: "canciones/Jonas Blue - Mama.mp3",
    artista: "Jonas Blue",
    titulo: "Mama",
  },
  {
    id: 3,
    caratula: "caratulas/calvin-harris_blame.jpg",
    cancion: "canciones/Calvin Harris - Blame (feat. John Newman).mp3",
    artista: "Calvin Harris",
    titulo: "Blame",
  },
  {
    id: 4,
    caratula:"caratulas/without me.jpg",
    cancion: "canciones/Halsey - Without Me.mp3",
    artista: "Halsey",
    titulo:  "Without Me",
  },
  
  {
    id: 5,
    caratula: "caratulas/kungs.jpg",
    cancion: "canciones/Kungs - This Girl (Kungs Vs. Cookin' On 3 Burners).mp3",
    artista: "Kungs",
    titulo: "This Girl",
  },

  {
    id: 6,
    caratula: "caratulas/perfect.jpg",
    cancion: "canciones/Jonas Blue - Perfect Strangers.mp3",
    artista: "Jonas Blue",
    titulo: "Perfect Strangers",
  },

  {
    id: 7,
    caratula: "caratulas/onthelose.jpg",
    cancion: "canciones/Niall Horan - On The Loose.mp3",
    artista: "Naill Horan",
    titulo: "On The Loose",
  },
  {
    id: 8,
    caratula: "caratulas/glad.jpg",
    cancion: "canciones/The Wanted - Glad You Came.mp3",
    artista: "The Wanted",
    titulo: "Glad You Came",
  },
  

];

const calculateTime = (secs) =>{
  const minutes = Math.floor(secs /60 )
  seconds = Math.floor(secs % 60)
  returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}` ;
  return `${minutes} : ${returnedSeconds}`;
}
const displayDuration = () =>{
  songLength.innerHTML = calculateTime(audio.duration);
}

if(audio.readyState >0){
  displayDuration();
  currentTime.innerHTML = calculateTime(audio.currentTime);
} else{
  audio.addEventListener('loadedmetadata' , () =>{
    displayDuration();
  } )
}

volumen.addEventListener('click', function(){
  let vol = this.value
  audio.volume = vol
})


audio.ontimeupdate = function (){
  currentTime.innerHTML = calculateTime(audio.currentTime);
  setProgress();
}
function setProgress(){
  let percentage = (audio.currentTime / audio.duration) * 100;
  document.querySelector('.progress').style.width = percentage + '%' ;
}

const BuildList = (canciones) => {
  list_songs.innerHTML = "";
  canciones.forEach((e) => {
    list_songs.insertAdjacentHTML(
      "beforeend",
      `
       <article class="list-item" id="item-${e.id}">
          <img src="${e.caratula}" alt="" />
          <div class="data-song-container">
            <h2>${e.titulo}</h2>
            <div class="artist-name">${e.artista}</div>
          </div>
        </article>
    `
    );
  });
};

const select_song = (id) => {
  let res = canciones.find((e) => e.id == id);
  if (res) {
    cover_image.src = res.caratula;
    title_song.innerHTML = res.titulo;
    artist_song.innerHTML = res.artista;
    audio.src = res.cancion;
    play_song();
  }
};

const pause_effects = () => {
  play_btn.innerHTML = "Play";
  cover_image.style.animationPlayState = "paused";
};

const play_effects = () => {
  play_btn.innerHTML = "Pausa";
  cover_image.style.animationPlayState = "running";
};

const play_song = () => {
  progress_bar.value = audio.currentTime;
  window.setTimeout(() => {
    progress_bar.max = audio.duration;
  }, 500);
  audio.play();
  play_effects();
};

let id_aux = 1;

const next_song = () => {
  if (id_aux < canciones.length) {
    select_song(++id_aux);
  }
};
const prev_song = () => {
  if (id_aux > 0) {
    select_song(--id_aux);
  }
};
const first_song = () => {
  cover_image.src = canciones[0].caratula;
  title_song.innerHTML = canciones[0].titulo;
  artist_song.innerHTML = canciones[0].artista;
  audio.src = canciones[0].cancion;
};

/*EVENTOS */
let play_btn = document.getElementById("play-btn");
let next_btn = document.getElementById("next-btn");
let prev_btn = document.getElementById("prev-btn");

play_btn.addEventListener("click", () => {
  if (is_playing) {
    audio.pause();
    pause_effects();
    is_playing = false;
  } else {
    audio.play();
    play_effects();
    is_playing = true;
  }
});

window.addEventListener("load", () => {
  first_song();
  progress_bar.value = 0;

  window.setTimeout(() => {
    progress_bar.max = audio.duration;
  }, 500);

  window.setInterval(() => {
    progress_bar.value = audio.currentTime;
  }, 1000);
  progress_bar.addEventListener("change", () => {
    audio.currentTime = progress_bar.value;
  });

  next_btn.addEventListener("click", () => {
    next_song();
  });
  prev_btn.addEventListener("click", () => {
    prev_song();
  });
  list_songs.addEventListener("click", (event) => {
    if (event.target.matches("img")) {
      select_song(event.target.parentElement.id.slice(5, 6));
    } else if (event.target.matches(".data-song-container")) {
      console.log(event.target.parentElement.id.slice(5, 6));
    } else if (event.target.matches(".artist-name")) {
      select_song(event.target.parentElement.parentElement.id.slice(5, 6));
    } else if (event.target.matches("h2")) {
      select_song(event.target.parentElement.parentElement.id.slice(5, 6));
    } else if (event.target.matches(".list-item")) {
      select_song(event.target.id.slice(5, 6));
    }
  });

  audio.addEventListener("ended", () => {
    next_song();
  });
});

BuildList(canciones);

/* */

let buscar = document.getElementById("buscar");

buscar.addEventListener("keyup", () => {
  let res = canciones.filter((e) =>
    e.titulo.toLowerCase().includes(buscar.value.toLowerCase())
  );
  if (res) {
    BuildList(res);
  }
});