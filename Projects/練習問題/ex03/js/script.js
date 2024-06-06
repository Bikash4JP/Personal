const unsei = document.querySelector('#unsei');
const btn = document.querySelector('#btn');

const kuji = ['大吉','中吉','小吉','凶'];

const omikuji = () =>{
    const index = Math.floor(Math.random() * kuji.length);

    if(kuji[index] === '大吉'){
        unsei.classList.add('daikiti');
        unsei.classList.remove('kyo');
    }else if(kuji[index] === '凶'){
        unsei.classList.add('kyo');
        unsei.classList.remove('daikiti');
    }else{
        unsei.classList.remove('daikiti');
        unsei.classList.remove('kyo');
    }
    unsei.textContent = kuji[index];   
}

btn.addEventListener('click', omikuji);
