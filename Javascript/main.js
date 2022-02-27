// 1. Render Songs
// 2. Scroll Top
// 3. Play/ Pause/ seek
// 4. CD Rolate
// 5. Next/ prev
// 6. Random
// 7. Next/ Repeat when ended
// 8. Active song
// 9. Scroll active  song into view
// 10. Play song when click


const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const app = {
    songs: [
        {
            name: "Chạy Về Khóc Với Anh",
            singer: "Erik",
            path: "./",
            image: "./img/Song 1.jpg"
          },
          {
            name: "Ngày Đầu Tiên",
            singer: "Đức Phúc",
            path: "./music/Song 2.mp3",
            image: "./img/Song 2.jpg"
          },
          {
            name: "Ngày Của Mẹ",
            singer: "Quân AP",
            path: "./music/Song 3.mp3",
            image: "./img/Song 3.jpg"
          },
          {
            name: "Độ Tộc Mixing",
            singer: "Độ Tộc Minxing",
            path: "./music/Song 4.mp3",
            image: "./img/Song 4.png"
          }
    ],

    render: function(){
        const htmls = this.songs.map(function(song){
            return `
                <div class="song ${
                index === this.currentIndex ? "active" : ""
                }" data-index="${index}">
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
        $('playlist').innerHTML = htmls.join('');
    },
    start: function(){
        this.render();
    },
}
app.start();