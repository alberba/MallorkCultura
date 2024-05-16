<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$url = "https://mallorcaroute.com/edificios.json";
$response = file_get_contents($url);

echo $response;
?>