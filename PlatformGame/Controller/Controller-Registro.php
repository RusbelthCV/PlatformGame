<?php
	require_once("Model/usuarioModel.php");
		$mensajeError="";

	if (!empty($_POST["name"]) &&!empty($_POST["email"]) && !empty($_POST["password"])) {
		$username=$_POST["name"];
		$pass=$_POST ["password"];
		$correo=$_POST["email"];
	    
		$newUser = new Usuario($correo,$pass,$username);
		$flag=$newUser->comprobar_existencia();
		if(!$flag){
		$newUser->insertar_usuario();
		}
		else{
			$mensajeError=" <div style='background-color: red;height: 50px;border-radius: 20px;text-align: center; font-size: 22px;font-weight: bold;vertical-align: middle; width:700px;''>
                <p style='position: relative;top: 10px;'>El Usuario ya existe</p>
            </div>";
		}

	}

	include_once "View/registro.php";

?>



