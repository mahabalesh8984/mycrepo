<?php
function adminDb(){
    $host="localhost";
    $user = "root";
    $pass="root";
    $db="mycadmin";
    $con = mysqli_connect($host,$user,$pass,$db);
    
    return $con;
}

function getConnection($dbname){
    $host="localhost";
    $user = "root";
    $pass="root";
    $db=$dbname;
    $conn = mysqli_connect($host,$user,$pass,$db);
    return $conn;
}

?>