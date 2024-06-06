const btn = document.querySelector('#btn');
const path = 'file:///C:/temp/ex02/';

btn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');

    // もし(「Dark」ボタンになっているなら){
    if(btn.src === (path + 'images/btn_dark.png')){
        // ボタンのパス = 「btn_light.png」に変更;
        btn.src = path + 'images/btn_light.png';
    // }そうでないなら{
    } else {
        // ボタンのパス = 「btn_dark.png」に変更;
        btn.src = path + 'images/btn_dark.png';
    }
});
