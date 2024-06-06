const items = document.querySelectorAll('.img-item');
// console.log(items);
for (let i = 0; i < items.length; i++) {
    const keyframes = {
    // opacity: [0, 1],
    // rotate: ['x 90deg', 0],
    // translate: ['0 50px', 0],
    // rotate: ['5deg', 0],
    // scale: [1.1, 1],
    filter: ['blur(20px)', 'blur(0)'],
};
const options = {
    duration: 600,
    delay: i * 300,
    fill: 'forwards',
};
items[i].animate(keyframes, options);
}