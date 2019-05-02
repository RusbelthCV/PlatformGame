<?php 
    if(isset($_POST['nombre']) || isset($_POST['password']))
    {
        $correo = $_POST['nombre'];
        $password = $_POST['password'];
        if($correo != 'Bryan')
        {
            include_once'../View/portada.php';
        ?>
            <script>
                var divMensaje = document.getElementById("mensaje");
                divMensaje.style.visibility = "visible";
            </script>
            <?php
            
        }
    }
    else
    {
        include_once 'View/portada.php';    
    }
    
?>