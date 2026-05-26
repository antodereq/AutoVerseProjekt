<?php
include("cors.php");
require_once "dbConnect.php";
session_start();

header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

if (!isset($_SESSION["user_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Musisz być zalogowany, aby zapisać porównanie."
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$nazwa = trim($data["nazwa"] ?? "");
$opis = trim($data["opis"] ?? "");
$konfiguracje = $data["konfiguracje"] ?? [];

if ($nazwa === "") {
    echo json_encode([
        "success" => false,
        "message" => "Podaj nazwę porównania."
    ]);
    exit;
}

if (!is_array($konfiguracje) || count($konfiguracje) === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Porównanie musi zawierać przynajmniej jeden samochód."
    ]);
    exit;
}

$uzytkownikId = $_SESSION["user_id"];

mysqli_begin_transaction($conn);

try {
    $stmt = mysqli_prepare(
        $conn,
        "INSERT INTO porownanie (uzytkownik_id, nazwa, opis) VALUES (?, ?, ?)"
    );

    mysqli_stmt_bind_param($stmt, "iss", $uzytkownikId, $nazwa, $opis);
    mysqli_stmt_execute($stmt);

    $porownanieId = mysqli_insert_id($conn);

    $stmtConfig = mysqli_prepare(
        $conn,
        "INSERT INTO porownanie_konfiguracje 
        (porownanie_id, konfiguracja_id, kolejnosc) 
        VALUES (?, ?, ?)"
    );

    foreach ($konfiguracje as $index => $konfiguracjaId) {
        $konfiguracjaId = (int)$konfiguracjaId;
        $kolejnosc = $index + 1;

        mysqli_stmt_bind_param(
            $stmtConfig,
            "iii",
            $porownanieId,
            $konfiguracjaId,
            $kolejnosc
        );

        mysqli_stmt_execute($stmtConfig);
    }

    mysqli_commit($conn);

    echo json_encode([
        "success" => true,
        "message" => "Porównanie zostało zapisane.",
        "porownanie_id" => $porownanieId
    ]);
} catch (Throwable $e) {
    mysqli_rollback($conn);

    echo json_encode([
        "success" => false,
        "message" => "Nie udało się zapisać porównania.",
        "error" => $e->getMessage()
    ]);
}