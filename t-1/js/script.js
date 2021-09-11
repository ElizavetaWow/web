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