var cursors = undefined;
var fondo;
var map;
var layer;
var player;
var sound;
var tilset;
const gameText = 
{
    vidas:4
};
var config = 
{
    type: Phaser.CANVAS,
    width: 1500,
    height: 1200,
    physics:
    {
        default: 'arcade',
        arcade:{
            gravity:{y: 300},
            debug:false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var game = new Phaser.Game(config);
const gameState = { 
    vida: 6 ,
    mov_enemigo1: "izq", //Indica la direccion del movimiento del enemigo1
    score: 0
};
var bullets;
var bulletTime=0;
var coins;
function preload()
{
    //Cargamos
    this.load.audio('musica_fondo', './assets/SariaSong.mp3');//Cargamos musica
    this.load.tilemapTiledJSON("mapa","assets/MapaLVL1.json"); //Cargamos el json del mapa
    // Cargamos todos las imagenes de los tiles del mapa
    this.load.image("tilesMapa","assets/SpriteSheet_normal.png");
    this.load.image("tileElementos","assets/spritesheet_tiles.png");
    this.load.image("tileMonedas","assets/coin.png");
    this.load.image('fondo','./assets/Fondo_arboles_verde.png');
    //Player1
    this.load.spritesheet('player','assets/Player/SpriteSheet green/player.png',{frameWidth: 500,frameHeight:714});
        //Animaciones player1
    this.load.spritesheet('player_correr','assets/Player/SpriteSheet green/correr.png',{frameWidth: 160,frameHeight:443});
    this.load.spritesheet('player_disparar','assets/Player/SpriteSheet green/Disparar.png',{frameWidth: 370,frameHeight:443});
    this.load.spritesheet('player_saltar','assets/Player/SpriteSheet green/saltoCONcaer.png',{frameWidth: 370,frameHeight:443});
    this.load.spritesheet('player_quieto','assets/Player/SpriteSheet green/quieto.png',{frameWidth: 234   ,frameHeight:442});
    //player2
    this.load.spritesheet('player2','assets/Player/SpriteSheet blue/player.png',{frameWidth: 500,frameHeight:714});
    //Bala
    this.load.image('bullet', 'assets/purple_ball.png',{frameWidth: 500,frameHeight:714});
    //enemigo
    this.load.spritesheet('enemy1','assets/enemigos/enemigo1/PNG/Idle/frame-3.png',{frameWidth: 14,frameHeight:714});
    //Vida
    this.load.spritesheet('heartP', 'assets/1vida.png',{frameWidth: 32,frameHeight:32});
}
function create()
{
//===================MOVIMIENTO RECIBIDOS DEL SERVIDOR DEL SEGUNDO PLAYER=============================
    //Detecta si el compañero a perdido vida
    
    socket.on('restarVida',()=>{
        this.scene.restart();
        this.physics.pause();
        this.add.text(180, 250, 'El otro Jugador ha perdido', { fontSize: '15px', fill: '#000000' });
        this.add.text(152, 270, 'Volveis a Iniciar', { fontSize: '15px', fill: '#000000' });

    });
    //Detecta si el compañero a perdido TODAS   las vida
    socket.on('JugadorMuere',()=>{
        this.add.text(180, 250, 'Game Over', { fontSize: '15px', fill: '#000000' });
        this.add.text(152, 270, 'Click to Restart', { fontSize: '15px', fill: '#000000' });    }); 
        socket.on('jugadorStop',()=>{
        player2.body.setVelocityX(0);
        console.log("Este jugador se ha detenido");
        //player2.anims.play('left',true);
    }); 
    //Detecta si el compañero se ha movido a la izquierda    
    socket.on('jugador-izq',()=>{
        player2.body.setVelocityX(-400);
        player2.flipX = true;
        console.log("Este jugador se mueve a la izq");
        //player2.anims.play('left',true);
    }); 
    //Detecta si el compañero se ha movido a la derecha   
    socket.on('jugador-mov-der',()=>{

        console.log("Este jugador se mueve a la derecha");
        player2.flipX = false;
        player2.body.setVelocityX(+400);
        //player2.anims.play('right',true);
    });

    //Detecta si el compañero ha saltado
    socket.on('jugador-mov-top',()=>{
        player2.body.setVelocityY(-400);        
        console.log("Este jugador abusa del fly");
    });
    //Detecta si el compañero ha disparado a la izquierda   
    socket.on('Jugador-shoot-left',()=>{
        this.bala.enableBody(true, player2.x, player2.y, true, true).setVelocity(-2000, 50);
        console.log("Dispara a la izquierda");
    });
    //Detecta si el compañero ha disparado a la derecha   

    socket.on('Jugador-shoot-right',()=>{
        this.bala.enableBody(true, player2.x, player2.y, true, true).setVelocity(2000, 50);
        console.log("Dispara a la derecha");
    });    
//============================END  MOVIMIENTO RECIBIDOS DEL SERVIDOR DEL SEGUNDO PLAYER======================

    //Iniciar musica 
    gameState.incredible=this.sound.add("musica_fondo");
    gameState.incredible.play()

//=========================AÑADIR ELEMENTOS=====================
    this.add.image(512,360,"fondo").setScale(3); // Agregamos el fondo
    //Añadimos todo lo necesario para insertar el mapa
    mapa = this.add.tilemap("mapa"); // Añadimos el mapa
    //Agregamos los tiles usados para crear el mapa en el TileMap
    var tileSetMapa = mapa.addTilesetImage("SpriteSheet_normal","tilesMapa"); // Tiles del mapa (El suelo en este caso) 
    var tileSetElementos = mapa.addTilesetImage("spritesheet_tiles","tileElementos"); //Elementos
    var tileSetMonedas = mapa.addTilesetImage("coin","tileMonedas"); //Monedas
    //Habilitamos el teclado para usarlo con los movimientos del personaje
    cursors = this.input.keyboard.createCursorKeys();

    var capaMapa = mapa.createDynamicLayer("groundLayer",tileSetMapa,0,0);
    var capaElementos = mapa.createDynamicLayer("elementos",tileSetElementos,0,0);
    var capaAgua = mapa.createDynamicLayer("agua",tileSetElementos,0,0);
    capaMonedas = mapa.createDynamicLayer("coinsLayer",tileSetMonedas,0,0);
    var capaTrampas = mapa.createDynamicLayer("trampas",tileSetElementos,0,0);
    //capaMonedas.setScale(0.7);
    //capaMonedas.y+=100;
    //capaMonedas.x+=100;



    

//======================END AÑADIR ELEMENTOS=====================

//======================JUGADOR PRINCIPAL=======================

    //JUGADOR1
    player = this.physics.add.sprite(200, 500, 'player');
    player.setScale(0.25);

    //JUGADOR 2
    player2 = this.physics.add.sprite(200, 500, 'player2');
    player2.setScale(0.25);

    //CREAMOS LA BALA 
    this.bala = this.physics.add.sprite(player.x, player.y, 'bullet');
    this.bala.disableBody(true, true);    

//=================END JUGADOR PRINCIPAL=======================
//=================START ENEMIES=============================

    enemy1 = this.physics.add.sprite(740,972,'enemy1');
    enemy1.setScale(0.08);
  

    function mover_enemigo(){
        var inicio_plataforma=750;
        var fin_plataforma=140;
        //Movimiento a la izquierda
        if(enemy1.x<=inicio_plataforma && enemy1.x>=fin_plataforma && gameState.mov_enemigo1=="izq"){
            enemy1.x-=10;
        } 
        //Detecta que ha llegado al final y cambia el sentido
         if(enemy1.x<=fin_plataforma ){
            gameState.mov_enemigo1="der";
        }
        //Movimiento a la derecha
        if(gameState.mov_enemigo1=="der"){
            //Detecta que ha llegado al comienzo de la plataforma y vuelve al inicio
            if(enemy1.x==inicio_plataforma-10){
                gameState.mov_enemigo1="izq";
            }
            enemy1.x+=10;

        }

    }
    
    //Evento de colision entre enemigo1 y el jugador principal
    this.physics.add.collider(player, enemy1, () => {
        perder_vida(this.lives);
        mov_enemigo1.destroy();
        this.physics.pause();
        //======EVENTO RESTAR GAME=====
        /*this.input.on('pointerup', () =>{
            //gameState.incredible.stop();
            this.scene.restart();   

        });*/
            this.scene.restart();   

        //======END EVENTO RESTAR GAME=====
    });
    //Fin del Evento de colision entre enemigo1 y el jugador principal

    //Crear bucle para Musica de fondo
    const banda_sonora_main = this.time.addEvent({
            delay: 36000,
            callback: reproducir_music,
            callbackScope: this,
            loop: true,
        });
    //Crear bucle para movimiento del enemigo1
    const mov_enemigo1 = this.time.addEvent({
        delay: 100,
        callback: mover_enemigo,
        callbackScope: this,
        loop: true,
    });

    //=================END ENEMIES=============================
    //=================IDE VIDA===============================
    var pos_ini_x=player.x;
    var pos_ini_y=50;
    var espacio=0;

    this.lives = this.add.group();
    if(gameState.vida==0){
        socket.emit("Jugador-Muere");
        
         this.add.text(180, 250, 'Game Over', { fontSize: '15px', fill: '#000000' });
        this.add.text(152, 270, 'Click to Restart', { fontSize: '15px', fill: '#000000' });

        //======EVENTO RESTAR GAME=====
        this.input.on('pointerup', () =>{
            gameState.incredible.stop();
            this.scene.restart(); 

        });
            //this.scene.restart();   
        
        //======END EVENTO RESTAR GAME=====
    }else{
        for(var i=0;i<gameState.vida;i++){
            this.lives.create(pos_ini_x+espacio,  pos_ini_y, 'heartP').setScrollFactor(0);
            espacio+=35;
        }
        gameState.vidaText = this.add.text(16, 16, `Vida: ${gameState.vida}`, { fontSize: '15px', fill: '#000000' });
        gameState.vidaText.setScrollFactor(0);

         //CONTADOR SCORE
        gameState.scoreText = this.add.text(200,16,`Score: ${gameState.score}`,{fontSize:"20px",fill:"#000000"});
        gameState.scoreText.setScrollFactor(0); 

    }


    
    //==================END VIDA=================================
//=============================START COLISIONES ===============================================
 
    //COLISIONES ENTRE MAPA Y JUGADORES
    capaMapa.setCollisionByProperty({Suelo:true});
    capaTrampas.setCollisionByProperty({Suelo:true});

    this.physics.add.collider(player, capaMapa);
    this.physics.add.collider(player2, capaMapa);
    //ENEMIGO-CAPA
    this.physics.add.collider(enemy1,capaMapa);


    //COLISIONES CONTRA ENEMIGOS
    this.physics.add.collider(player,enemy1);
    //this.physics.add.collider(player2,enemy1);
    //COLISIONES BALA 
        //CON EL ENEMIGO 1
        this.physics.add.collider(player,enemy1);
        this.physics.add.collider(this.bala, enemy1, () => {
        gameState.score+=50;
        gameState.scoreText.setText(`Score: ${gameState.score}`);
        enemy1.destroy();
        });

        //Colision entre el suelo y la bala 
        this.physics.add.collider(this.bala, capaMapa, () => {
            this.bala.disableBody(true, true);  
            this.bala.visible = false;
        });


        this.physics.add.collider(player, capaMapa, () => {
            alert("au!!!");
        });

        //Monedas recoger
        capaMonedas.setTileIndexCallback(1,hitCoin,this);
        this.physics.add.collider(player,capaMonedas);





//==========================END COLISIONES ======================================================
    


//===========START CAMARA========================
    this.cameras.main.setBounds(0, 0, mapa.widthInPixels, mapa.heightInPixels);
    this.cameras.main.startFollow(player);
    this.cameras.main.setBackgroundColor('#ccccff');

//============END CAMARA========================
//================================ANIMACIONES JUGADOR PRINCIPAL==============================

 this.anims.create(
    {
        key:'disparar',
        frames: this.anims.generateFrameNumbers('player_disparar',{start: 0, end: 11}),
        frameRate: 5,
        repeat: -1
    });

    this.anims.create(
    {
        key:'stop',
        frames: this.anims.generateFrameNumbers('player_quieto',{start: 0, end: 3}),
        frameRate: 5,
        repeat: -1
    });
    
    this.anims.create(
    {
        key:'run',
        frames: this.anims.generateFrameNumbers('player_correr',{start: 0, end: 6}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create(
        {
        key:'salta',
        frames: this.anims.generateFrameNumbers('player_saltar',{start: 0, end: 4}),
        frameRate: 1,
        repeat: -1
        });
//============================END ANIMACIONES JUGADOR PRINCIPAL==============================



}
function update(time,dt)
{
    if (cursors.left.isDown)
    {
        socket.emit("Jugador-Moviendose-Izq");
        player.body.setVelocityX(-400);
        player.flipX = true; // flip the sprite to the left
        player.anims.play('run',true);


    }
    else if (cursors.right.isDown)
    {
        socket.emit("Jugador-Moviendose-Der");
        player.body.setVelocityX(400);        
        player.flipX = false; 
        player.anims.play('run',true);

        //player.anims.play('right',true);

    } else {
        player.body.setVelocityX(0);
        player.anims.play('stop',true);
        socket.emit("Jugador-Stop");

    }
    // jump 
    if (cursors.up.isDown && player.body.onFloor())
    {
        socket.emit("Jugador-Moviendose-top");

        player.body.setVelocityY(-400);        
        player.anims.play('salta',true);

    }
    if(player.y>2000){
        perder_vida(this.lives);
        this.scene.restart();   
    }
    //DISPARAR
    if (cursors.down.isDown)
    {
        if(player.flipX == true){
            this.bala.enableBody(true, player.x, player.y, true, true).setVelocity(-2000, 50);
            player.anims.play('disparar',true);

            socket.emit("Jugador-Disparo-Izquierda");

        } else{
            this.bala.enableBody(true, player.x, player.y, true, true).setVelocity(2000, 50);
            player.anims.play('disparar',true);
            socket.emit("Jugador-Disparo-Derecha");


        }


    }
}
///======================================Funciones================================
//Se encarga de hacer la resta de las vidas al jugador, que el contador se actualice y lo muestre en pantalla

function perder_vida(lives){
        gameState.vida-=1;
        gameState.score=0;
        gameState.scoreText.setText(`Score: ${gameState.score}`);

        gameState.vidaText.setText(`Vida: ${gameState.vida}`);
        var array_live=lives.getChildren();
        var invader = Phaser.Utils.Array.RemoveAt(array_live,array_live.length-1);
    if (invader)
    {
        gameState.incredible.stop();
        invader.destroy();
        socket.emit("pierde-vida");
    }
    
    
}

//Reproduce la musica de fondo
function reproducir_music(){
    gameState.incredible=this.sound.add("musica_fondo");
    gameState.incredible.play()
}
function hitCoin(sprite,tile)
{
    capaMonedas.removeTileAt(tile.x,tile.y);
    gameState.score+= 20;
    gameState.scoreText.setText(`Score: ${gameState.score}`);
    return false;
}


