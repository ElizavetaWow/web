var table = $("#resTbl").DataTable({
    "order": [[3, "asc"], [4, "desc"]]
});

$(document).ready(function () {
    fromServer()
}
);

function tableFromJson(line) {
    while (table.data().length > 0) {
        table.row(0).remove().draw(false);
    }
    let parsed = JSON.parse(line)
    for (let i = 0; i < parsed.length; i++) {
        let vals = []
        for (let key in parsed[i]) {
            vals.push(parsed[i][key]);
        }
        table.row.add(vals).draw(false);
    }
}


function fromServer() {
    $.ajax({
        type: 'POST',
        url: 'http://localhost/t-6/t-6.php',
        dataType: 'json',
        success: function (ans) {
            tableFromJson(ans);
        }
    });
}
