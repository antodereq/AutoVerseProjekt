<?php
include("cors.php");
require_once "dbConnect.php";
require_once "mailer.php";
session_start();

$data = json_decode(file_get_contents("php://input"), true);

$mail = trim($data["mail"] ?? "");
$login = trim($data["login"] ?? "");
$haslo = $data["haslo"] ?? "";

if ($mail === "" || $login === "" || $haslo === "") {
    echo json_encode([
        "success" => false,
        "message" => "Wypełnij wszystkie pola."
    ]);
    exit;
}

if (!filter_var($mail, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        "success" => false,
        "message" => "Podaj poprawny adres email."
    ]);
    exit;
}

$stmt = mysqli_prepare($conn, "SELECT id FROM uzytkownicy_strony WHERE mail = ?");
mysqli_stmt_bind_param($stmt, "s", $mail);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if (mysqli_fetch_assoc($result)) {
    echo json_encode([
        "success" => false,
        "message" => "Konto z takim adresem email już istnieje."
    ]);
    exit;
}

$stmt = mysqli_prepare($conn, "SELECT id FROM tabela_tymczasowa WHERE mail = ?");
mysqli_stmt_bind_param($stmt, "s", $mail);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if (mysqli_fetch_assoc($result)) {
    echo json_encode([
        "success" => false,
        "message" => "Ten email czeka już na potwierdzenie. Sprawdź skrzynkę pocztową."
    ]);
    exit;
}

$token = bin2hex(random_bytes(32));
$hasloHash = password_hash($haslo, PASSWORD_DEFAULT);
$dataWygasniecia = date("Y-m-d H:i:s", strtotime("+24 hours"));
$rola = "user";

$stmt = mysqli_prepare(
    $conn,
    "INSERT INTO tabela_tymczasowa 
    (token, mail, data_wygasniecia, haslo, login, rola)
    VALUES (?, ?, ?, ?, ?, ?)"
);

mysqli_stmt_bind_param(
    $stmt,
    "ssssss",
    $token,
    $mail,
    $dataWygasniecia,
    $hasloHash,
    $login,
    $rola
);

if (!mysqli_stmt_execute($stmt)) {
    echo json_encode([
        "success" => false,
        "message" => "Nie udało się utworzyć konta tymczasowego."
    ]);
    exit;
}

$frontendUrl = envValue("FRONTEND_URL");
$link = $frontendUrl . "/verify-email?token=" . urlencode($token);

try {
    sendVerificationMail($mail, $login, $link);

    echo json_encode([
        "success" => true,
        "message" => "Konto zostało utworzone. Sprawdź email i kliknij link potwierdzający."
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Konto tymczasowe zostało zapisane, ale nie udało się wysłać maila.",
        "debug" => $e->getMessage()
    ]);
}