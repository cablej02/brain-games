var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

























// ! Use the following function whenever you need to redirect to a different page
let redirectURL = '';

const redirectPage = function (url) {
  redirectURL = url;
  location.assign(url);
};