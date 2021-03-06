class LVL_2_Scene extends Phaser.Scene {
	constructor(){
		super({ key: 'LVL_2_Scene' });
    }



     preload(){
        this.load.audio('musica_fondo', './assets/SariaSong.mp3');//Cargamos musica
		 this.load.tilemapTiledJSON("mapa","assets/MapaLvl2.json"); //Cargamos el json del mapa
        // Cargamos todos las imagenes de los tiles del mapa
        this.load.image("tilesMapa","assets/Winter_ground.png");
        this.load.image("tileElementos","assets/spritesheet_tiles.png");
        this.load.image("tileMonedas","assets/coin.png");
        this.load.image('fondo','./assets/Fondo_arboles_verde.png');
        //Player1
        this.load.spritesheet('player','assets/Player/SpriteSheet green/player.png',{frameWidth: 500,frameHeight:714});
            //Animaciones player1
        this.load.spritesheet('player_correr','assets/Player/SpriteAlienGreen/run.png',{frameWidth: 218,frameHeight:433});
        this.load.spritesheet('player_disparar','assets/Player/SpriteAlienGreen/dispara.png',{frameWidth: 486,frameHeight:429.54});
        this.load.spritesheet('player_saltar','assets/Player/SpriteAlienGreen/salta.png',{frameWidth: 266,frameHeight:449.3});
        this.load.spritesheet('player_quieto','assets/Player/SpriteAlienGreen/quieto.png',{frameWidth: 235   ,frameHeight:435.33});
        //player2
        this.load.spritesheet('player2_correr','assets/Player/SpriteAlienBlue/run.png',{frameWidth: 218,frameHeight:433});
        this.load.spritesheet('player2_disparar','assets/Player/SpriteAlienBlue/Dispara.png',{frameWidth: 486,frameHeight:438.6363});
        this.load.spritesheet('player2_saltar','assets/Player/SpriteAlienBlue/salta.png',{frameWidth: 266,frameHeight:449.3});
        this.load.spritesheet('player2_quieto','assets/Player/SpriteAlienBlue/quieto.png',{frameWidth: 235   ,frameHeight:435.33});
        //Bala
        this.load.image('bullet', 'assets/purple_ball.png',{frameWidth: 500,frameHeight:714});
        //Puente
        this.load.spritesheet('puente', 'assets/puente.png',{frameWidth: 116,frameHeight:28});
        //Trex
        this.load.spritesheet('dino','assets/enemigos/T-rex/walk.png',{frameWidth: 380,frameHeight:420});
        this.load.spritesheet('dino_salta','assets/enemigos/T-rex/saltar.png',{frameWidth: 460,frameHeight:472});
        this.load.spritesheet('dino_muere','assets/enemigos/T-rex/morir.png',{frameWidth: 680,frameHeight:472});//680


        this.load.spritesheet('fireball','assets/enemigos/T-rex/fireball.png',{frameWidth: 460,frameHeight:472});
        //Vida
        this.load.spritesheet('heartP', 'assets/1vida.png',{frameWidth: 32,frameHeight:32});
     }
     create(){


    gameState.speed1 = Phaser.Math.GetSpeed(1500, 3);


     	   //Iniciar musica 
        gameState.incredible=this.sound.add("musica_fondo");
        gameState.incredible.play()
//===================MOVIMIENTO RECIBIDOS DEL SERVIDOR DEL SEGUNDO PLAYER=============================
        //Detecta si el compañero a perdido vida
        
        socket.on('restarVida',()=>{
            gameStatePredator.vida=20;   
            gameStatePredator.vivo=true;
            this.scene.restart();
            this.physics.pause();
            this.add.text(180, 250, 'El otro Jugador ha perdido', { fontSize: '15px', fill: '#000000' });
            this.add.text(152, 270, 'Volveis a Iniciar', { fontSize: '15px', fill: '#000000' });
    
        });
        //Detecta si el compañero a perdido TODAS   las vida
        socket.on('JugadorMuere',()=>{
            this.add.text(180, 250, 'Game Over', { fontSize: '15px', fill: '#000000' });
            this.add.text(152, 270, 'Click to Restart', { fontSize: '15px', fill: '#000000' });    
        }); 
        socket.on('jugadorStop',()=>{
            this.player2.body.setVelocityX(0);
            this.player2.anims.play('stop2',true);
            console.log("Este jugador se ha detenido");
            //player2.anims.play('left',true);
        }); 
        //Detecta si el compañero se ha movido a la izquierda    
        socket.on('jugador-izq',()=>{
            this.player2.body.setVelocityX(-400);
            this.player2.flipX = true;
            console.log("Este jugador se mueve a la izq");
            this.player2.anims.play('run2',true);

            //player2.anims.play('left',true);
        }); 
        //Detecta si el compañero se ha movido a la derecha   
        socket.on('jugador-mov-der',()=>{
    
            console.log("Este jugador se mueve a la derecha");
            this.player2.flipX = false;
            this.player2.body.setVelocityX(+400);
            //player2.anims.play('right',true);
            this.player2.anims.play('run2',true);

        });
    
        //Detecta si el compañero ha saltado
        socket.on('jugador-mov-top',()=>{
            this.player2.body.setVelocityY(-600);        
            this.player2.anims.play('salta2',true);
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
        socket.on('DinoMuere',()=>{

            gameStateDino.vivo=false;


        });         

        
    //============================END  MOVIMIENTO RECIBIDOS DEL SERVIDOR DEL SEGUNDO PLAYER======================        
    //=========================AÑADIR ELEMENTOS=====================
     	//Añadimos todo lo necesario para insertar el mapa
        this.mapa = this.add.tilemap("mapa"); // Añadimos el mapa
        //Agregamos los tiles usados para crear el mapa en el TileMap
        var tileSetMapa = this.mapa.addTilesetImage("Winter_ground","tilesMapa"); // Tiles del mapa (El suelo en este caso) 
        var tileSetElementos = this.mapa.addTilesetImage("spritesheet_tiles","tileElementos"); //Elementos 
        var tileSetMonedas = this.mapa.addTilesetImage("coin","tileMonedas"); //Monedas
        //Habilitamos el teclado para usarlo con los movimientos del personaje
        cursors = this.input.keyboard.createCursorKeys();
     	this.capaMapa = this.mapa.createDynamicLayer("groundLayer",tileSetMapa,0,0);
        this.capaElementos =this.mapa.createDynamicLayer("Botones",tileSetElementos,0,0);
        this.capaLava = this.mapa.createDynamicLayer("Lava",tileSetElementos,0,0);
        this.capaMonedas = this.mapa.createDynamicLayer("coinLayer",tileSetMonedas,0,0);
    //======================END AÑADIR ELEMENTOS=====================

    //======================JUGADOR PRINCIPAL=======================
     //JUGADOR1
        player = this.physics.add.sprite(50, 1875, 'player');//12200
        player.setScale(0.25);
        //JUGADOR 2
        this.player2 = this.physics.add.sprite(50, 1875, 'player2_quieto');
        this.player2.setScale(0.25);
        //CREAMOS LA BALA 
        this.bala = this.physics.add.sprite(player.x, player.y, 'bullet');
        this.bala.disableBody(true, true);   
  //=================END JUGADOR PRINCIPAL=======================
  //DINO
        gameStateDino.animacion=true;
        this.dino = this.physics.add.sprite(4500, 1500, 'dino_salta');
        this.dino.flipX=true;
        gameStateDino.fuego = this.physics.add.sprite(3500, 2500, 'fireball').setScale(.3).setOrigin(0);
        gameStateDino.fuego1 = this.physics.add.sprite(3500, 2500, 'fireball').setScale(.3).setOrigin(0);
        gameStateDino.fuego2 = this.physics.add.sprite(3500, 2500, 'fireball').setScale(.3).setOrigin(0);
        gameStateDino.dino=this.dino;
        gameStateDino.MensajeText = this.add.text(3240, 1350, `Vida del T-rex`, { fontSize: '30px', fill: '#000000' });
        gameStateDino.vidaText = this.add.text(3400, 1380, `x: ${gameStateDino.vida}`, { fontSize: '30px', fill: '#000000' });
         gameStateDino.dino.setSize(400,400);
      //END DINO
     //================================ANIMACIONES JUGADOR PRINCIPAL==============================
     this.anims.create(
        {
            key:'disparar',
            frames: this.anims.generateFrameNumbers('player_disparar',{start: 6, end: 11}),
            frameRate: 3,
            repeat: -1
        });
    
        this.anims.create(
        {
            key:'stop',
            frames: this.anims.generateFrameNumbers('player_quieto',{start: 0, end: 3}),
            frameRate: 3,
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
    //============================Start ANIMACIONES JUGADOR 2==============================
     this.anims.create(
        {
            key:'disparar2',
            frames: this.anims.generateFrameNumbers('player2_disparar',{start: 5, end: 11}),
            frameRate: 0.5,
            repeat: 1
        });
    
        this.anims.create(
        {
            key:'stop2',
            frames: this.anims.generateFrameNumbers('player2_quieto',{start: 0, end: 3}),
            frameRate: 3,
            repeat: -1
        });
        
        this.anims.create(
        {
            key:'run2',
            frames: this.anims.generateFrameNumbers('player2_correr',{start: 0, end: 6}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create(
            {
            key:'salta2',
            frames: this.anims.generateFrameNumbers('player2_saltar',{start: 2, end: 3}),
            frameRate: 1,
            repeat: -1
            });

    //============================END ANIMACIONES JUGADOR 2==============================
    //Animacion DinoSaurio 
        this.anims.create(
            {
            key:'dino_salta',
            frames: this.anims.generateFrameNumbers('dino_salta',{start: 0, end: 11}),
            frameRate: 5,
            repeat: -1
            });
            this.anims.create(
            {
            key:'dino_muere',
            frames: this.anims.generateFrameNumbers('dino_muere',{start: 0, end: 8}),
            frameRate: 3,
            repeat: 0
            });
    //===========START CAMARA========================
        this.cameras.main.setBounds(0, 0, this.mapa.widthInPixels, this.mapa.heightInPixels);
        this.cameras.main.startFollow(player);
        this.cameras.main.setBackgroundColor('#ccccff');
    
    //============END CAMARA========================
   //=============================START COLISIONES ===============================================
        //COLISIONES ENTRE MAPA Y JUGADORES
        this.capaMapa.setCollisionByProperty({Suelo:true});
        this.capaLava.setCollisionByProperty({muerte:true});
        this.physics.add.collider(gameStateDino.fuego, this.capaMapa);
        this.physics.add.collider(player, this.capaMapa);
        this.physics.add.collider(this.dino, this.capaMapa);
        this.physics.add.collider(this.player2, this.capaMapa);
      	//Lava - Jugador
        this.physics.add.collider(player,this.capaLava,()=>
            {
                perder_vida(this.lives);
                this.physics.pause();
                this.scene.restart();
            });
            //Colision entre el suelo y la bala 
        this.physics.add.collider(this.bala, this.capaMapa, () => {
            this.bala.disableBody(true, true);  
            this.bala.visible = false;
        }); 
        //Colision entre bala y Trex
        this.physics.add.overlap(this.bala,gameStateDino.dino, () => {
            this.bala.disableBody(true, true);  
            this.bala.visible = false;
            gameStateDino.vida-=1;
            if(gameStateDino.vida>0){
              gameStateDino.vidaText.setText(`x: ${gameStateDino.vida}`);

            }else{
              gameStateDino.vidaText.setText(`Muerto`);

            }
        }); 


        gameStateDino.Colision=this.physics.add.collider(player,gameStateDino.dino,() => {
            gameStateDino.vida=35;
            perder_vida(this.lives);
            this.physics.pause();
            this.scene.restart();
        });
        //Monedas recoger
        this.capaMonedas.setTileIndexCallback(160,hitCoin,this);
        this.physics.add.collider(player,this.capaMonedas);        
   //=============================END COLISIONES ===============================================
       //=================IDE VIDA===============================
        var pos_ini_x=player.x;
        var pos_ini_y=50;
        var espacio=0;
        this.lives = this.add.group();
        if(gameState.vida==0){

    		this.scene.stop('LVL_2_Scene');
			this.scene.start('GameOver_Scene');  
            socket.emit("Jugador-Muere");
            gameState.vida=6
            //this.scene.restart();            
            //======END EVENTO RESTAR GAME=====
        }else{
            for(var i=0;i<gameState.vida;i++){
                this.lives.create(pos_ini_x+espacio,  pos_ini_y, 'heartP').setScrollFactor(0);
                espacio+=35;
            }
            gameState.vidaText = this.add.text(16, 16, `Vida: ${gameState.vida}`, { fontSize: '15px', fill: '#000000' });
            gameState.vidaText.setScrollFactor(0);
            this.livesPredator = this.add.group();
            this.livesPredator.create(12370, 1100, 'heartP');
             //CONTADOR SCORE
            gameState.scoreText = this.add.text(200,16,`Score: ${gameState.score}`,{fontSize:"20px",fill:"#000000"});
            gameState.scoreText.setScrollFactor(0);   
            this.livesDino = this.add.group();
            this.livesDino.create(3370, 1395, 'heartP');
        }           
        //==================END VIDA=================================
        gameState.espacio=0;
          //Crear bucle para movimiento del enemigo1
          const Crearpuente = this.time.addEvent({
                delay: 10,
                callback: generarPuente,
                callbackScope: this,
                loop: true,
            });
        function generarPuente(){

        if(gameState.puente==true){ 
            for(var i=0;i<14;i++){
        
                this.puente = this.add.tileSprite(1465+gameState.espacio,1945,115,27,'puente'); 
                this.physics.add.existing(this.puente, true);
                this.physics.add.collider(player, this.puente);
                this.physics.add.collider(this.player2, this.puente);

                gameState.espacio+=115;
            }
                this.puente = this.add.tileSprite(1430+gameState.espacio,1945,60,27,'puente'); 
                this.physics.add.existing(this.puente, true);
                this.physics.add.collider(player, this.puente);
                gameState.puente=false;
                gameState.espacio=0;
                Crearpuente.destroy();
            }
        }

            gameStateDino.dino.anims.play('dino_salta',true);

                //Start dino

         this.dinoloop = this.tweens.add({
            targets:  gameStateDino.dino,
           
               props: {
            x: { value: 3200, duration: 5000, ease: 'Linear', yoyo: true, repeat: -1 },
            y: { value: 1400, duration: 1000, ease: 'Linear', yoyo: true, delay: 1000 ,repeat: -1}
        },

            onRepeat : function() {
                if(gameStateDino.dino.x>=4500){
                    //dinoloop.stop();
                            gameStateDino.dino.flipX=true;

                           // dinoloop.play();
                    for(var i=0;i<3;i++){
                        setTimeout(function(){
                            gameStateDino.disparo++;
                            gameStateDino.destruyeFuego=false;
                            gameStateDino.nuevoFuego=true;                  
                            gameStateDino.Fuego=true;
                            atacarDino();
                        },1000);
                    }
                }
                gameStateDino.dino.flipX=true;
            } ,
            onYoyo : function() {
            if(gameStateDino.dino.x>=3086 &&gameStateDino.dino.x<=3760){

                gameStateDino.dino.flipX=false;
                gameStateDino.destruyeFuego=true;
                gameStateDino.nuevoFuego=false;
            }


      }      

        });
        //End Predator


 }
     update(time,dt){
      this.physics.add.collider(player,gameStateDino.fuego,() => {
            gameStateDino.fuego.destroy();
            gameStateDino.vida=35;
            this.physics.pause();
            perder_vida(this.lives);
            this.scene.restart();

        });
        this.physics.add.collider(player,gameStateDino.fuego1,() => {
            gameStateDino.fuego1.destroy();
            gameStateDino.vida=35;
            this.physics.pause();
            perder_vida(this.lives);
            this.scene.restart();

        });
        this.physics.add.collider(player,gameStateDino.fuego2,() => {
            gameStateDino.fuego2.destroy();
            gameStateDino.vida=35;
            this.physics.pause();
            perder_vida(this.lives);
            this.scene.restart();

        });
        this.physics.add.collider(player,gameStateDino.fuegoCaida,() => {
            gameStateDino.fuegoCaida.destroy();
            gameStateDino.vida=35;
            this.physics.pause();
            perder_vida(this.lives);
            this.scene.restart();

        });
        gameState.juego=this;
        if((((player.x>=1296 && player.x<=1400)&&player.y>=1850)||((this.player2.x>=1296 && this.player2.x<=1400)&&this.player2.y>=1850))&&(((player.x>=1296 && player.x<=1400)&&player.y<=1200)||((this.player2.x>=1296 && this.player2.x<=1400)&&this.player2.y<=1200))){
            gameState.puente=true;
        }
    

        if(player.x<=25){
            player.x=25
        }
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
    
            player.body.setVelocityY(-600);        
            player.anims.play('salta',true);
        }
        //DISPARAR
        if (cursors.down.isDown)
        {
            if(player.flipX == true){
                this.bala.enableBody(true, player.x-30, player.y, true, true).setVelocity(-2000, 50);
                socket.emit("Jugador-Disparo-Izquierda");
            } else{
                this.bala.enableBody(true, player.x+30, player.y, true, true).setVelocity(2000, 50);
                socket.emit("Jugador-Disparo-Derecha");  

        		

 
            }
    
    
        }
        if(gameStateDino.vida<=5){
            gameStateDino.dino.setScale(1.3);
        }
        if(gameStateDino.vida<=0){
            socket.emit("Dino-muere");
            gameStateDino.vivo=false;
        }
        if(gameStateDino.vivo==false && gameStateDino.animacion==true){
            this.dinoloop.stop();
            gameStateDino.dino.flipX=true;
            gameStateDino.dino.anims.play('dino_muere',true);
            gameStateDino.animacion=false;
            this.physics.world.removeCollider(gameStateDino.Colision);


        }


        if(gameStateDino.dino.body.onFloor() &&gameStateDino.vivo==true){
             var random=(Math.floor((Math.random() * 3) + 1));

             var altura=Math.random() * (4500 - 2500) + 2500;
             var altura2=Math.random() * (800 - 200) + 200;
             var altura3=Math.random() * (800 - 200) + 200;
             altura=altura+altura3-altura2;
             if(random==2){
                 gameStateDino.fuegoCaida  = this.physics.add.sprite((altura),1000, 'fireball').setOrigin(0).setScale(0.3);
             }

        }

        if(gameStateDino.Fuego==true){
            gameStateDino.fuego.x -= (gameState.speed1 * dt);
            gameStateDino.fuego2.x -= (gameState.speed1 * dt);
            gameStateDino.fuego1.x -= (gameState.speed1 * dt);


        }
        if(gameStateDino.destruyeFuego==true){

            gameStateDino.fuego.destroy();
            gameStateDino.fuego2.destroy();
            gameStateDino.fuego1.destroy();



        }else if(gameStateDino.nuevoFuego==true){
           
            gameStateDino.fuego  = this.physics.add.sprite((gameStateDino.dino.x),Math.random() * (1800 - 1350) + 1350, 'fireball').setOrigin(0).setScale(0.3);
            setTimeout(function(){
            gameStateDino.fuego1  = gameState.juego.physics.add.sprite((gameStateDino.dino.x),Math.random() * (1800 - 1350) + 1350, 'fireball').setOrigin(0).setScale(0.3);
            gameStateDino.fuego1.body.allowGravity = false; 

            },1500,this);
            setTimeout(function(){
            gameStateDino.fuego2  = gameState.juego.physics.add.sprite((gameStateDino.dino.x),Math.random() * (1800 - 1350) + 1350, 'fireball').setOrigin(0).setScale(0.3);
            gameStateDino.fuego2.body.allowGravity = false;
            },2500,this);
            gameStateDino.fuego.body.allowGravity = false;
            gameStateDino.nuevoFuego=false;

        }

     }


}
function atacarDino(){
    gameStateDino.Fuego=true;
}

