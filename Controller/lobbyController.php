<?php  
    require_once 'Model/lobbyModel.php';

    if(isset($_GET['user']))
    {
        $user = $_GET['user'];
        require_once 'Model/lobbyModel.php';
        lobbyModel::insertData($user);
    }
    if(isset($_GET['player2']) && isset($_GET['user']))
    {
        $owner = $_GET['user'];
        $user = $_GET['player2'];
        require_once 'Model/lobbyModel.php';
        lobbyModel::insertPlayer2($user,$owner);
    }
    if(isset($_GET['eliminar'])){
        require_once 'Model/lobbyModel.php';
        lobbyModel::deleteSala();
    }
    if(isset($_GET['puntos'])){
        @session_start();
        require_once 'Model/lobbyModel.php';
        $puntos=$_GET['puntos'];
        lobbyModel::insertarScore($puntos, $_SESSION['usuario']);   
    }


    function salasExists()
    {
        require_once 'Model/lobbyModel.php';
        $rooms = lobbyModel::rooms();
        return $rooms;
    }
    function owner()
    {
        require_once 'Model/lobbyModel.php';
        $id = lobbyModel::owner();
        return $id;
    }
    function existPlayer1()
    {
        require_once 'Model/lobbyModel.php';
        $player1 = lobbyModel::existPlayer1();
        return $player1;
    }
    function existPlayer2()
    {
        require_once 'Model/lobbyModel.php';
        $player1 = lobbyModel::existPlayer2();
        return $player1;
    }
	include_once 'View/lobby.php';
?>