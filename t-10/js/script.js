districts = {}
h = 30
y = -15
heigh = document.getElementById("cnvs").height
hmax = heigh - 25;
datamax0 = -1
datamax1 = -1
cntx = document.getElementById("cnvs").getContext("2d");
cntx.translate(0, heigh)

function getDistricts() {
    for (i = 0; i < taxi.length; i++) {
        if (!(taxi[i].AdmArea in districts)) {
            districts[taxi[i].AdmArea] = [0, 0]
        }
        districts[taxi[i].AdmArea][0] += 1
    }
    for (i = 0; i < bike.length; i++) {
        if (!(bike[i].AdmArea in districts)) {
            districts[bike[i].AdmArea] = [0, 0]
        }
        districts[bike[i].AdmArea][1] += 1
    }
    for (let key in districts) {
        if (districts[key][0] > datamax0) datamax0 = districts[key][0]
        if (districts[key][1] > datamax1) datamax1 = districts[key][1]
    }
    createTable()
    draw()
    fgraf()
}

function createTable() {
    s = ""
    n = 1
    for (let key in districts) {
        s += "<tr><td align=center>" + n + "</td><td>" + key + "</td><td align=right>" + districts[key][0] + "</td>" + "<td align=right>" + districts[key][1] + "</td>"
        n++
    }
    document.getElementById('tblstat').innerHTML += s
}

function k(n) {
    return Math.round(hmax * n / (datamax0 + datamax1))
}

function draw() {
    with (cntx) {
        beginPath()
        step = 30
        lineWidth = 0.8
        strokeStyle = '#4D4D4D'
        moveTo(20, -5)
        lineTo(20, -hmax + y)
        moveTo(5, y)
        lineTo(600, y)
        for (i = 0; i <= (hmax - y) / step; i++) {
            strokeText(i * step, 2, y - i * k(step))
            moveTo(20, y - i * k(step))
            lineTo(25, y - i * k(step))
        }
        i = 1
        x = 40
        for (let key in districts) {
            fillStyle = "#078EC0"
            fillRect(x, y, h, -k(districts[key][0]))
            fillStyle = "#C6101E"
            fillRect(x, y - k(districts[key][0]), h, -k(districts[key][1]))
            strokeText(i, x + 10, -5)
            x += 50
            i++
        }
        stroke()
    }
}

function fgraf() {
    p0 = []
    p1 = []
    for (let key in districts) {
        p0.push(districts[key][0])
        p1.push(districts[key][1])
    }
    zingchart.render({
        id: 'zchart',
        data: {
            type: 'bar',
            plotarea: {
                'adjust-layout': true
            },
            'scale-x': {
                label: { 
                    text: "Округ",
                },
                'min-value': 1

            },
            plot: {
                stacked: true,
                'stack-type': "normal"
            },
            series: [
                { values: p0 },
                { values: p1 }
            ]
        },
        height: 400,
        width: 600
    });
}