<?php
include("cors.php");
include("dbConnect.php");

$sql = "SELECT DISTINCT
        konfiguracja.id,
        marka.nazwa AS brand,
        model.nazwa AS model,
        model.segment AS segment,
        typ_nadwozia.nazwa AS bodyType,
        skrzynia.nazwa AS transmission,
        naped.nazwa AS drive,
        typ_paliwa.nazwa AS fuelType,
        uklad_cylindrow.nazwa AS engineLayout,
        silnik.pojemnosc_cm3 AS engineCapacityCc,
        silnik.nazwa_handlowa AS engineName,
        konfiguracja.moc_km AS power,
        konfiguracja.rok_od AS yearFrom,
        konfiguracja.rok_do AS yearTo,
        kraj.nazwa AS country,
        zdjecie_modelu.sciezka AS imageUrl,
        konfiguracja.moc_km * 1000 AS priceMin,
        konfiguracja.moc_km * 1500 AS priceMax,
        konfiguracja.spalanie_srednie AS avgConsumptionLPer100
    FROM konfiguracja
    JOIN generacja_nadwozie ON konfiguracja.generacja_nadwozie_id = generacja_nadwozie.id
    JOIN generacja ON generacja_nadwozie.generacja_id = generacja.id
    JOIN model ON generacja.model_id = model.id
    JOIN marka ON model.marka_id = marka.id
    JOIN kraj ON marka.kraj_id = kraj.id
    JOIN silnik ON konfiguracja.silnik_id = silnik.id
    JOIN typ_nadwozia ON generacja_nadwozie.typ_nadwozia_id = typ_nadwozia.id
    JOIN naped ON konfiguracja.naped_id = naped.id
    JOIN skrzynia ON konfiguracja.skrzynia_id = skrzynia.id
    JOIN typ_paliwa ON silnik.typ_paliwa_id = typ_paliwa.id
    LEFT JOIN uklad_cylindrow ON silnik.uklad_cylindrow_id = uklad_cylindrow.id
    LEFT JOIN zdjecie_modelu ON model.id = zdjecie_modelu.model_id
    ORDER BY marka.nazwa, model.nazwa, konfiguracja.rok_od";

$result = mysqli_query($conn, $sql);
$data = [];

while ($row = mysqli_fetch_assoc($result)) {
    $segment = strtolower($row['segment'] ?? '');
    if (strpos($segment, 'sport') !== false) {
        $usageTags = ['sport'];
    } elseif (strpos($segment, 'coupe') !== false) {
        $usageTags = ['daily', 'sport'];
    } else {
        $usageTags = ['daily'];
    }

    $row['usageTags'] = $usageTags;
    $row['avgConsumptionLPer100'] = $row['avgConsumptionLPer100'] !== null ? floatval($row['avgConsumptionLPer100']) : 0;
    $row['priceMin'] = $row['priceMin'] !== null ? floatval($row['priceMin']) : 0;
    $row['priceMax'] = $row['priceMax'] !== null ? floatval($row['priceMax']) : 0;
    $row['power'] = $row['power'] !== null ? floatval($row['power']) : 0;
    $row['engineCapacityCc'] = $row['engineCapacityCc'] !== null ? floatval($row['engineCapacityCc']) : 0;
    $row['yearFrom'] = $row['yearFrom'] !== null ? intval($row['yearFrom']) : 0;
    $row['yearTo'] = $row['yearTo'] !== null ? intval($row['yearTo']) : 0;

    $data[] = $row;
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($data, JSON_UNESCAPED_UNICODE);

mysqli_close($conn);
?>