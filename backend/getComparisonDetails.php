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
        "message" => "Nie jesteś zalogowany."
    ]);
    exit;
}

$comparisonId = (int)($_GET["id"] ?? 0);
$uzytkownikId = $_SESSION["user_id"];

if ($comparisonId <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Brak ID porównania."
    ]);
    exit;
}

$stmt = mysqli_prepare(
    $conn,
    "SELECT id, nazwa, opis, data_utworzenia
    FROM porownanie
    WHERE id = ? AND uzytkownik_id = ?"
);

mysqli_stmt_bind_param($stmt, "ii", $comparisonId, $uzytkownikId);
mysqli_stmt_execute($stmt);

$result = mysqli_stmt_get_result($stmt);
$comparison = mysqli_fetch_assoc($result);

if (!$comparison) {
    echo json_encode([
        "success" => false,
        "message" => "Nie znaleziono porównania."
    ]);
    exit;
}

$stmtCars = mysqli_prepare(
    $conn,
    "SELECT 
        k.*,
        m.nazwa AS marka,
        mo.nazwa AS model,
        g.nazwa AS generacja,
        s.kod AS silnik_kod,
        s.nazwa_handlowa AS silnik_nazwa,
        s.pojemnosc_cm3,
        s.liczba_cylindrow,
        uc.nazwa AS uklad_cylindrow,
        tp.nazwa AS typ_paliwa,
        d.nazwa AS doladowanie,
        tn.nazwa AS nadwozie,
        n.nazwa AS naped,
        skr.nazwa AS skrzynia,
        pk.kolejnosc
    FROM porownanie_konfiguracje pk
    JOIN konfiguracja k ON k.id = pk.konfiguracja_id
    JOIN generacja_nadwozie gn ON gn.id = k.generacja_nadwozie_id
    JOIN generacja g ON g.id = gn.generacja_id
    JOIN model mo ON mo.id = g.model_id
    JOIN marka m ON m.id = mo.marka_id
    JOIN silnik s ON s.id = k.silnik_id
    LEFT JOIN uklad_cylindrow uc ON uc.id = s.uklad_cylindrow_id
    LEFT JOIN typ_paliwa tp ON tp.id = s.typ_paliwa_id
    LEFT JOIN doladowanie d ON d.id = s.doladowanie_id
    JOIN typ_nadwozia tn ON tn.id = gn.typ_nadwozia_id
    JOIN naped n ON n.id = k.naped_id
    JOIN skrzynia skr ON skr.id = k.skrzynia_id
    WHERE pk.porownanie_id = ?
    ORDER BY pk.kolejnosc ASC"
);

mysqli_stmt_bind_param($stmtCars, "i", $comparisonId);
mysqli_stmt_execute($stmtCars);

$resultCars = mysqli_stmt_get_result($stmtCars);

$cars = [];

while ($row = mysqli_fetch_assoc($resultCars)) {
    $row["compareID"] = (int)$row["kolejnosc"];
    $row["selectedYear"] = $row["rok_od"];
    $cars[] = $row;
}

echo json_encode([
    "success" => true,
    "comparison" => $comparison,
    "cars" => $cars
]);