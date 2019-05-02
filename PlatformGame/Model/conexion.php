<?php 
    
    try
    {
        $pdo = new PDO("mysql:host=localhost;dbname=PlatformGame","root","");
    }
    catch(PDOException $e)
    {
        echo $e->getMessage();
    }
?>