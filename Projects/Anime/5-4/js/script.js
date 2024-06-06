const heading = document.querySelector('#heading');
const keyframes = {
    color: ['transparent', '#fff'],
    backgroundPosition: ['100% 0', '0 0'],
};
const options = {
    duration: 1000,
    easing: "ease",
};
heading.animate(keyframes, options);

