<?php 
    
  class Usuario
  {
      private $nombre;
      private $contra;
      private $correo;
      
      function __construct($correo,$contra)
      {
          $this->correo = $correo;
          $this->contra = $contra;
      }
      
      function loguearse()
      {
          require_once '../Model/conexion.php';
          $flagInsercion = false;
          $consulta = "SELECT * FROM Usuarios WHERE Email LIKE '$this->correo' AND Password LIKE '$this->contra'";
          $ejecutar = $pdo->prepare($consulta);
          $ejecutar->execute();
          //Iniciamos la comprobación de existencias
          $numeroCoincidencias = $ejecutar->fetchColumn();
          if($numeroCoincidencias == 1)
          {
              $flagInsercion = true;
          }
          else
          {
              $flagInsercion = false;
          }
          return $flagInsercion;
      }
      function getEmail()
      {
          return $this->correo;
      }
  }

?>