const musicContaier = document.querySelector('.music-container');
const playButton = document.querySelector('#play');
const backButton = document.querySelector('#prev');
const nextButton = document.querySelector('#next');
const audio = document.querySelector('#audio');
const progress = document.querySelector('.progress');
const progressContainer = document.querySelector('.progress-container');
const title = document.querySelector('#title');
const artist = document.querySelector('#artist')
const cover = document.querySelector('#cover');
const duration = document.querySelector('#duration');
const darkmode = document.getElementById('darkmode');
const shuffle = document.getElementById('shuffle')
const siteTitle = document.getElementById('site-title');

const songs = ['KANTE','Maradona','Infinity','FEEL','Bloom','Hari Ukuntu','Switch It Up','Recognize','Soso','VXLENTINE',
'XO','No Wahala','Southy Love','Propeller','Only You', 'Exchange','Been That Way','Your Body','Eko Miami','Back It Up',
'CUFF IT','As Friends','Bandana','Bloody Samaritan','Bounce','Don\'t Rush','Tampa','Calm Down','Rackz got më','Preach',
'P Power','WAIT FOR U','Rush','KU LO SA','MONALISA','Want You','Peru','Soweto','Nzaza','Cold Outside',
'Okay','Pana','It’s Plenty','Sip','Must Be Sprung','Energy','Mad Over You','Might Not','Starboy','Streatham',
'Titanium', 'AG Baby','Vibration','Hold Yuh','Lost In Ya Love','Kontrol','Damages', 'After Hours','The Hills', 
'Touchin Lovin','How It Is','U Wit Me','Strike A Pose','Gyal You A Party Animal','SAD!'];



const artists = ['Davido (FT FAYE)','Niniola','Olamide (FT Omah Lay)','Davido','Aqyila','King James','Pooh Shiesty x G Herbo x No More Heroes', 'PARTYNEXTDOOR (ft Drake)','Omah Lay','Ayo Kuru',
'Jay-O','1da Banton','Peruzzi (ft Fireboy DML)','Dave & BNXN', 'PARTYNEXTDOOR', "Bryson Tiller", 'Bryson Tiller','Basketmouth (ft Buju)', 'Maleek Berry','Ms Banks (ft Geko)',
'Beyonce','Gabzy', 'Fireboy DML (ft Asake)','Ayra Starr','Ruger','Young T & Bugsey (ft Headie One)','Cico P','Rema','Yeat','Drake',
'Gunna (ft Drake)','Future (ft Tems & Drake)','Ayra Starr','Oxlaide','LOJAY X SARZ','Oxlaide','Fireboy DML','Victony','Asake','Timaya (ft Buju)',
'AG Baby','Tekno','Burna Boy','Joeboy','Gabzy','Wizkid (ft Skepta)','Runtown','Belly (ft The Weeknd)','The Weeknd','Dave',
'Dave','Adekunle Gold','Fireboy DMl','Gyptian','Chris Brown','Maleek Berry','TEMS','The Weeknd','The Weeknd',
'Trey Songz (ft. Nicki Minaj)','Young Thug','Drake','Young T & Bugsey (ft Aitch)','Charly Black','XXXTENTACION'];

// keep track of songs 

let songIndex = 0;
let timeElapsed = 0;

// intially load song into DOM 
loadSong(songs[songIndex]);

// update songs details 

function loadSong(song){
    title.innerText = `${song}`;
    let artistOfSong = songs.indexOf(song);
    artist.innerText = `Artist: ${artists[artistOfSong]}`
    audio.src = `/assets/music/${song}.mp3`;
    cover.src = `/assets/images/music/${song}.jpg`;
    
}

// Play Song
function playSong(){
    musicContaier.classList.add('play')
    playButton.querySelector('i.fas').classList.remove('fa-play');
    playButton.querySelector('i.fas').classList.add('fa-pause');
    audio.play()
    
}   

// Pause Song
function pauseSong(){
    musicContaier.classList.remove('play')
    playButton.querySelector('i.fas').classList.add('fa-play');
    playButton.querySelector('i.fas').classList.remove('fa-pause');
    audio.pause();
}

// Previous Song
function backSong(){
    songIndex--
    if(songIndex < 0){
        songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex])
    playSong()
}

// Next Song

function nextSong(){
    // shuffles what song is played next.
    if(shuffle.checked == true){
        songIndex = Math.floor(songs.length * Math.random())
        document.getElementById('toggleShuffle').innerText = 'Shuffle ON';
    }
    else {
        songIndex++
        if(songIndex > songs.length -1){
            songIndex = 0;
            document.getElementById('toggleShuffle').innerText = 'Shuffle OFF';
        }
    }
    loadSong(songs[songIndex])
    playSong()
}

// Update Progress Bar
function updateProgress(e){
    const {duration, currentTime} = e.srcElement;
    const progressPercent = (currentTime/duration) * 100;
    progress.style.width = `${progressPercent}%`
    
}

// Set the Progress bar to whatever the current time is
function setProgress(e){
    const width = this.clientWidth
    const clickX = e.offsetX
    const duration = audio.duration
    audio.currentTime = (clickX / width) * duration;
}

// EVENT LISTENERS

// Handle the play Button
playButton.addEventListener('click', () => {
    const isPlaying = musicContaier.classList.contains('play');
    if(isPlaying){
        pauseSong();
    } else {
        playSong();
    }
})

// Changing Songs
backButton.addEventListener('click', backSong)
nextButton.addEventListener('click', nextSong)

// Updating the Progress Bar
audio.addEventListener('timeupdate',updateProgress)
progressContainer.addEventListener('click', setProgress)

// autoplay the next song after current one ends
audio.addEventListener('ended' ,nextSong)

audio.addEventListener('timeupdate', (event) => {
    const currentTime = Math.floor(audio.currentTime);
    const duration = Math.floor(audio.duration);
    duration.innerText = `${currentTime}`
    //console.log(currentTime + "/" + duration/60)
}, true);

// handle Volume, add volume button on the next update
//implement on next update


// handle dark mode and shuffle
function handleDarkMode(){
    if(darkmode.checked == true){
    siteTitle.style.color = 'white';
    document.getElementById('body').style.backgroundColor = 'black'
    document.getElementById('musicContainer').style.backgroundColor = 'grey'
    title.style.color = 'white'
    artist.style.color = 'white'
    document.getElementById('musicInfo').style.backgroundColor = 'transparent'
    document.getElementById('toggleMessage').innerText = 'Turn Dark Mode OFF';
    document.getElementById('toggleMessage').style.color = 'grey'
    document.getElementById('madeby').style.color = 'grey'
    document.getElementById('toggleShuffle').style.color = 'grey'
   

// song Titles
    } else {
    siteTitle.style.color = 'black';
    document.getElementById('body').style.backgroundColor = 'white'
    document.getElementById('musicContainer').style.backgroundColor = 'white'
    title.style.color = 'black'
    artist.style.color = 'black'
    document.getElementById('musicInfo').style.backgroundColor = 'transparent'
    document.getElementById('toggleMessage').innerText = 'Turn Dark Mode ON';
    
}
}

