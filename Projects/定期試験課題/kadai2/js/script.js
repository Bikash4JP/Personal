// ●●●を適切に書き換えてプログラムを完成させなさい

// 課題２　CSSの書き換え
const p2 = document.querySelector('#p2');
const ckB = document.querySelector('#ckB');
const ckI = document.querySelector('#ckI');
const btn2 = document.querySelector('#btn2');

const changeStyle = () => {
	if(ckB.checked){
		p2.classList.●●●('bold');
	}else{
		p2.classList.●●●('bold');
	}
	if(ckI.checked){
		p2.classList.●●●('italic');
	}else{
		p2.classList.●●●('italic');
	}
}

btn2.●●●('click', changeStyle);
