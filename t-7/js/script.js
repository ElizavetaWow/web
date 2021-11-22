/* {
	"ID": 39,
	"global_id": 1081220580,
	"AdmArea": "Зеленоградский административный округ",
	"District": "район Старое Крюково",
	"Address": "город Москва, город Зеленоград, Крюковская площадь, дом 1",
	"RegionOfFair": "Тамбовская область",
	"PeriodOfPlacement": "11.01.2021-17.01.2021",
	"Goods": "сельскохозяйственная продукция, продовольственная продукция, промышленные товары.",
	"geoData": {
		"coordinates": [37.1748509137993, 55.9801213119587],
		"type": "Point"
	},
	"geodata_center": {
		"coordinates": [37.1748509137993, 55.9801213119587],
		"type": "Point"
	}
} */

function createTable() {
    var s = "<table border id='tbl'> <tr><th>Административный округ <th>Район <th>Регион, проводящий ярмарку <th>Дата начала ярмарки <th>Дата окончания ярмарки<th>Адрес "
    for (i=0; i<data.length; i++){
        s += "<tr><td>"+data[i].AdmArea+"<td>"+data[i].District.replace("район", "").trim()+"<td>"+data[i].RegionOfFair+"<td>"+data[i].PeriodOfPlacement.split('-')[0]
        +"<td>"+data[i].PeriodOfPlacement.split('-')[1]+"<td>"+data[i].Address
    }
    s += "</table>"
    document.getElementById("data").innerHTML = s
}

function sortTable(ts) {
    table = document.getElementById("tbl");
    rows = table.rows;
    i = 0
    flag = true
    while (flag) {
        flag = false
        for (j = 1; j < (rows.length - i - 1); j++) {
            row1 = rows[j].getElementsByTagName("td")[1];
            row2 = rows[j + 1].getElementsByTagName("td")[1];
            if (ts == 'asc') {
                if (row1.innerHTML.toLowerCase() > row2.innerHTML.toLowerCase()) {
                    rows[j].before(rows[j + 1]);
                    flag = true
                }
            }
            else if (ts == 'desc') {
                if (row1.innerHTML.toLowerCase() < row2.innerHTML.toLowerCase()) {
                    rows[j].before(rows[j + 1]);
                    flag = true
                }
            }
        }
        i = i + 1
    }
}