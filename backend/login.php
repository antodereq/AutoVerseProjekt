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

$data = json_decode(file_get_contents("php://input"), true);

$mail = trim($data["mail"] ?? "");
$haslo = $data["haslo"] ?? "";

if ($mail === "" || $haslo === "") {
    echo json_encode([
        "success" => false,
        "message" => "Podaj email i hasło."
    ]);
    exit;
}

$stmt = mysqli_prepare(
    $conn,
    "SELECT 
        u.id,
        u.mail,
        u.login,
        u.haslo,
        u.rola,
        s.opis AS status
    FROM uzytkownicy_strony u
    JOIN statusy_kont s ON s.id = u.status_konta_id
    WHERE u.mail = ?"
);

mysqli_stmt_bind_param($stmt, "s", $mail);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$user = mysqli_fetch_assoc($result);

if (!$user || !password_verify($haslo, $user["haslo"])) {
    echo json_encode([
        "success" => false,
        "message" => "Nieprawidłowy email lub hasło."
    ]);
    exit;
}

if ($user["status"] !== "aktywne") {
    echo json_encode([
        "success" => false,
        "message" => "Konto nie jest aktywne."
    ]);
    exit;
}

$_SESSION["user_id"] = $user["id"];
$_SESSION["user_login"] = $user["login"];
$_SESSION["user_mail"] = $user["mail"];
$_SESSION["user_rola"] = $user["rola"];

echo json_encode([
    "success" => true,
    "message" => "Zalogowano pomyślnie.",
    "user" => [
        "id" => $user["id"],
        "login" => $user["login"],
        "mail" => $user["mail"],
        "rola" => $user["rola"]
    ]
]);