<?php 
    if(!isset($_GET['section']))
    {
      $section = 'portada';
    }
    else
    {
        $section = $_GET['section'];
    }
    switch($section)
    {
        case 'portada':
        {
            include_once 'Controller/portadaController.php';
            break;
        }
        case 'login':
        {
            include_once 'Controller/loginUsuarioController.php';
            break;
        }
        case 'registro':
        {
            include_once 'Controller/Controller-Registro.php';
            break;
        }
        case 'lobby':
        {
            include_once 'Controller/lobbyController.php';
            break;
        }
        case 'game':
        {
            include_once 'Controller/gameController.php';
            break;
        }
    }
?>