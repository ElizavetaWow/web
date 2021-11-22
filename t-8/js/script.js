datasetNumber = 621
var parking = []
districts = {}

function getData() {
    link = "https://apidata.mos.ru/v1/datasets/" + datasetNumber + "/rows?api_key=" + key
    $.get(link, function (data) {
        for (i = 0; i < data.length; i++) {
            parking.push({
                'Name': data[i].Cells.Name,
                'CarCapacity': data[i].Cells.CarCapacity,
                'Coordinates': data[i].Cells.geoData.coordinates,
                'AdmArea': data[i].Cells.AdmArea
            })
        }
        draw()
    })
}

dmin0 = 37.13; dmax0 = 37.93; dd = dmax0 - dmin0
wmin0 = 55.56; wmax0 = 56.01; wd = wmax0 - wmin0;
kw = 10000 / 90;
wkm = wd * kw
kd = kw * Math.cos(((wmax0 + wmin0) / 2) * Math.PI / 180)
dkm = kd * dd
kkm = dkm / wkm
ymax = 600; xmax = Math.round(ymax * kkm);
ky = ymax / wd;
kx = xmax / dd
function kY(w) { return -Math.round(ky * (w - wmin0)) }
function kX(d) { return Math.round(kx * (d - dmin0)) }

function draw() {
    var cs1 = document.getElementById("cnvs");
    var cntx = cs1.getContext("2d");
    with (cntx) {
        translate(0, ymax)
        strokeStyle = "#0000FF";
        for (var i = 0; i < parking.length; i++) {  // 
            x = kX(parking[i].Coordinates[0]);
            y = kY(parking[i].Coordinates[1])
            beginPath()
            cntx.arc(x, y, 2, 0, Math.PI * 2);
            stroke()
            if (!(parking[i].AdmArea in districts)) {
                districts[parking[i].AdmArea] = 0
            }
            districts[parking[i].AdmArea] += 1
        }
        for (let key in districts) {
            document.getElementById('stat').innerHTML += '<tr><td>' + key + '</td><td>' + districts[key] + '</td></tr>'
        }
        document.getElementById('stat').value = districts
        dx = Math.round(2 * xmax / dkm)
        dy = Math.round(2 * ymax / wkm)
        strokeStyle = "#000";
        beginPath()
        for (var i = dx; i < xmax; i += dx) {
            moveTo(i, 0); lineTo(i, -6); stroke()
        }
        for (var i = dy; i < ymax; i += dy) {
            moveTo(0, -i); lineTo(6, -i); stroke()
        }
        strokeText("2 km", 12, -2)

    }
}