<?php 
    try
    {
        //$pdo = new PDO("mysql:host=192.168.12.147;dbname=PlatformGame","Bryan","123");
        $pdo = new PDO("mysql:host=localhost;dbname=PlatformGame","root","");

    }
    catch(PDOException $e)
    {
        echo $e->getMessage();
    }
?>