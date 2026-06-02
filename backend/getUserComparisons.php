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
        "message" => "Nie jesteś zalogowany.",
        "comparisons" => []
    ]);
    exit;
}

$uzytkownikId = $_SESSION["user_id"];

$stmt = mysqli_prepare(
    $conn,
    "SELECT 
        p.id,
        p.nazwa,
        p.opis,
        p.data_utworzenia,
        COUNT(pk.id) AS liczba_aut
    FROM porownanie p
    LEFT JOIN porownanie_konfiguracje pk 
        ON pk.porownanie_id = p.id
    WHERE p.uzytkownik_id = ?
    GROUP BY p.id, p.nazwa, p.opis, p.data_utworzenia
    ORDER BY p.data_utworzenia DESC"
);

mysqli_stmt_bind_param($stmt, "i", $uzytkownikId);
mysqli_stmt_execute($stmt);

$result = mysqli_stmt_get_result($stmt);

$comparisons = [];

while ($row = mysqli_fetch_assoc($result)) {
    $comparisons[] = $row;
}

echo json_encode([
    "success" => true,
    "comparisons" => $comparisons
]);