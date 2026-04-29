<?php
    $host = 'localhost';
    $user = 'root';
    $password = '';
    $dbName = 'autoverse2';

    $conn = mysqli_connect($host, $user, $password, $dbName);
    if (!$conn) {
        die("Połączenie z db nie śmiga: " . mysqli_connect_error());
    }
?>