/*jshint esversion: 6 */

const loginForm = document.getElementById("loginform");
loginForm.addEventListener('submit', (form) => {
    form.preventDefault();
    let screenname = loginForm.childNodes[1].value;
    if (screenname[0] == '@') {
        screenname = screenname.split('@')[1];
    }
    if (screenname.length > 0) {
        sessionStorage.setItem('user', screenname);
        window.location.replace("../../index.html");
    }
}, false);

