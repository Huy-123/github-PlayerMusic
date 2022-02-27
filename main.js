// 1. Render Songs     v
// 2. Scroll Top       v
// 3. Play/ Pause/ seek
// 4. CD Rolate
// 5. Next/ prev
// 6. Random
// 7. Next/ Repeat when ended
// 8. Active song
// 9. Scroll active  song into view
// 10. Play song when click


// GetElement DOM
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playlist = $('.playlist');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevSong = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Chạy Về Khóc Với Anh",
            singer: "Erik",
            path: "./music/Song 1.mp3",
            image: "./img/Song 1.jpg"
          },
          {
            name: "Ngày Đầu Tiên",
            singer: "Đức Phúc",
            path: "./music/Song 2.mp3",
            image: "./img/Song 2.jpg"
          },
          {
            name: "Uoc Mo Cua Me",
            singer: "Quân AP",
            path: "./music/Song 3.mp3",
            image: "./img/Song 3.jpg"
          },
          {
            name: "Độ Tộc Mixing",
            singer: "Độ Tộc Minxing",
            path: "./music/Song 4.mp3",
            image: "./img/Song 4.png"
          },
          {
            name: "3107",
            singer: "WnDuonggNau",
            path: "./music/Song 5.mp3",
            image: "./img/Song 5.jpg"
          },
          {
            name: "CanGiHon",
            singer: "TienTienJustaTee",
            path: "./music/Song 6.mp3",
            image: "./img/Song 6.jpg"
          },
          {
            name: "HayTraoChoAnh",
            singer: "SonTungMTPSnoopDogg",
            path: "./music/Song 7.mp3",
            image: "./img/Song 7.jpg"
          },
          {
            name: "LoSayByeLaBye",
            singer: "LemeseChangg",
            path: "./music/Song 8.mp3",
            image: "./img/Song 8.jpg"
          },
    ],

    render: function(){
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        })
        playlist.innerHTML = htmls.join('');
    },
    // Định nghĩa 1 current Song
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    // Xử lý phóng to / thu nhỏ CD
    // Handles CD enlargement / reduction
    handleEvent: function(){
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // Xử lý Cd quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        // Xử lý phóng to/ thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
      
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Xử lý khi click Play / Pause
        playBtn.onclick = function () {
            if(_this.isPlaying == true){
                audio.pause();
            }else{ 
                audio.play();
            }
        }       

        // Xử lý Song được play
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // Xử lý khi Song được Pause
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor((audio.currentTime * 100) / audio.duration);
                progress.value = progressPercent;
            }
            
            //  Xử lý khi tua bài hát Song 
            progress.onchange = function(e){
                const seekTime = progress.value * audio.duration / 100 ;
                audio.currentTime = seekTime;
            }

            
        }

        //  Khi next Song
        nextBtn.onclick = function(){
            if(_this.isRandom == true){
                _this.playRandomSong();
            }else{
                _this.nextSong();
            }
            audio.play(); 
            _this.render();
            _this.scrollToActiveSong();
        }

        // Khi prev Song
        prevSong.onclick = function(){
            if(_this.isRandom == true){
                _this.playRandomSong();
            }else{
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Xử lý bật / tắt một bài hát  RANDOM
        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        //  Xử lý khi lặp lại 1 bài hát Songs
        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }
        // Xử lý next song khi audio ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }else{
                nextBtn.click();
            }
        } 

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function (e) {   
            // Xử lý khi click vào Song
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode ||  e.target.closest('.option')
            ){
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                if(e.target.closest('.song:not(.active)')){
    
                }
            }
        }   
    },

    // Load lại bài hát
    loadCurrentSong: function(){
        
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    // Chuyển bài hát tiếp theo
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    // Quay lại bài hát sau 
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    // RANDOM Bật chế độ phát ngẫu nhiên
    playRandomSong: function(){
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while(newIndex === this.currentSong);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    
    // Cuộn khi play bai hat Scroll To Active view
    scrollToActiveSong: function(){
        setTimeout(function(){
            const activeSong = $('.song.active');
            activeSong.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }, 100)
    },


    // START
    start: function(){
        // Định nghĩa các thuộc tính của Object
        this.defineProperties();

        // Lắng nghe xử lý các sự kiện(DOM EVENT)
        this.handleEvent();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        // RENDER PLAYLIST 
        this.render();
    },
}
app.start();