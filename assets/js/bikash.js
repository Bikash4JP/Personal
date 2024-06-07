
// smooth scroll
$(document).ready(function(){
    $(".navbar .nav-link").on('click', function(event) {

        if (this.hash !== "") {

            event.preventDefault();

            var hash = this.hash;

            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 700, function(){
                window.location.hash = hash;
            });
        } 
    });
}); 

// protfolio filters
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var form = this;
    var data = new FormData(form);

    fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            alert('Your message has been sent successfully!');
            form.reset();
        } else {
            return response.json().then(data => {
                if (Object.hasOwnProperty.call(data, 'errors')) {
                    alert(data["errors"].map(error => error["message"]).join(", "));
                } else {
                    alert('Oops! There was a problem submitting your form');
                }
            })
        }
    }).catch(error => {
        alert('Oops! There was a problem submitting your form');
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const maxWords = 150;

    document.querySelectorAll(".blog-card .blog-content").forEach(content => {
        const fullText = content.getAttribute("data-full-text");
        const words = fullText.split(" ");
        const truncatedText = words.slice(0, maxWords).join(" ") + '...';

        if (words.length > maxWords) {
            content.innerText = truncatedText;
        }

        const readMoreLink = content.nextElementSibling;
        readMoreLink.addEventListener("click", function (event) {
            event.preventDefault();
            if (readMoreLink.innerText.includes("Read more")) {
                content.innerText = fullText;
                readMoreLink.innerHTML = 'Read less <i class="ti-angle-double-right"></i>';
            } else {
                content.innerText = truncatedText;
                readMoreLink.innerHTML = 'Read more <i class="ti-angle-double-right"></i>';
            }
        });
    });
});