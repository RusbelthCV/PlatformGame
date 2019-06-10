<?php session_start(); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Lobby</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.1/socket.io.dev.js"></script>
    <link rel="stylesheet" href="View/css/lobby.css">
    <script>
        //const socket = io('http://192.168.12.199:2525'); //Clases
        const socket = io('http://localhost:8000'); //Casa

    </script>
</head>
<body>
    <div class="container">
        <div class="row">
            <div class="col-sm">
                <div class="container">
                    <h1 class="display-1">Lobby</h1>
                    <p id="mensaje" class="display-2"></p>
                    <button type="button" class="btn btn-info" id="<?php echo $_SESSION['usuario']; ?>">Crear Sala</button>
                </div>
                <div id="sala" class="container lobby">
                    <p id="owner" class="display-3"> 
                        <?php 
                            $rooms = salasExists();
                            if(count($rooms) > 0)
                            {
                                $owner = owner();
                                echo $owner;
                            }
                            else
                            {
                                $owner = "";
                            }
                        ?>
                    </p>
                    <p id="player1" class="display-4"> 
                        <?php 
                            $player1 = existPlayer1();
                            if($player1 > 0)
                            {
                                $estado = "Listo";
                            }
                            else
                            {
                                $estado = "Esperando a jugador...";
                            }
                            if(count($rooms) == 0)
                            {
                                $estado = "";
                            }
                            echo $estado;
                        
                        ?>
                    </p>
                    <p id="player2" class="display-4">
                         <?php 
                            $player2 = existPlayer2();
                            if($player2 > 0)
                            {
                                $estadoPlayer2 = "Listo";
                            }
                            else
                            {
                                $estadoPlayer2 = "Esperando a jugador...";
                            }
                            if(count($rooms) == 0)
                            {
                                $estadoPlayer2 = "";
                            }
                            echo $estadoPlayer2;
                        
                        ?>
                    </p>
                    <?php 
                        /*Botones que permiten accesos.
                        El  que crea la sala ocupará el sitio del jugador 1 
                        Podrás acceder al juego siempre y cuando se haya ocupado el sitio del jugador 1 y 2 
                        Podrás acceder a la sala siempre y cuando no seas el propietario 
                        Una vez estés en la sala no podrás hacer nada más, sólo esperar. 
                        Una única comprobación para el jugador 2 
                        
                        */
                        if($owner != $_SESSION['usuario'] && $estadoPlayer2 == "Esperando a jugador...")
                        {?>
                           <button type="button" class="btn btn-info" onclick="entrarSala();">Entrar a la sala</button> <?php
                        }
                        else if($owner != $_SESSION['usuario'] && $estadoPlayer2 == "Listo")
                        {?>
                           <button type="button" class="btn btn-info">Jugar</button> <?php
                        }
                        else if($owner == $_SESSION['usuario'] && $estadoPlayer2 == "Esperando a jugador...")
                        {?>
                            <p>Esperando al segundo jugador</p><?php
                        }
                        else if($estado == "Listo" && $estadoPlayer2 == "Listo")
                        {?>
                            <button type="button" class="btn btn-info">Jugar</button> <?php
                        }
                    ?>
                </div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        socket.on("welcome",function()
        {
            //Mostrar salas existentes
            var lobby = document.getElementById("sala");
            //mensaje en la consola para comprobar la conexión.
            console.log("Bienvenido");
            //Obtención de la etiqueta p para mostrar el mensaje de bienvenida según el usuario.
            var welcome = document.getElementById("mensaje");
            //Relleno de la etiqueta p
            welcome.innerHTML = "<?php echo 'Bienvenido a la Lobby '.$_SESSION['usuario']; ?>";
            
            //Obtención de la etiqueta button para poder darle un evento
            var button = document.getElementsByTagName("button")[0];
            //Agregamos el evento al escuchador, en este caso el botón
        socket.on("actualizar",function()
        {
            location.reload();
        });

            button.addEventListener("click",function()
            {
                socket.emit("createLobby");    
                insert();
                socket.emit("refresh");    

            });
        });
        socket.on("beginCreate",function()
        {
            console.log("Holita al crear");

        });

        socket.on("redirect",function(data)
        {
			EliminarSala();
            console.log(data);
            window.location.href = "View/index.php";
        });

        function insert()
        {
            var sala = document.getElementById("sala");
            var obj = creaObjetoAjax();
            var url = "index.php?section=lobby&user=<?php echo $_SESSION['usuario']; ?>";
            obj.open("GET",url,true);
            obj.onreadystatechange = function()
            {
                
                if(obj.readyState == 4 && obj.status == 200)
                {   
                    var coincidencias = obj.responseText;
                    sala.innerHTML = coincidencias;
                }
                else
                {}
            }
            obj.send();
        }
        function creaObjetoAjax() 
        { 
            var obj;
            if(window.XMLHttpRequest) 
             {
                obj=new XMLHttpRequest();
             }
             else 
             { 
                obj=new ActiveXObject(Microsoft.XMLHTTP);
                 
             }
             return obj;
        }
        function entrarSala()
        {
            var sala = document.getElementById("player2");
            var obj = creaObjetoAjax();
            var url = "index.php?section=lobby&player2=1&user=<?php echo $owner; ?>";
            obj.open("GET",url,true);
            obj.onreadystatechange = function()
            {
                
                if(obj.readyState == 4 && obj.status == 200)
                {   
                    var coincidencias = obj.responseText;
                    sala.innerHTML = "Listo";
                    socket.emit("redireccionar");
                    EliminarSala();
                    window.location.href="View/index.php";
                }
                else
                {}
            }
            obj.send();
        }
        function EliminarSala()
        {
            var obj = creaObjetoAjax();
            var url = "index.php?section=lobby&eliminar=true";
            obj.open("GET",url,true);
            obj.onreadystatechange = function()
            {
                
                if(obj.readyState == 4 && obj.status == 200)
                {   
                    var coincidencias = obj.responseText;
                }
                else
                {}
            }
            obj.send();
        }        
    </script>
</body>
</html>