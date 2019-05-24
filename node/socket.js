let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

io.on('connection', (socket) => {

	
    console.log('Nueva conexión');
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
        console.log('no-Meta');
        socket.broadcast.emit('no-MetaP2');
    });   
});

var port =2525;

http.listen(port, function() {
    console.log('listening in http://localhost:' + port);
});