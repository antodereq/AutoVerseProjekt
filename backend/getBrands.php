<?php
include("cors.php");
include("dbConnect.php");

$sql = "SELECT nazwa FROM marka";
$query = mysqli_query($conn, $sql);

$data = [];

while ($row = mysqli_fetch_assoc($query)) {
    $data[] = $row;
}

echo json_encode($data);

mysqli_close($conn);