<?php 
    
  class Usuario
  {
      private $nombre;
      private $contra;
      private $correo;
      
      function __construct($correo,$contra,$nombre)
      {
          $this->correo = $correo;
          $this->contra = $contra;
          $this->nombre=$nombre;
      }
      
      function loguearse()
      {
          require_once 'Model/conexion.php';
          $flagInsercion = false;
          $consulta = "SELECT count(*) FROM usuario WHERE Email LIKE '$this->correo' AND Password LIKE '$this->contra'";
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

      function comprobar_existencia(){
        try {

            include 'conexion.php';
            $stmt = $pdo->prepare("SELECT Email FROM usuario WHERE Email = ? ");
            $stmt->execute( array($this ->correo));
            $row=$stmt->fetch(PDO::FETCH_ASSOC);
            if ($row) {
              $message = " El usuario ya existe en la BD";
              echo "<script type='text/javascript'>alert('$message');</script>";
              $flag=true;

            }else{
            //echo"<div><p>Datos incorrectos</p></div>";
            //$message = "Los campos son invalidos, no existen";
            //echo "<script type='text/javascript'>alert('$message');</script>";
              $flag=false;
            }              
          }catch(PDOExecption $e) {
                  print "Error!: " . $e->getMessage() . " deshacer</br>";
            }
        return $flag;
      }

///----------------------------END  function----------------------------------------------------
    
    function insertar_usuario(){
      try {
          include 'conexion.php';
          $stmt = $pdo->prepare("SELECT Email FROM usuario WHERE Email = ?");
          $stmt->execute( array($this ->correo));
          if ($stmt->fetch(PDO::FETCH_ASSOC)) {
          }else{
          $stmt = $pdo->prepare("INSERT INTO usuario(`Email`,`Nombre`,`Password`) VALUES(?,?,MD5(?))");
          $stmt->execute(array($this->correo,$this->nombre,$this->contra));
          }
        
              }catch(PDOExecption $e) {
          print "Error!: " . $e->getMessage() . " deshacer</br>";
          }

      }      
  }

?>