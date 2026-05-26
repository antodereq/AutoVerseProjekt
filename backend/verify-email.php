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

$token = $_GET["token"] ?? "";

if ($token === "") {
    echo json_encode([
        "success" => false,
        "message" => "Brak tokenu potwierdzającego."
    ]);
    exit;
}

$stmt = mysqli_prepare($conn, "SELECT * FROM tabela_tymczasowa WHERE token = ?");
mysqli_stmt_bind_param($stmt, "s", $token);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$tempUser = mysqli_fetch_assoc($result);

if (!$tempUser) {
    echo json_encode([
        "success" => false,
        "message" => "Nieprawidłowy token potwierdzający."
    ]);
    exit;
}

if (strtotime($tempUser["data_wygasniecia"]) < time()) {
    $stmt = mysqli_prepare($conn, "DELETE FROM tabela_tymczasowa WHERE id = ?");
    mysqli_stmt_bind_param($stmt, "i", $tempUser["id"]);
    mysqli_stmt_execute($stmt);

    echo json_encode([
        "success" => false,
        "message" => "Link potwierdzający wygasł. Zarejestruj się ponownie."
    ]);
    exit;
}

$statusOpis = "aktywne";

$stmt = mysqli_prepare($conn, "SELECT id FROM statusy_kont WHERE opis = ?");
mysqli_stmt_bind_param($stmt, "s", $statusOpis);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$status = mysqli_fetch_assoc($result);

if (!$status) {
    echo json_encode([
        "success" => false,
        "message" => "Brak statusu konta 'aktywne' w bazie danych."
    ]);
    exit;
}

$stmt = mysqli_prepare(
    $conn,
    "INSERT INTO uzytkownicy_strony
    (mail, login, haslo, rola, status_konta_id)
    VALUES (?, ?, ?, ?, ?)"
);

mysqli_stmt_bind_param(
    $stmt,
    "ssssi",
    $tempUser["mail"],
    $tempUser["login"],
    $tempUser["haslo"],
    $tempUser["rola"],
    $status["id"]
);

if (!mysqli_stmt_execute($stmt)) {
    echo json_encode([
        "success" => false,
        "message" => "Nie udało się aktywować konta."
    ]);
    exit;
}

$stmt = mysqli_prepare($conn, "DELETE FROM tabela_tymczasowa WHERE id = ?");
mysqli_stmt_bind_param($stmt, "i", $tempUser["id"]);
mysqli_stmt_execute($stmt);

echo json_encode([
    "success" => true,
    "message" => "Email został potwierdzony. Możesz się teraz zalogować."
]);