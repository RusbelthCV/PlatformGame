<?php 
    
    try
    {
        //$pdo = new PDO("mysql:host=192.168.12.106;dbname=PlatformGame","root","");
        $pdo = new PDO("mysql:host=localhost;dbname=PlatformGame","root","");

    }
    catch(PDOException $e)
    {
        echo $e->getMessage();
    }
?>