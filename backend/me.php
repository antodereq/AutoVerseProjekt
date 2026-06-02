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

if (!isset($_SESSION["user_id"])) {
    echo json_encode([
        "loggedIn" => false,
        "user" => null
    ]);
    exit;
}

echo json_encode([
    "loggedIn" => true,
    "user" => [
        "id" => $_SESSION["user_id"],
        "login" => $_SESSION["user_login"],
        "mail" => $_SESSION["user_mail"],
        "rola" => $_SESSION["user_rola"]
    ]
]);