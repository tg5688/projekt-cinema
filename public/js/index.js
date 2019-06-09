//karuzela w oknie głównym
$('.carousel').carousel({
    interval: 6000,
    pause: 'hover'
});

//wybór krzesła
let numItems = 0;
let price = "0.00";
$('.seat').click(function () {
    $(this).toggleClass("select")
    numItems = $('.select').length
    $(".count-seats").text(numItems);
    price = 25.99;
    price *= numItems;
    $(".count-price").text(price);
    $("input[name=price]").val(price);
    $("input[name=count]").val(numItems);
});
$(".count-price").text(price);
$(".count-seats").text(numItems);


//walidacja formularza
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validatePassword(password) {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    return re.test(password);
}
var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");


function validate() {

    function reset() {
        email.value = '';
        password.value = '';
    }

    const email = document.querySelector('#email');
    const password = document.querySelector('#password');

    const resultsInput = document.querySelectorAll('.error');

    let isError = 0;

    if (!validateEmail(email.value)) {
        resultsInput[0].textContent = 'Wpisano niepoprawny email';
        email.classList.add('invalid');
        isError = 1;
    } else {
        resultsInput[0].textContent = '';
        email.classList.remove('invalid');
    }

    if (!validatePassword(password.value)) {
        resultsInput[1].textContent = 'Hasło musi zawierać min. 8 znaków, min. jedną dużą literę, cyfrę i znak specjalny';
        password.classList.add('invalid');
        isError = 1;
    } else {
        resultsInput[1].textContent = '';
        password.classList.remove('invalid');
    }

    if (isError == 0) {
        alert("Wysłano dane z formularza");
        return true;
    } else {
        return false;
    }
}