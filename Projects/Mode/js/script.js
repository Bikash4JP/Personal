const btn = document.querySelector('#btn');
btn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    // もし (ボタンのテキストが 「ダークモードにする」 になっている) {
    if(btn.textContent === 'ダークモードにする'){
        // ボタンのテキストを 「ライトモードにする」 に変更
        btn.textContent = 'ライトモードにする';
        // } そうでないなら(「ライトモードにする」 と表示されているなら){
    }else{
    // ボタンのテキストを 「ダーク モードにする」に変更;
    btn.textContent = 'ダークモードにする';
    }
}); 