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

// ! Use the following function whenever you need to redirect to a different page
let redirectURL = '';

const redirectPage = function (url) {
    redirectURL = url;
    location.assign(url);
};