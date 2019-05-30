<?php 
    class lobbyModel
    {
        function __constructor(){
            
        }
        //Función para comprobar si hay alguna sala
        static function rooms(){
            require 'conexion.php';
            $consulta = "SELECT * FROM sala";
            $ejecutar = $pdo->prepare($consulta);
            $ejecutar->execute();
            
            $existencias = $ejecutar->fetchAll(PDO::FETCH_ASSOC);
            
            return $existencias;
        }
        //Obtención del propietario de la sala
        static function owner()
        {
            require 'conexion.php';
            $consulta = "SELECT id FROM sala";
            $ejecutar = $pdo->prepare($consulta);
            $ejecutar->execute();
            
            $owner = $ejecutar->fetchAll(PDO::FETCH_ASSOC);
            if(count($owner) > 0)
            {
                return $owner[0]['id'];    
            }
            else
            {
                return "";
            }
            
        }
        static function existPlayer1()
        {
            require 'conexion.php';
            $consulta = "SELECT player1 FROM sala";
            $ejecutar = $pdo->prepare($consulta);
            $ejecutar->execute();
            
            $player = $ejecutar->fetchAll(PDO::FETCH_ASSOC);
            if(count($player) > 0)
            {
                return $player[0]['player1'];    
            }
            else
            {
                return "";
            }
        }
        static function existPlayer2()
        {
            require 'conexion.php';
            $consulta = "SELECT player2 FROM sala";
            $ejecutar = $pdo->prepare($consulta);
            $ejecutar->execute();
            
            $player = $ejecutar->fetchAll(PDO::FETCH_ASSOC);
            if(count($player) > 0)
            {
                return $player[0]['player2'];    
            }
            else
            {
                return "";
            }
        }
        //Función para insertar una sala
        static function insertData($user)
        {
            require 'conexion.php';
            $consulta = "INSERT INTO sala(id,player1) VALUES('$user',1)";
            $ejecutar = $pdo->prepare($consulta);
            $ejecutar->execute();
        }
        static function insertPlayer2($mode,$owner)
        {
            require 'conexion.php';
            $consulta = "UPDATE sala SET player2 = '$mode' WHERE id = '$owner'";
            $ejecutar = $pdo->prepare($consulta);
            $ejecutar->execute();   
        }
        static function deleteSala()
        {
            require 'conexion.php';
            $consulta = "DELETE FROM `sala`";
            $ejecutar = $pdo->prepare($consulta);
            $ejecutar->execute();   
        }
        static function insertarScore($puntos,$user){
            require 'conexion.php';
            $consulta = "INSERT INTO `score` (`id`, `usuario`, `puntos`) VALUES (NULL, '".$user."', '".$puntos."')";
            $ejecutar = $pdo->prepare($consulta);
            $ejecutar->execute(); 

        }
    }
    

?>