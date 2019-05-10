<?php  
	session_start();
	if(isset($_SESSION['nombre']))
	  {?>
		<!DOCTYPE html>
		<html lang="es">
		<head>
		    <meta charset="utf-8">
		    <title>Juego</title>
		    <script src="scripts/phaser.min.js"></script>
		    <script type="text/javascript" src="scripts/principal.js"></script>
		</head>
		<body>
			<div id="bloque"></div>
			<a href="../" class="form-submit submit backB">Atrás</a>
		</body>
		</html><?php	    
	  }
	  else
	  {
	    echo "No tienes derecho a acceder aquí";
	    header("Refresh:10;url = ..");
	  }
?>