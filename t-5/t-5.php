<?php
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

if ($_POST['line']) {
  $data = fopen('data.json', 'w');
  fputs($data, $_POST['line']);
  fclose($data);
  if (is_file('data.json')) {
    $data = file('data.json');
    echo $data;
    exit();
  }
}
?>