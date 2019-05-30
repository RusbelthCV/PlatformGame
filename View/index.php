<?php  
	session_start();

	if(isset($_SESSION['usuario']))
	  {?>
		<!DOCTYPE html>
		<html lang="es">
		<head>
		    <meta charset="utf-8">
		    <title>Juego</title>
		    <script src="scripts/phaser.js"></script>
		    <!--<script type="text/javascript" src="scripts/principal.js"></script>-->
		    <script type="text/javascript" src="scripts/GameOver_Scene1.js"></script>
	        <script type="text/javascript" src="scripts/GameOver_Scene2.js"></script>
		    <script type="text/javascript" src="scripts/LVL_2_Scene.js"></script>
		    <script type="text/javascript" src="scripts/LVL_1_Scene.js"></script>
		    <script type="text/javascript" src="scripts/main3.js"></script>
			<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.1/socket.io.dev.js"></script>
	<script>

        const socket = io('http://localhost:8000'); //Casa


    </script>
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