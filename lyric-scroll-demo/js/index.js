/**
 * 1. 解析歌词字符串
 * 2. [{time: 开始时间, words: }, ]
 * @param
 * @returns
 */
function parseLrc() {
    let lyrics = [];
    let lines = lrc.split('\n');
    for (let i = 0; i < lines.length; i++) {
        let [time, word] = lines[i].split(']')
        time = time.slice(1);
        let [minutes, sec] = time.split(':');
        time = +minutes * 60 + +sec;
        lyrics.push({ time, word });


    }
    return lyrics
}
// 获取数组对象
const lrcData = parseLrc();

/**
 * 对象元素
 */
const doms = {
    container: this.document.querySelector('.container'),
    audio: this.document.querySelector('audio'),
    ul: this.document.querySelector('.container ul')
}

/**
 * 获取高亮下标索引
 */
let findIndex = () => {
    let currentTime = doms.audio.currentTime;
    console.log(currentTime)
    for (let index = 0; index < lrcData.length; index++) {
        if (currentTime < lrcData[index].time) {
            return index - 1;
        }
    }
    return lrcData.length - 1
}
console.log(findIndex());

/**
 * 创建歌词元素 li
 */
function creatLrcElements() {
    const frag = document.createDocumentFragment() // 文档片段
    for (let i = 0; i < lrcData.length; i++) {
        let li = document.createElement('li');
        li.textContent = lrcData[i].word;
        frag.appendChild(li); 
    }
    doms.ul.appendChild(frag);  // 只改变一次dom树
}
creatLrcElements();



const containerHeight = doms.container.clientHeight;
const liHeight = doms.ul.children[0].clientHeight;
const maxOffset = doms.ul.clientHeight - containerHeight;

/**
 * ul偏移量 
 */
function setOffset() {
    let index = findIndex();
    let offset = liHeight * index + liHeight / 2 - containerHeight / 2;

    // 边界值处理
    offset = offset < 0 ? 0 : offset;
    offset = offset > maxOffset ? maxOffset : offset;

    doms.ul.style.transform = `translateY(-${offset}px)`;

    let romveStyleLi = doms.ul.querySelector('.active');
    if (romveStyleLi) {
        romveStyleLi.classList.remove('active')
    }
    let li = doms.ul.children[index];
    if (li) {
        li.classList.add('active');
    }
}

doms.audio.addEventListener('timeupdate', setOffset);


setOffset();


