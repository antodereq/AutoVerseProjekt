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

//generacje
$sql = "SELECT DISTINCT
        generacja.id, 
        generacja.nazwa AS generacja,
        generacja.rok_od AS gen_od,
        generacja.rok_do AS gen_do
        FROM model
        JOIN generacja ON model.id = generacja.model_id
        WHERE model.id = ?
        ORDER BY generacja.nazwa";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $carID);
$stmt->execute();
$response["generacje"] = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);


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


// konfiguracje
$sql = "SELECT DISTINCT
        konfiguracja.id AS konfiguracja_id,

        generacja.id AS generacja_id,
        generacja.nazwa AS generacja,
        generacja.rok_od AS gen_od,
        generacja.rok_do AS gen_do,

        konfiguracja.rok_od AS rok_od,
        konfiguracja.rok_do AS rok_do,

        silnik.id AS silnik_id,
        silnik.kod AS silnik_kod,
        silnik.nazwa_handlowa AS silnik_nazwa,
        silnik.pojemnosc_cm3 AS pojemnosc_cm3,
        silnik.liczba_cylindrow AS liczba_cylindrow,
        uklad_cylindrow.nazwa AS uklad_cylindrow,
        typ_paliwa.nazwa AS typ_paliwa,
        doladowanie.nazwa AS doladowanie,

        typ_nadwozia.id AS nadwozie_id,
        typ_nadwozia.nazwa AS nadwozie,

        naped.id AS naped_id,
        naped.nazwa AS naped,

        skrzynia.id AS skrzynia_id,
        skrzynia.nazwa AS skrzynia,

        konfiguracja.nazwa_wersji,
        konfiguracja.ilosc_biegow,
        konfiguracja.moc_km,
        konfiguracja.moment_nm,
        konfiguracja.przyspieszenie_0_100,
        konfiguracja.predkosc_max,
        konfiguracja.spalanie_srednie,
        konfiguracja.spalanie_miasto,
        konfiguracja.spalanie_trasa,
        konfiguracja.masa_wlasna_kg
    FROM konfiguracja
    JOIN generacja_nadwozie ON konfiguracja.generacja_nadwozie_id = generacja_nadwozie.id
    JOIN generacja ON generacja_nadwozie.generacja_id = generacja.id
    JOIN model ON generacja.model_id = model.id
    JOIN silnik ON konfiguracja.silnik_id = silnik.id
    JOIN typ_nadwozia ON generacja_nadwozie.typ_nadwozia_id = typ_nadwozia.id
    JOIN naped ON konfiguracja.naped_id = naped.id
    JOIN skrzynia ON konfiguracja.skrzynia_id = skrzynia.id
    LEFT JOIN uklad_cylindrow ON silnik.uklad_cylindrow_id = uklad_cylindrow.id
    JOIN typ_paliwa ON silnik.typ_paliwa_id = typ_paliwa.id
    LEFT JOIN doladowanie ON silnik.doladowanie_id = doladowanie.id
    WHERE model.id = ?
    ORDER BY generacja.rok_od, konfiguracja.rok_od, silnik.pojemnosc_cm3
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $carID);
$stmt->execute();
$response["konfiguracje"] = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

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