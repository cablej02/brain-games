//GLOBAL STATICS
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const Color = {
    GREEN: 'green',
    YELLOW: 'yellow',
    GREY: 'grey',
    TRANSPARENT: 'transparent'
}

//Iinitialize Bootstrap tooltips
const tooltipTriggerList = [...document.querySelectorAll('[data-bs-toggle="tooltip"]')];
const tooltipList = tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));


//Home page zoom out
const heroImage = document.querySelector('.hero-image');
document.addEventListener('scroll', function () {
    const scrollPosition = window.pageYOffset;
    console.log(scrollPosition);
    heroImage.style.transform = `scale(${1 + scrollPosition / 1000})`;
});


// ! Use the following function whenever you need to redirect to a different page
let redirectURL = '';

const redirectPage = function (url) {
    redirectURL = url;
    location.assign(url);
};