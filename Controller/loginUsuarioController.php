<?php 
  session_start();
  if(isset($_POST['nombre']) && isset($_POST['password']))
  {
      require_once 'Model/usuarioModel.php';
      $correoUsuario = $_POST['nombre'];
      $contraUsuario = md5($_POST['password']);
      
      $usuario = new Usuario($correoUsuario,$contraUsuario,"");
      $existencias = $usuario->loguearse();
      var_dump($existencias);
      if($existencias)
      {
        $_SESSION['usuario'] = $_POST['nombre'];
        header("Location:index.php?section=lobby");
      }
      else
      {
        include_once 'View/portada.php';
        ?>
        <script>
          var divMensaje = document.getElementById("mensaje");
          divMensaje.style.visibility = "visible";
        </script><?php
      }
  }
?>