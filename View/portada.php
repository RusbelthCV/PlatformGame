<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>The Platform Game</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <link rel="stylesheet" href="View/css/login.css">
    <link rel="stylesheet" href="../View/css/login.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
</head>
<body>
    <div class="container">
        <section class="row" id="form">
            <div class="col-md-6 offset-3">
                <form action="index.php?section=login" method="post">
                    <label for="nombre" class="label-control">Correo:</label>
                    <input type="text" class="form-control" id="nombre" name="nombre">
                    <label for="pass">Contraseña:</label>
                    <input type="password" class="form-control" id="pass" name="password">
                    <a href="index.php?section=registro" class="btn btn-link" role="button">Registrarse</a>
                    <input type="submit" class="btn btn-primary envio" value="Login">
                    <div class="alert alert-danger alert-dismissible fade show mensaje" id="mensaje">
                        <button type="button" class="close" data-dismiss="alert">&times;</button>
                        <strong>Error: </strong> las credenciales no coinciden
                    </div>
                </form>
            </div>
        </section>
    </div>
  
</body>
</html>