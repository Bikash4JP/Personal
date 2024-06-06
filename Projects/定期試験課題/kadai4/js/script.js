// ●●●を適切に書き換えてプログラムを完成させなさい

// 課題４　アニメーション
const p4 = document.querySelector('#p4');
const btn4 = document.querySelector('#btn4');

const keyframes = {
	●●●: ['100%', '200%'],			// 文字の大きさ
	color: ['blue', 'magenta'],
};
const options = {
	●●●: 3000,			// アニメーションの再生時間
	●●●: 'alternate',	// アニメーションの方向
	iterations: ●●●,	// アニメーションの繰り返し
};
const startAnime = () => {
	p4.●●●(keyframes, options);
}

btn4.addEventListener('click', startAnime);
