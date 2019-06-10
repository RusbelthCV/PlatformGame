
let app = require("express")();
let http = require("http").Server(app);
let io = require("socket.io")(http);
var mysql = require('mysql');
io.on('connection',function(socket)
{
    console.log("Nueva Conexión");
    socket.emit("welcome");
    
    socket.on("createLobby",function(data){

        console.log("Click on the create lobby");
        socket.emit("beginCreate");
    });
    socket.on("refresh",function()
    {
        console.log("refresh");
        socket.broadcast.emit('actualizar');
    });
    socket.on("redireccionar",function()
    {
        console.log("redirecciono");
        socket.broadcast.emit('redirect');
    });
 socket.on('Jugador-Moviendose-Izq', () =>{
        console.log('izquierda');
        socket.broadcast.emit('jugador-izq');
    });
    
    socket.on('Jugador-Moviendose-Der', () =>{
        console.log('derecha');
        socket.broadcast.emit('jugador-mov-der');
    });
    socket.on('Jugador-Moviendose-top', () =>{
        console.log('fly');
        socket.broadcast.emit('jugador-mov-top');
    });
    socket.on('Jugador-Stop', () =>{
        //console.log('STOP');
        socket.broadcast.emit('jugadorStop');
    });
    socket.on('pierde-vida', () =>{
        console.log('jugador pierde vida');
        socket.broadcast.emit('restarVida');
    });
    socket.on('Jugador-Muere', () =>{
        console.log('jugador muere');
        socket.broadcast.emit('JugadorMuere');
    });
    socket.on('Jugador-Disparo-Izquierda', () =>{
        console.log('Jugador ha disparado  a la Izquierda');
        socket.broadcast.emit('Jugador-shoot-left');
    });
    socket.on('Jugador-Disparo-Derecha', () =>{
        console.log('Jugador ha disparado  a la Derecha');
        socket.broadcast.emit('Jugador-shoot-right');
    });  

    socket.on('Predator-muere', () =>{
        //console.log('Predator-muere');
        socket.broadcast.emit('PredatorMuere');
    });   
    socket.on('Meta', () =>{
        console.log('Meta');
        socket.broadcast.emit('MetaP2');
    });      
      socket.on('No-Meta', () =>{
        //console.log('no-Meta');
        socket.broadcast.emit('no-MetaP2');
    });   
    socket.on('Dino-muere', () =>{
        //console.log('Dino-muere');
        socket.broadcast.emit('DinoMuere');
    });     
});
var port = 8000;

http.listen(port, function() {
    console.log('listening in http://localhost:' + port);
});

/*function insert(user)
{
    var obj = creaObjetoAjax();
    alert("KLK");
    var url = "Controller/lobbyController.php?user="+user;
    obj.open("GET",url,true);
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
}*/