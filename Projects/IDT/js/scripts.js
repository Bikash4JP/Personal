document.addEventListener('DOMContentLoaded', function() {
    const bars = document.querySelectorAll('.jlpt-bar');
    bars.forEach((bar, index) => {
      bar.style.setProperty('--jlpt-final-height', bar.style.height);
      bar.style.setProperty('--jlpt-order', index);
    });
  });