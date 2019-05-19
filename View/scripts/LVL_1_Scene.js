class LVL_1_Scene extends Phaser.Scene {
	constructor(){
		super({ key: 'LVL_1_Scene' })
    }

     preload()
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
        //enemigo azul 
        this.load.spritesheet('enemy1','assets/enemigos/enemigo1/enemy1.png',{frameWidth: 587,frameHeight:691});
        //Cubo de pinchos
        this.load.spritesheet('cubo','assets/enemigos/Cubo/cubo_sprite.png',{frameWidth: 133,frameHeight:128});
    
    
        //Vida
        this.load.spritesheet('heartP', 'assets/1vida.png',{frameWidth: 32,frameHeight:32});
    }
     create()
    {
    gameState.bajar=true;
    
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
            this.player2.body.setVelocityX(0);
            console.log("Este jugador se ha detenido");
            //player2.anims.play('left',true);
        }); 
        //Detecta si el compañero se ha movido a la izquierda    
        socket.on('jugador-izq',()=>{
            this.player2.body.setVelocityX(-400);
            this.player2.flipX = true;
            console.log("Este jugador se mueve a la izq");
            //player2.anims.play('left',true);
        }); 
        //Detecta si el compañero se ha movido a la derecha   
        socket.on('jugador-mov-der',()=>{
    
            console.log("Este jugador se mueve a la derecha");
            this.player2.flipX = false;
            this.player2.body.setVelocityX(+400);
            //player2.anims.play('right',true);
        });
    
        //Detecta si el compañero ha saltado
        socket.on('jugador-mov-top',()=>{
            this.player2.body.setVelocityY(-400);        
            console.log("Este jugador abusa del fly");
        });
        //Detecta si el compañero ha disparado a la izquierda   
        socket.on('Jugador-shoot-left',()=>{
            this.bala.enableBody(true, this.player2.x, this.player2.y, true, true).setVelocity(-2000, 50);
            console.log("Dispara a la izquierda");
        });
        //Detecta si el compañero ha disparado a la derecha   
    
        socket.on('Jugador-shoot-right',()=>{
            this.bala.enableBody(true, this.player2.x, this.player2.y, true, true).setVelocity(2000, 50);
            console.log("Dispara a la derecha");
        });    
    //============================END  MOVIMIENTO RECIBIDOS DEL SERVIDOR DEL SEGUNDO PLAYER======================
    
        //Iniciar musica 
        gameState.incredible=this.sound.add("musica_fondo");
        gameState.incredible.play()
    
    //=========================AÑADIR ELEMENTOS=====================
        this.add.image(512,360,"fondo").setScale(3); // Agregamos el fondo
        //Añadimos todo lo necesario para insertar el mapa
        this.mapa = this.add.tilemap("mapa"); // Añadimos el mapa
        //Agregamos los tiles usados para crear el mapa en el TileMap
        var tileSetMapa = this.mapa.addTilesetImage("SpriteSheet_normal","tilesMapa"); // Tiles del mapa (El suelo en este caso) 
        var tileSetElementos = this.mapa.addTilesetImage("spritesheet_tiles","tileElementos"); //Elementos
        var tileSetMonedas = this.mapa.addTilesetImage("coin","tileMonedas"); //Monedas
        //Habilitamos el teclado para usarlo con los movimientos del personaje
        cursors = this.input.keyboard.createCursorKeys();
    
         this.capaMapa = this.mapa.createDynamicLayer("groundLayer",tileSetMapa,0,0);
        var capaElementos =this.mapa.createDynamicLayer("elementos",tileSetElementos,0,0);
        var capaAgua = this.mapa.createDynamicLayer("agua",tileSetElementos,0,0);
        this.capaMonedas = this.mapa.createDynamicLayer("coinsLayer",tileSetMonedas,0,0);
        var capaTrampas =this.mapa.createDynamicLayer("trampas",tileSetElementos,0,0);
        //capaMonedas.setScale(0.7);
        //capaMonedas.y+=100;
        //capaMonedas.x+=100;
    
    
    
        
    
    //======================END AÑADIR ELEMENTOS=====================
    
    //======================JUGADOR PRINCIPAL=======================
    
        //JUGADOR1
        player = this.physics.add.sprite(200, 900, 'player');
        player.setScale(0.25);
    
        //JUGADOR 2
        this.player2 = this.physics.add.sprite(200, 900, 'player2');
        this.player2.setScale(0.25);
    
        //CREAMOS LA BALA 
        this.bala = this.physics.add.sprite(player.x, player.y, 'bullet');
        this.bala.disableBody(true, true);    
    
    //=================END JUGADOR PRINCIPAL=======================
    //=================START ENEMIES=============================
        
    this.enemy1 = this.physics.add.sprite(2390,972,'enemy1');
    this.enemy1.setScale(0.08);
        //Cubo con pinchos
        this.pos_cubo_X=740;
        this.altura_cubo=490;
        this.enemy_cubo = this.physics.add.sprite(this.pos_cubo_X,this.altura_cubo,'cubo');
        this.enemy_cubo.body.allowGravity = false;
            
    
    
    
    
        
      
    
        function mover_enemigo(){
            var inicio_plataforma=2390;
            var fin_plataforma=1670;
            //Movimiento a la izquierda
            if(this.enemy1.x<=inicio_plataforma && this.enemy1.x>=fin_plataforma && gameState.mov_enemigo1=="izq"){
                this.enemy1.x-=10;
            } 
            //Detecta que ha llegado al final y cambia el sentido
             if(this.enemy1.x<=fin_plataforma ){
                gameState.mov_enemigo1="der";
                this.enemy1.anims.play('grande',true);
    
                this.enemy1.setScale(0.125);
            }
            //Movimiento a la derecha
            if(gameState.mov_enemigo1=="der"){
                //Detecta que ha llegado al comienzo de la plataforma y vuelve al inicio
                if(this.enemy1.x==inicio_plataforma-10){
                    gameState.mov_enemigo1="izq";
                    this.enemy1.anims.play('pequeño',true);
                    this.enemy1.setScale(0.08);
    
                }
                this.enemy1.x+=10;
    
            }
    
        }
        
        //Evento de colision entre enemigo1 y el jugador principal
        this.physics.add.collider(player, this.enemy1, () => {
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
        this.capaMapa.setCollisionByProperty({Suelo:true});
        capaTrampas.setCollisionByProperty({Solido:true});
    
        this.physics.add.collider(player, this.capaMapa);
    
        this.physics.add.collider(this.player2, this.capaMapa);
        //ENEMIGO-CAPA
        this.physics.add.collider(this.enemy1,this.capaMapa);
        
        this.physics.add.collider(this.enemy_cubo,this.capaMapa);
    
    //===========================================
        this.physics.add.collider(player, capaTrampas,()=>{
        });
    
    
        //COLISIONES CONTRA ENEMIGOS
        this.physics.add.collider(player, this.enemy_cubo,()=>{
            perder_vida(this.lives);
            this.physics.pause();
            this.scene.restart();   
        } );
    
        //this.physics.add.collider(player2,enemy1);
        //COLISIONES BALA 
            //CON EL ENEMIGO 1
            this.physics.add.collider(player,this.enemy1);
            this.physics.add.collider(this.bala, this.enemy1, () => {
            gameState.score+=50;
            gameState.scoreText.setText(`Score: ${gameState.score}`);
            this.enemy1.destroy();
            mov_enemigo1.destroy();
    
            });
            //Con el enemigo cubo de pinchos
            this.physics.add.overlap(this.bala, this.enemy_cubo, () => {
                this.bala.disableBody(true, true);  
                this.bala.visible = false;
             
    
    
            });
      
    
            //=======================================================
            //Colision entre el suelo y la bala 
            this.physics.add.collider(this.bala, this.capaMapa, () => {
                this.bala.disableBody(true, true);  
                this.bala.visible = false;
    
            });
    
            //Monedas recoger
            this.capaMonedas.setTileIndexCallback(1,hitCoin,this);
            this.physics.add.collider(player,this.capaMonedas);
    
            
    
    
    
    //==========================END COLISIONES ======================================================
        
    
    
    //===========START CAMARA========================
        this.cameras.main.setBounds(0, 0, this.mapa.widthInPixels, this.mapa.heightInPixels);
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
    //============================START OTRAS ANIMACIONES /ENEMIGOS/OBJETOS======================
            // START ANIMACION CUBO
            this.anims.create(
            {
                key:'baja_cubo',
                frames: this.anims.generateFrameNumbers('cubo',{start: 1, end: 1}),
                frameRate: 1,
                repeat: -1
            });
            this.anims.create(
            {
                key:'cubo_normal',
                frames: this.anims.generateFrameNumbers('cubo',{start: 0, end: 0}),
                frameRate: 1,
                repeat: -1
            });
            //END ANIMACION CUBO
          
            this.anims.create(
                {
                    key:'pequeño',
                    frames: this.anims.generateFrameNumbers('enemy1',{start: 0, end: 0}),
                    frameRate: 1,
                    repeat: -1
                });
            this.anims.create(
            {
                key:'grande',
                frames: this.anims.generateFrameNumbers('enemy1',{start: 1, end: 1}),
                frameRate: 1,
                repeat: -1
            });
    
    //============================END OTRAS ANIMACIONES /ENEMIGOS/OBJETOS======================
    
    }
     update(time,dt)
    {
    
    //======================== START MOVIMIENTO CUBO=====================
        var primer_plataformaY=950;//altura en Y de la primera plataforma
        var velocidad_cubo=300;//Velocidad de bajada/subida del cubo
        //Si el jugador se acerca a cierta distancia y ademas el cubo esta dispuesto a bajar por la variable
        //gameState "bajar", ademas si se acerca el Jugador 2 tambien bajara
        if((player.x<=this.pos_cubo_X && player.x>=this.pos_cubo_X-150) &&gameState.bajar==true ||(this.player2.x<=this.pos_cubo_X && this.player2.x>=this.pos_cubo_X-150)){
            this.enemy_cubo.body.setVelocityY(velocidad_cubo);
            this.enemy_cubo.anims.play('baja_cubo',true);
            //Detecta si el cubo a llegado a la plataforma y deja su velocidad en 0 para evitar conflicto de movimiento
            if(this.enemy_cubo.y>=primer_plataformaY){
                this.enemy_cubo.anims.play('cubo_normal',true);
                this.enemy_cubo.body.setVelocityY(velocidad_cubo*0);
            }
        }
        //Detecta si llega a la plataforma y cambia  el boleano de bajar a false
        if(this.enemy_cubo.y>=primer_plataformaY){
            gameState.bajar=false;
        }
        //Al estar desactivado bajar con "false" el cubo empezara a subir
        if(gameState.bajar==false){
            this.enemy_cubo.anims.play('cubo_normal',true);
            this.enemy_cubo.body.setVelocityY(-velocidad_cubo);
            //Detecta si el cubo a regresado a su posicion original y deja su velocidad en 0
            if(this.enemy_cubo.y<=this.altura_cubo){
                gameState.bajar=true;
                this.enemy_cubo.body.setVelocityY(velocidad_cubo*0);
            }
        }
    //======================== END MOVIMIENTO CUBO=====================
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
    
    /*
    
    function reproducir_music(){
        gameState.incredible=this.sound.add("musica_fondo");
        gameState.incredible.play()
    }
    */




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