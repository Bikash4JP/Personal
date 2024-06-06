const bg = document.querySelector('#bg');
const fg = document.querySelector('#fg');

// 背景色を設定
const changeBg = () => {
    document.body.style.backgroundColor = bg.value;
}

// 文字色を設定
const changeFg = () => {
    // document.querySelector('#headline').style.color = fg.value;
    document.body.style.color = fg.value;
}

// イベントの追加
bg.addEventListener('input', changeBg);
fg.addEventListener('input', changeFg);
