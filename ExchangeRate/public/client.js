
function getData() {
    $.post('http://localhost:4000/exchange',
        { 'currency': document.getElementById('currency').value },
        function (data) {
            if (data == 'error') {
                document.getElementById('rate').value = 'error'
            }
            document.getElementById('rate').value = data.value
        });
}