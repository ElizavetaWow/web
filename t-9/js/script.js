datasetNumber = 621
parking = []
genPoints = []
dataready = false
parkingdraw = false
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
r = 2
k = 1
cntx = document.getElementById("cnvs").getContext("2d");
cntx.translate(0, ymax)
scales()

function getData() {
    link = "https://apidata.mos.ru/v1/datasets/" + datasetNumber + "/rows?api_key=" + key
    $.get(link, function (data) {
        reformatData(data);
        alert('Данные получены')
        dataready = true
    })
}

function reformatData(data) {
    for (i = 0; i < data.length; i++) {
        parking.push(data[i].Cells.geoData.coordinates)
    }
}

function rand(n) {
    return Math.round(n * Math.random());
}

function generatePoints() {
    n = document.getElementById('npoints').value
    for (var i = 0; i < n; i++) {
        genPoints.push([r + rand(600 - 2 * r), -r - rand(600 - 2 * r)])
    }
}

function scales() {
    with (cntx) {
        dx = Math.round(2 * xmax / dkm)
        dy = Math.round(2 * ymax / wkm)
        strokeStyle = "#000";
        lineWidth = 1;
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
function kY(w) { return -Math.round(ky * (w - wmin0)) }
function kX(d) { return Math.round(kx * (d - dmin0)) }


function draw(t) {
    with (cntx) {
        lineWidth = 2;
        if (t == 0) {
            if (dataready) {
                strokeStyle = "#0000FF";
                for (var i = 0; i < parking.length; i++) {
                    x = kX(parking[i][0]);
                    y = kY(parking[i][1])
                    beginPath()
                    arc(x, y, r, 0, Math.PI * 2);
                    stroke()
                }
                parkingdraw = true

            }
            else {
                alert('Данные ещё не получены. Повторите запрос позже')
            }
        }
        else if (t == 1) generatePoints()
        strokeStyle = "#22A522";
        for (var i = 0; i < genPoints.length; i++) {
            x = genPoints[i][0];
            y = genPoints[i][1];
            beginPath();
            arc(x, y, r, 0, Math.PI * 2);
            stroke();
        }

    }
}

function findk(k) {
    hn = 0 //точки ниже прямой
    ln = 0 //точки выше прямой
    for (var i = 0; i < genPoints.length; i++) {
        x = genPoints[i][0];
        y = genPoints[i][1];
        if (k * x - 600 > y) hn += 1
        if (k * x - 600 < y) ln += 1
    }
    if (parkingdraw) {
        for (var i = 0; i < parking.length; i++) {
            x = kX(parking[i][0]);
            y = kY(parking[i][1])
            if (k * x - 600 > y) hn += 1
            if (k * x - 600 < y) ln += 1
        }
    }
    if (((hn + ln) % 2 == 1) && (Math.abs(hn - ln) == 1)) return k
    if (hn > ln) return findk(k - k / 2)
    if (hn < ln) return findk(k + k / 2)
    if (hn == ln) return k
}

function drawline() {
    clearline()
    k = findk(k)
    with (cntx) {
        beginPath();
        lineWidth = 2;
        strokeStyle = 'red';
        moveTo(0, -600);
        lineTo(600, 600 * k - 600);
        stroke();
    }
}

function clearline() {
    with (cntx) {
        clearRect(0, -600, canvas.width, canvas.height);
        scales()
        if (parkingdraw) draw(0)
        draw(2)
    }

}
