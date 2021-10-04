var table = $("#resTbl").DataTable({ "ordering": false, "searching": false });

resTbl.addEventListener('click', e => {
    let cell = e.target;
    if ((cell.tagName.toLowerCase() != 'td') || (cell.children.length > 0)) { return false; }
    if (table.row(0).data().length == 1) { return false; }
    let val = cell.innerHTML;
    cell.innerHTML = '<input type="text" id="edit_cell">';
    $('#edit_cell').focus();
    cell.children[0].value = val
    $('#edit_cell').blur(function () {
        if (checkFormat(this)) {
            table.cell(this.parentElement.parentElement.rowIndex - 1, this.parentElement.cellIndex).data(this.value).draw();
        }
        else {
            table.cell(this.parentElement.parentElement.rowIndex - 1, this.parentElement.cellIndex).data(val).draw();
        }
    });
    $(window).keydown(function (e) {
        if (e.keyCode == 13) {
            $('#edit_cell').blur();
        }
    });
});

function checkFormat(el) {
    let table = document.getElementById('resTbl')
    if (el.value != "") {
        let column = table.rows[0].cells[el.parentElement.cellIndex].innerHTML
        if (column == "Время доставки") { return checkTime(el.value) }
        if (column == "Дата доставки") { return checkDate(el.value) }
        if (column == "Email") { return checkEmail(el.value) }
        if (column == "Товар") { return checkItem(el.value) }
        if (column == "Колво") { return checkN(el.value) }
        return true;
    }
    return false;

}

function checkTime(val) {
    let re = /^(([0,1][0-9])|(2[0-3])):[0-5][0-9]$/;
    if (re.test(val)) { return true; }
}

function checkDate(val) {
    let re = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.20\d\d$/;
    if (re.test(val)) { return true; }
}

function checkEmail(val) {
    let re = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    if (re.test(val)) { return true; }
}

function checkItem(val) {
    lst = []
    for (let i = 0; i < document.getElementsByName("item").length; i++)
        lst.push(document.getElementsByName("item")[i].value)
    if (lst.includes(val)) { return true; }
}
function checkN(val) {
    if ((Number.parseInt(val) <= document.getElementById('n').max) && (Number.parseInt(val) >= document.getElementById('n').min)) { return true; }
}

function addRow1() {
    let vals = []
    let table = document.getElementById('resTbl')
    let r = table.rows.length;
    let c = table.rows[0].cells.length;
    if (document.getElementById("r1").checked)
        item = document.getElementById("r1").value;
    else if (document.getElementById("r2").checked)
        item = document.getElementById("r2").value;
    else if (document.getElementById("r3").checked)
        item = document.getElementById("r3").value;
    vals.push(document.getElementById('surname').value)
    vals.push(document.getElementById('name').value)
    vals.push(document.getElementById('email').value)
    date = document.getElementById('date').value
    vals.push(date.slice(8) + "." + date.slice(5, 7) + "." + date.slice(0, 4))
    vals.push(document.getElementById('time').value)
    vals.push(item)
    vals.push(document.getElementById('n').value)
    vals.push("<button class='delbtn' onclick='this.closest(" + '"tr"' + ").remove()'></button>")
    let row = table.insertRow();
    for (let j = 0; j < c; j++) {
        let cell = row.insertCell(j);
        cell.innerHTML = vals[j];
    }
}

function addRow() {
    var t = $('#resTbl').DataTable();
    let vals = []
    if (document.getElementById("r1").checked)
        item = document.getElementById("r1").value;
    else if (document.getElementById("r2").checked)
        item = document.getElementById("r2").value;
    else if (document.getElementById("r3").checked)
        item = document.getElementById("r3").value;
    vals.push(document.getElementById('surname').value)
    vals.push(document.getElementById('name').value)
    vals.push(document.getElementById('email').value)
    date = document.getElementById('date').value
    vals.push(date.slice(8) + "." + date.slice(5, 7) + "." + date.slice(0, 4))
    vals.push(document.getElementById('time').value)
    vals.push(item)
    vals.push(document.getElementById('n').value)
    let c = "$('#resTbl').DataTable().row(this.parentElement.parentElement.rowIndex-1).remove().draw(false)"
    vals.push("<button class='delbtn' onclick=" + c + "></button>")
    t.row.add(vals).draw(false);
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
    if (!checkEmail(document.getElementById('email').value))
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
    let n = document.getElementById('n').value
    let email = document.getElementById('email').value
    localStorage.setItem('surname', surname)
    localStorage.setItem('name', namee)
    localStorage.setItem('date', date)
    localStorage.setItem('time', time)
    localStorage.setItem('item', item)
    localStorage.setItem('n', n)
    localStorage.setItem('email', email)
    alert('Данные сохранены')
}

function lload() {
    document.getElementById('surname').value = localStorage.getItem('surname')
    document.getElementById('name').value = localStorage.getItem('name')
    document.getElementById('date').value = localStorage.getItem('date')
    document.getElementById('time').value = localStorage.getItem('time')
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

function tableToJson() {
    let table = document.getElementById('resTbl')
    let headers = [];
    for (let i = 0; i < table.rows[0].cells.length - 1; i++) {
        headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi, '_');
    }
    let data = [];
    for (let i = 1; i < table.rows.length; i++) {
        let line = {};
        for (let j = 0; j < table.rows[i].cells.length - 1; j++) {
            line[headers[j]] = table.rows[i].cells[j].innerHTML;
        }
        data.push(line);
    }
    alert(JSON.stringify(data));

}