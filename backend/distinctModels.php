<?php
    include("cors.php");
    include("dbConnect.php");
   $sql = "SELECT 
            model.id as id,
            marka.nazwa AS marka, 
            model.nazwa AS model, 
            zdjecie_modelu.sciezka AS sciezka
            FROM marka 
            JOIN model ON marka.id = model.marka_id 
            JOIN zdjecie_modelu ON model.id = zdjecie_modelu.model_id";
$query = mysqli_query($conn, $sql);
    $data = []; 
    while($row = mysqli_fetch_assoc($query)) {
        $data[] = $row;
    }
    header('Content-Type: application/json');
    echo json_encode($data);
    mysqli_close($conn);
?>