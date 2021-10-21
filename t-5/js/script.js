var table = $("#resTbl").DataTable({ "ordering": false, "searching": false });

$(document).ready(function () {
    fromServer()
}
);

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
        toServer();
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
    for (let i = 0; i < $("[name='item']").length; i++)
        lst.push($("[name='item']").toArray()[i].value)
    if (lst.includes(val)) { return true; }
}
function checkN(val) {
    if ((Number.parseInt(val) <= document.getElementById('n').max) && (Number.parseInt(val) >= document.getElementById('n').min)) { return true; }
}


function addRow() {
    let vals = []
    if ($('#r1')[0].checked)
        item = $('#r1').val();
    else if ($('#r2')[0].checked)
        item = $('#r2').val();
    else if ($('#r3')[0].checked)
        item = $('#r3').val();
    vals.push($('#surname').val())
    vals.push($('#name').val())
    vals.push($('#email').val())
    vals.push(formate_date($('#date').val()))
    vals.push($('#time').val())
    vals.push(item)
    vals.push($('#n').val())
    vals.push("<button class='delbtn' onclick='delRow(this)'></button>")
    table.row.add(vals).draw(false);
    toServer();
}

function formate_date(date){
    return date.slice(8) + "." + date.slice(5, 7) + "." + date.slice(0, 4)
}

function unformate_date(date){
    return date.slice(6) + "/" + date.slice(3, 5) + "/" + date.slice(0, 2)
}

function delRow(el) {
    $('#resTbl').DataTable().row(el.parentElement.parentElement.rowIndex - 1).remove().draw(false);
    toServer();
}

function validate_form() {
    f = $('#f1')[0];
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
    if ($('#r1')[0].checked)
        item = $('#r1').val();
    else if ($('#r2')[0].checked)
        item = $('#r2').val();
    else if ($('#r3')[0].checked)
        item = $('#r3').val();
    localStorage.setItem('surname', $('#surname').val())
    localStorage.setItem('name', $('#name').val())
    localStorage.setItem('date', $('#date').val())
    localStorage.setItem('time', $('#time').val())
    localStorage.setItem('item', item)
    localStorage.setItem('n', $('#n').val())
    localStorage.setItem('email', $('#email').val())
    alert('Данные сохранены')
}

function lload() {
    $('#surname').val(localStorage.getItem('surname'))
    $('#name').val(localStorage.getItem('name'))
    $('#date').val(localStorage.getItem('date'))
    $('#time').val(localStorage.getItem('time'))
    $('#n').val(localStorage.getItem('n'))
    $('#email').val(localStorage.getItem('email'))

    if (localStorage.getItem('item') == $('#r1').val())
        $('#r1')[0].checked = true;
    else if (localStorage.getItem('item') == $('#r2').val())
        $('#r2')[0].checked = true;
    else if (localStorage.getItem('item') == $('#r3').val())
        $('#r3')[0].checked = true;
    $('#nValue')[0].innerHTML = localStorage.getItem('n');
}

function tableToJson() {
    let headers = [];
    $('#resTbl thead tr th').each(function(){
        headers.push($(this).html())
    })
    headers.pop()
    let data = [];
    table.rows().data().each(function(val, ind){
        let line = {};
        for (let i = 0; i < headers.length; i++) {
            if (headers[i] == "Дата доставки"){
                line[headers[i]] = unformate_date(val[i]);
            }
            else{ line[headers[i]] = val[i];}
           
        }
        data.push(line);
    })
    return JSON.stringify(data);
}

function tableFromJson(line) {
    while (table.data().length > 0) {
        table.row(0).remove().draw(false);
    }
    let parsed = JSON.parse(line)
    
    for (let i = 0; i < parsed.length; i++) {
        let vals = []
        for (let key in parsed[i]) {
            if (key == "Дата доставки"){
                vals.push(formate_date(parsed[i][key]));
            }
            else{vals.push(parsed[i][key]);}
            
        }
        vals.push("<button class='delbtn' onclick='delRow(this)'></button>")
        table.row.add(vals).draw(false);
    }
}

function toServer() {
    $.ajax({
        type: 'POST',
        url: 'http://localhost/t-5/t-5.php',
        dataType: 'json',
        data: { flag: 0, text: tableToJson() }
    });
}

function fromServer() {
    $.ajax({
        type: 'POST',
        url: 'http://localhost/t-5/t-5.php',
        dataType: 'json',
        data: { flag: 1 },
        success: function (ans) {
            tableFromJson(ans);
        }
    });
}

$("button.slbtn").hover(function () {
    color = $(this).css("background-color");
    $(this).css({ "background-color": "#94CC94", "font-weight": "bolder" });
}, function () {
    $(this).css({ "background-color": color, "font-weight": "" });
});

$("input:button.inpbtn").hover(function () {
    $(this).css({ "font-weight": "bolder", "border": "3px solid #ddd", "border-style": "double" });
}, function () {
    $(this).css({ "font-weight": "", "border": "none" });
});