<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Sign Up Form by Colorlib</title>
    <link rel="stylesheet" href="View/fonts/material-icon/css/material-design-iconic-font.min.css">
    <link rel="stylesheet" href="View/css/registro.css">
</head>
<body>

    <div class="main">

        <div class="container">
            <div class="signup-content">
                <form  action="index.php?section=registro" method="POST"  id="signup-form" class="signup-form">
                    <h2>Registro</h2>
                    
                    <div class="form-group">
                        <input type="text" class="form-input" name="name" id="name" placeholder="Nombre"/>
                    </div>
                    <div class="form-group">
                        <input type="email" class="form-input" name="email" id="email" placeholder="Email"/>
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-input" name="password" id="password" placeholder="Password"/>
                        <span toggle="#password" class="zmdi zmdi-eye field-icon toggle-password"></span>
                    </div>
                    
                    <div class="form-group">
                        <input type="submit" name="submit" id="submit" class="form-submit submit" value="Sign up"/>
                    </div>
                </form>
            </div>
        </div>

    </div>
    <script src="View/vendor/jquery/jquery.min.js"></script>
    <script src="View/js/main.js"></script>
</body>
</html>