<?php
include("cors.php");
include("dbConnect.php");

$data = json_decode(file_get_contents("php://input"), true);
$carID = $data['carID'] ?? 0;

$response = [];

// marka + model
$sql = "SELECT 
        marka.nazwa AS marka,
        model.nazwa AS model
    FROM model
    JOIN marka ON model.marka_id = marka.id
    WHERE model.id = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $carID);
$stmt->execute();
$response = $stmt->get_result()->fetch_assoc();


// napędy
$sql = "SELECT DISTINCT
        naped.id,
        naped.nazwa
    FROM model
    JOIN generacja ON generacja.model_id = model.id
    JOIN generacja_nadwozie ON generacja_nadwozie.generacja_id = generacja.id
    JOIN konfiguracja ON konfiguracja.generacja_nadwozie_id = generacja_nadwozie.id
    JOIN naped ON konfiguracja.naped_id = naped.id
    WHERE model.id = ?
    ORDER BY naped.nazwa
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $carID);
$stmt->execute();
$response["napedy"] = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);


// skrzynie
$sql = "SELECT DISTINCT
        skrzynia.id,
        skrzynia.nazwa
    FROM model
    JOIN generacja ON generacja.model_id = model.id
    JOIN generacja_nadwozie ON generacja_nadwozie.generacja_id = generacja.id
    JOIN konfiguracja ON konfiguracja.generacja_nadwozie_id = generacja_nadwozie.id
    JOIN skrzynia ON konfiguracja.skrzynia_id = skrzynia.id
    WHERE model.id = ?
    ORDER BY skrzynia.nazwa
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $carID);
$stmt->execute();
$response["skrzynie"] = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);


// nadwozia
$sql = "SELECT DISTINCT
        typ_nadwozia.id,
        typ_nadwozia.nazwa
    FROM model
    JOIN generacja ON generacja.model_id = model.id
    JOIN generacja_nadwozie ON generacja_nadwozie.generacja_id = generacja.id
    JOIN typ_nadwozia ON generacja_nadwozie.typ_nadwozia_id = typ_nadwozia.id
    WHERE model.id = ?
    ORDER BY typ_nadwozia.nazwa
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $carID);
$stmt->execute();
$response["nadwozia"] = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

//roczniki
$sql = "SELECT DISTINCT
        konfiguracja.rok_od AS rok_od,
        konfiguracja.rok_do AS rok_do
    FROM konfiguracja
    JOIN generacja_nadwozie ON konfiguracja.generacja_nadwozie_id = generacja_nadwozie.id
    JOIN generacja ON generacja_nadwozie.generacja_id = generacja.id
    WHERE generacja.model_id = ?
    ORDER BY konfiguracja.rok_od";
    
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $carID);
$stmt->execute();
$response["roczniki"] = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);


// silniki
$sql = "SELECT DISTINCT
        silnik.id,
        silnik.kod,
        silnik.nazwa_handlowa,
        silnik.pojemnosc_cm3,
        silnik.liczba_cylindrow,
        uklad_cylindrow.nazwa AS uklad_cylindrow,
        typ_paliwa.nazwa AS typ_paliwa,
        doladowanie.nazwa AS doladowanie
    FROM model
    JOIN generacja ON generacja.model_id = model.id
    JOIN generacja_nadwozie ON generacja_nadwozie.generacja_id = generacja.id
    JOIN konfiguracja ON konfiguracja.generacja_nadwozie_id = generacja_nadwozie.id
    JOIN silnik ON konfiguracja.silnik_id = silnik.id
    LEFT JOIN uklad_cylindrow ON silnik.uklad_cylindrow_id = uklad_cylindrow.id
    JOIN typ_paliwa ON silnik.typ_paliwa_id = typ_paliwa.id
    LEFT JOIN doladowanie ON silnik.doladowanie_id = doladowanie.id
    WHERE model.id = ?
    ORDER BY silnik.pojemnosc_cm3
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $carID);
$stmt->execute();
$response["silniki"] = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);


echo json_encode($response, JSON_UNESCAPED_UNICODE);

// DOSTANĘ:
// {
//   "marka": "Hyundai",
//   "model": "Genesis Coupe",
//   "napedy": [
//     { 
//       "id": 2, 
//       "nazwa": "RWD" 
//     }
//   ],
//   "skrzynie": [
//     { "id": 1, "nazwa": "manual" },
//     { "id": 2, "nazwa": "automat" }
//   ],
//   "nadwozia": [
//     { "id": 1, 
//       "nazwa": "coupe" 
//     }],
//   "silniki": [
//     {
//       "id": 3,
//       "kod": "G4KF",
//       "pojemnosc_cm3": 1998,
//       "liczba_cylindrow": 4,
//       "uklad_cylindrow": "R",
//       "typ_paliwa": "benzyna",
//       "doladowanie": "turbo"
//     }
//     {
//       "id": 4,
//       "kod": "G4KG",
//       "pojemnosc_cm3": 3798,
//       "liczba_cylindrow": 6,
//       "uklad_cylindrow": "V",
//       "typ_paliwa": "benzyna",
//       "doladowanie": "WOLNOSSĄCY"
//     }
//   ]
// }
$conn->close();
?> 