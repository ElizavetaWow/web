function createDoc() {
    if (document.getElementById("r1").checked)
        item = document.getElementById("r1").value;
    else if (document.getElementById("r2").checked)
        item = document.getElementById("r2").value;
    else if (document.getElementById("r3").checked)
        item = document.getElementById("r3").value;
    let surname = document.getElementById('surname').value
    let namee = document.getElementById('name').value
    let date = document.getElementById('date').value
    let time = document.getElementById('time').value
    let place = document.getElementById('place').value
    let n = document.getElementById('n').value
    let email = document.getElementById('email').value
    document.getElementById("resultDoc").innerHTML = "Заказ успешно оформлен. Получатель "
        + (surname ? surname : "...") + " " + (namee ? namee : "...")
        + ". Заказ будет доставлен " + (date ? date : "...") + " к " + (time ? time : "...") + " по адресу "
        + (place ? place : "...") + ". Выбранный товар: "
        + item + " в количестве " + n + " штук. Данные о доставке будут продублированны на почту "
        + (email ? email : "...") + ". Спасибо за выбор нашего магазина!";
}

function validate_form() {
    f = document.getElementById('f1');
    let err = "";
    for (var i = 0; i < f.elements.length; i++)
        if (f.elements[i].value == "")
            err += f.elements[i].name + "\n";
    if ("" != err) {
        alert("Пожалуйста, заполните поля:\n" + err);
        return false;
    }
    let err1 = "";
    if ((f.item[0].checked == false) && (f.item[1].checked == false) && (f.item[2].checked == false)) {
        err1 += "Пожалуйста, выберите товар: " + f.item[0].value + ", " + f.item[1].value + " или " + f.item[2].value + "\n";
    }
    let re = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    if ((document.getElementById('email').value != "") && (!re.test(document.getElementById('email').value)))
        err1 += "Пожалуйста, проверьте соответствие почты шаблону mail@mail.ru\n"
    if ("" != err1) {
        alert(err1);
        return false;
    }
    return true;
}

function lsave() {
    if (document.getElementById("r1").checked)
        item = document.getElementById("r1").value;
    else if (document.getElementById("r2").checked)
        item = document.getElementById("r2").value;
    else if (document.getElementById("r3").checked)
        item = document.getElementById("r3").value;
    let surname = document.getElementById('surname').value
    let namee = document.getElementById('name').value
    let date = document.getElementById('date').value
    let time = document.getElementById('time').value
    let place = document.getElementById('place').value
    let n = document.getElementById('n').value
    let email = document.getElementById('email').value

    localStorage.setItem('surname', surname)
    localStorage.setItem('name', namee)
    localStorage.setItem('date', date)
    localStorage.setItem('time', time)
    localStorage.setItem('place', place)
    localStorage.setItem('item', item)
    localStorage.setItem('n', n)
    localStorage.setItem('email', email)
}

function lload() {
    document.getElementById('surname').value = localStorage.getItem('surname')
    document.getElementById('name').value = localStorage.getItem('name')
    document.getElementById('date').value = localStorage.getItem('date')
    document.getElementById('time').value = localStorage.getItem('time')
    document.getElementById('place').value = localStorage.getItem('place')
    document.getElementById('n').value = localStorage.getItem('n')
    document.getElementById('email').value = localStorage.getItem('email')
    if (localStorage.getItem('item') == document.getElementById("r1").value)
        document.getElementById("r1").checked = true;
    else if (localStorage.getItem('item') == document.getElementById("r2").value)
        document.getElementById("r2").checked = true;
    else if (localStorage.getItem('item') == document.getElementById("r3").value)
        document.getElementById("r3").checked = true;
    document.getElementById('nValue').innerHTML = localStorage.getItem('n');

}

function ssave() {
    if (document.getElementById("r1").checked)
        item = document.getElementById("r1").value;
    else if (document.getElementById("r2").checked)
        item = document.getElementById("r2").value;
    else if (document.getElementById("r3").checked)
        item = document.getElementById("r3").value;
    let surname = document.getElementById('surname').value
    let namee = document.getElementById('name').value
    let date = document.getElementById('date').value
    let time = document.getElementById('time').value
    let place = document.getElementById('place').value
    let n = document.getElementById('n').value
    let email = document.getElementById('email').value

    sessionStorage.setItem('surname', surname)
    sessionStorage.setItem('name', namee)
    sessionStorage.setItem('date', date)
    sessionStorage.setItem('time', time)
    sessionStorage.setItem('place', place)
    sessionStorage.setItem('item', item)
    sessionStorage.setItem('n', n)
    sessionStorage.setItem('email', email)
}

function sload() {
    document.getElementById('surname').value = sessionStorage.getItem('surname')
    document.getElementById('name').value = sessionStorage.getItem('name')
    document.getElementById('date').value = sessionStorage.getItem('date')
    document.getElementById('time').value = sessionStorage.getItem('time')
    document.getElementById('place').value = sessionStorage.getItem('place')
    document.getElementById('n').value = sessionStorage.getItem('n')
    document.getElementById('email').value = sessionStorage.getItem('email')
    if (sessionStorage.getItem('item') == document.getElementById("r1").value)
        document.getElementById("r1").checked = true;
    else if (sessionStorage.getItem('item') == document.getElementById("r2").value)
        document.getElementById("r2").checked = true;
    else if (sessionStorage.getItem('item') == document.getElementById("r3").value)
        document.getElementById("r3").checked = true;
    document.getElementById('nValue').innerHTML = sessionStorage.getItem('n');

}