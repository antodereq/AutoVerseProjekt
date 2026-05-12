<?php
include("cors.php");
include("dbConnect.php");

$response = [];

$brandsResult = mysqli_query($conn, 'SELECT DISTINCT nazwa FROM marka ORDER BY nazwa');
$response['brands'] = [];
while ($row = mysqli_fetch_assoc($brandsResult)) {
    $response['brands'][] = $row['nazwa'];
}

$modelsResult = mysqli_query($conn, 'SELECT DISTINCT model.nazwa AS name, marka.nazwa AS brand FROM model JOIN marka ON model.marka_id = marka.id ORDER BY marka.nazwa, model.nazwa');
$response['models'] = [];
while ($row = mysqli_fetch_assoc($modelsResult)) {
    $response['models'][] = [
        'name' => $row['name'],
        'brand' => $row['brand']
    ];
}

$bodyTypesResult = mysqli_query($conn, 'SELECT DISTINCT nazwa FROM typ_nadwozia ORDER BY nazwa');
$response['bodyTypes'] = [];
while ($row = mysqli_fetch_assoc($bodyTypesResult)) {
    $response['bodyTypes'][] = $row['nazwa'];
}

$transmissionsResult = mysqli_query($conn, 'SELECT DISTINCT nazwa FROM skrzynia ORDER BY nazwa');
$response['transmissions'] = [];
while ($row = mysqli_fetch_assoc($transmissionsResult)) {
    $response['transmissions'][] = $row['nazwa'];
}

$driveTypesResult = mysqli_query($conn, 'SELECT DISTINCT nazwa FROM naped ORDER BY nazwa');
$response['driveTypes'] = [];
while ($row = mysqli_fetch_assoc($driveTypesResult)) {
    $response['driveTypes'][] = $row['nazwa'];
}

$fuelTypesResult = mysqli_query($conn, 'SELECT DISTINCT nazwa FROM typ_paliwa ORDER BY nazwa');
$response['fuelTypes'] = [];
while ($row = mysqli_fetch_assoc($fuelTypesResult)) {
    $response['fuelTypes'][] = $row['nazwa'];
}

$engineLayoutsResult = mysqli_query($conn, 'SELECT DISTINCT nazwa FROM uklad_cylindrow WHERE nazwa IS NOT NULL ORDER BY nazwa');
$response['engineLayouts'] = [];
while ($row = mysqli_fetch_assoc($engineLayoutsResult)) {
    $response['engineLayouts'][] = $row['nazwa'];
}

$countriesResult = mysqli_query($conn, 'SELECT DISTINCT nazwa FROM kraj ORDER BY nazwa');
$response['countries'] = [];
while ($row = mysqli_fetch_assoc($countriesResult)) {
    $response['countries'][] = $row['nazwa'];
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($response, JSON_UNESCAPED_UNICODE);

mysqli_close($conn);
?>