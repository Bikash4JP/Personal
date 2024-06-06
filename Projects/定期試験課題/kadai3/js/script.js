// ●●●を適切に書き換えてプログラムを完成させなさい

// 課題３　ランダムでじゃんけん
const p3 = document.querySelector('#p3');
const btn3 = document.querySelector('#btn3');

const jkp = () => {
	const hand = ['gu.png', 'choki.png', 'pa.png'];
	const rnd = hand[Math.floor(●●● * 3)];
	p3.textContent = '';
	p3.●●●('beforeend', `<img src="images/●●●">`);
}

btn3.addEventListener('click', jkp);
