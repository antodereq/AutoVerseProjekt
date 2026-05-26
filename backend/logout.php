<?php
include("cors.php");
require_once "dbConnect.php";
session_start();

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

session_unset();
session_destroy();

echo json_encode([
    "success" => true,
    "message" => "Wylogowano pomyślnie."
]);