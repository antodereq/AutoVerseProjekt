<?php
include("cors.php");
include("dbConnect.php");

$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'] ?? '';
$brand = $data['brand'] ?? '';

$sql = "SELECT 
        marka.nazwa AS marka, 
        model.nazwa AS model, 
        zdjecie_modelu.sciezka AS sciezka
        FROM marka 
        JOIN model ON marka.id = model.marka_id
        JOIN zdjecie_modelu ON model.id = zdjecie_modelu.model_id";

if (!empty($name) && empty($brand)) {
    $sql .= " WHERE model.nazwa LIKE ?"; //? w zapytaniu to placeholder na dane
    $stmt = $conn->prepare($sql);

    $nameParam = "%$name%";
    $stmt->bind_param("s", $nameParam); //bind_param podstawia dane pod placeholder, s - podstawiany parametr to string

} else if (empty($name) && !empty($brand)) {
    $sql .= " WHERE marka.nazwa LIKE ?";
    $stmt = $conn->prepare($sql);

    $brandParam = "%$brand%";
    $stmt->bind_param("s", $brandParam);

} else if (!empty($name) && !empty($brand)) {
    $sql .= " WHERE marka.nazwa LIKE ? AND model.nazwa LIKE ?";
    $stmt = $conn->prepare($sql);

    $brandParam = "%$brand%";
    $nameParam = "%$name%";
    $stmt->bind_param("ss", $brandParam, $nameParam); //oba parametry to stringi

} else {
    $stmt = $conn->prepare($sql);
}

$stmt->execute();
$result = $stmt->get_result();

$output = [];

while ($row = $result->fetch_assoc()) {
    $output[] = $row;
}

header("Content-Type: application/json");
echo json_encode($output);

mysqli_close($conn);
?>