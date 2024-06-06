// 確率違うバージョン
const unsei = document.querySelector('#unsei');
const btn = document.querySelector('#btn');

const omikuji = () =>{
    const rnd = Math.random();
    console.log(rnd);

    if(rnd > 0.95){ // 5%
        unsei.textContent = '大吉';
        unsei.classList.add('daikiti');
        unsei.classList.remove('kyo');
    }else if(rnd > 0.8){    // 15%
        unsei.textContent = '中吉';
        unsei.classList.remove('daikiti');
        unsei.classList.remove('kyo');
    }else if(rnd > 0.5){    // 30%
        unsei.textContent = '小吉';
        unsei.classList.remove('daikiti');
        unsei.classList.remove('kyo');
    }else{  // 50%
        unsei.textContent = '凶';
        unsei.classList.add('kyo');
        unsei.classList.remove('daikiti');
    }
}

btn.addEventListener('click', omikuji);
