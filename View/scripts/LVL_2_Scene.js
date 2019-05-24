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
        //this.load.spritesheet('player2','assets/Player/SpriteSheet blue/player.png',{frameWidth: 500,frameHeight:714});
        this.load.spritesheet('player2_correr','assets/Player/SpriteAlienBlue/run.png',{frameWidth: 218,frameHeight:433});
        this.load.spritesheet('player2_disparar','assets/Player/SpriteAlienBlue/Dispara.png',{frameWidth: 486,frameHeight:438.6363});
        this.load.spritesheet('player2_saltar','assets/Player/SpriteAlienBlue/salta.png',{frameWidth: 266,frameHeight:449.3});
        this.load.spritesheet('player2_quieto','assets/Player/SpriteAlienBlue/quieto.png',{frameWidth: 235   ,frameHeight:435.33});
        //Bala
        this.load.image('bullet', 'assets/purple_ball.png',{frameWidth: 500,frameHeight:714});
        //Puente
        this.load.spritesheet('puente', 'assets/puente.png',{frameWidth: 116,frameHeight:28});


        /*
        //enemigo azul 
        this.load.spritesheet('enemy1','assets/enemigos/enemigo1/enemy1.png',{frameWidth: 587,frameHeight:691});
        //Enemigo spike
        this.load.image("enemigo","assets/Free Platform Game Assets/Platform Game Assets/Enemies/png/128x128/Saw.png");
        //Cubo de pinchos
        this.load.spritesheet('cubo','assets/enemigos/Cubo/cubo_sprite.png',{frameWidth: 133,frameHeight:128});
		//Primer Boss Predator
        this.load.spritesheet('predator_quieto','assets/enemigos/predator/normal.png',{frameWidth: 230   ,frameHeight:416});
        this.load.spritesheet('predator_shoot','assets/enemigos/predator/disparaV.png',{frameWidth: 549   ,frameHeight:399 });
        this.load.spritesheet('predator_morir','assets/enemigos/predator/morir.png',{frameWidth: 363   ,frameHeight:358});
        this.load.spritesheet('predator_walk','assets/enemigos/predator/walk.png',{frameWidth: 231   ,frameHeight:407});
        this.load.image("predator_laser",'assets/enemigos/predator/laserpredator.png')
        //Bonus
        this.load.image("bonusFly","assets/bonusFly.png");
*/
        //Vida
        this.load.spritesheet('heartP', 'assets/1vida.png',{frameWidth: 32,frameHeight:32});
        
     }
     create(){
     	   //Iniciar musica 
        gameState.incredible=this.sound.add("musica_fondo");
        gameState.incredible.play()
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
        var capaLava = this.mapa.createDynamicLayer("Lava",tileSetElementos,0,0);
        this.capaMonedas = this.mapa.createDynamicLayer("coinLayer",tileSetMonedas,0,0);
    //======================END AÑADIR ELEMENTOS=====================

    //======================JUGADOR PRINCIPAL=======================
     //JUGADOR1
        player = this.physics.add.sprite(50, 900, 'player');//12200
        player.setScale(0.25);
         //JUGADOR 2
        this.player2 = this.physics.add.sprite(50, 900, 'player2_quieto');
        this.player2.setScale(0.25);
        //CREAMOS LA BALA 
        this.bala = this.physics.add.sprite(player.x, player.y, 'bullet');
        this.bala.disableBody(true, true); 
    



  //=================END JUGADOR PRINCIPAL=======================
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

    //===========START CAMARA========================
        this.cameras.main.setBounds(0, 0, this.mapa.widthInPixels, this.mapa.heightInPixels);
        this.cameras.main.startFollow(player);
        this.cameras.main.setBackgroundColor('#ccccff');
    
    //============END CAMARA========================

   //=============================START COLISIONES ===============================================
     
        //COLISIONES ENTRE MAPA Y JUGADORES
        this.capaMapa.setCollisionByProperty({Suelo:true});
        capaLava.setCollisionByProperty({muerte:true});
        this.physics.add.collider(player, this.capaMapa);
        this.physics.add.collider(this.player2, this.capaMapa);


      	//Lava - Jugador
        this.physics.add.collider(player,capaLava,()=>
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
            gameStatePredator.MensajeText = this.add.text(12356, 1050, `Vida del Predator`, { fontSize: '30px', fill: '#000000' });
            gameStatePredator.vidaText = this.add.text(12390, 1080, `x: ${gameStatePredator.vida}`, { fontSize: '30px', fill: '#000000' });   
             //CONTADOR SCORE
            gameState.scoreText = this.add.text(200,16,`Score: ${gameState.score}`,{fontSize:"20px",fill:"#000000"});
            gameState.scoreText.setScrollFactor(0);   
        }           
        //==================END VIDA=================================
        gameState.espacio=0;
        //this.puente = this.add.group();

        //this.puente = this.physics.add.sprite(player.x+gameState.espacio, player.y, 'puente').allowGravity = true;
        	//	this.puente.body.allowGravity = false;
                ///this.puente.create(1500+gameState.espacio,  1945, 'puente');
    	this.puente = this.physics.add.sprite(player.x+gameState.espacio, player.y, 'puente').allowGravity = false;
       	this.puente = this.physics.add.sprite(this.pos_cubo_X,this.altura_cubo,'cubo');
        this.puente.body.allowGravity = false;


        		gameState.espacio+=115;
            
     }
     update(time,dt){

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
                player.anims.play('disparar',true);
                socket.emit("Jugador-Disparo-Izquierda");
       
            } else{
                this.bala.enableBody(true, player.x+30, player.y, true, true).setVelocity(2000, 50);
                player.anims.play('disparar',true);
                socket.emit("Jugador-Disparo-Derecha");  
            	//var bridgeTile = this.capaElementos.putTileAt(4, 5, 5);
            	//this.physics.add.tileBody(bridgeTile)
        		

 
            }
    
    
        }
     }


}
