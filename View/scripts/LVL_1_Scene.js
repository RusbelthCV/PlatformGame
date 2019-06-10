class LVL_1_Scene extends Phaser.Scene {
	constructor(){
		super({ key: 'LVL_1_Scene' });
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

        //Vida
        this.load.spritesheet('heartP', 'assets/1vida.png',{frameWidth: 32,frameHeight:32});
    }
     create()
    {
    gameState.bajar=true;
    
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
            this.scene.stop('LVL_1_Scene');
            this.scene.start('GameOver_Scene1');
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
            this.player2.body.setVelocityY(-380);        
            this.player2.anims.play('salta2',true);
            console.log("Este jugador abusa del fly");
        });
        //Detecta si el compañero ha disparado a la izquierda   
        socket.on('Jugador-shoot-left',()=>{
            this.bala.enableBody(true, this.player2.x, this.player2.y, true, true).setVelocity(-2000, 50);
            this.player2.anims.play('disparar2',true);

            console.log("Dispara a la izquierda");

        });
        //Detecta si el compañero ha disparado a la derecha   
    
        socket.on('Jugador-shoot-right',()=>{

            this.bala.enableBody(true, this.player2.x, this.player2.y, true, true).setVelocity(2000, 50);
            console.log("Dispara a la derecha");
            this.player2.anims.play('disparar2',true);

        });    
        //Detecta si el predator muere en el otro jugador
        socket.on('PredatorMuere',()=>{
            console.log("PredatorMuere");
                gameStatePredator.vivo=false;
                this.predator.anims.play('morirPredator',true);
                this.predator.setSize(1,1);
                this.predator.y+=16;
                gameStatePredator.nuevoLaser=false;
            gameStatePredator.vidaText.setText(`Muerto`);

        }); 
       socket.on('MetaP2',()=>{
            console.log("Meta!");
            gameState.metaP2=true;
        });         
       socket.on('No-MetaP2',()=>{
            console.log("no-Meta!");
            gameState.metaP2=false;
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
        var capaTrampas =this.mapa.createDynamicLayer("trampas",tileSetMapa,0,0);
     
    
    
    
        
    
    //======================END AÑADIR ELEMENTOS=====================
    
    //======================JUGADOR PRINCIPAL=======================
    
        //JUGADOR1
        player = this.physics.add.sprite(200, 980, 'player');//12200
        player.setScale(0.25);
    
        //JUGADOR 2
        this.player2 = this.physics.add.sprite(200, 980, 'player2_quieto');
        this.player2.setScale(0.25);
    
        //CREAMOS LA BALA 
        this.bala = this.physics.add.sprite(player.x, player.y, 'bullet');
        this.bala.disableBody(true, true); 
        
        //Predator
         var fin_plataforma=12700;
        this.predator = this.physics.add.sprite(fin_plataforma, 1500, 'predator_quieto');
        gameState.Predator=this.predator;
        this.predator.setScale(0.35);
        this.predator.flipX = true;

 	gameState.predator_laser = this.add.image((gameState.Predator.x-350),(gameState.Predator.y+50), 'predator_laser').setOrigin(0).setScale(0.1 );
    gameState.speed1 = Phaser.Math.GetSpeed(1500, 3);

    
    //=================END JUGADOR PRINCIPAL=======================
    //=================START ENEMIES=============================
        
    this.enemy1 = this.physics.add.sprite(2390,972,'enemy1');
    this.enemy1.setScale(0.08);
        //Cubo con pinchos
        this.pos_cubo_X=740;
        this.altura_cubo=490;
        this.enemy_cubo = this.physics.add.sprite(this.pos_cubo_X,this.altura_cubo,'cubo');
        this.enemy_cubo.body.allowGravity = false;
        this.spike = this.physics.add.image(7883,710,"enemigo");
        this.physics.add.collider(this.spike,this.capaMapa);
        
    
    
    
        
      
    
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
                this.enemy1.flipX=true;
    
                this.enemy1.setScale(0.125);
            }
            //Movimiento a la derecha
            if(gameState.mov_enemigo1=="der"){
                //Detecta que ha llegado al comienzo de la plataforma y vuelve al inicio
                if(this.enemy1.x==inicio_plataforma-10){
                    gameState.mov_enemigo1="izq";
                this.enemy1.flipX=false;

                    this.enemy1.anims.play('pequeño',true);
                    this.enemy1.setScale(0.08);
    
                }
                this.enemy1.x+=10;
    
            }
    
        }
        //Movimiento de la sierra enemiga.
        this.tweens.add(
        {
            targets:this.spike,
            x: 6420,
            duration: 4000,
            ease: 'Linear',
            yoyo: true,
            repeat: -1,
        });
        
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
        //Start predator

		const predatorloop = this.tweens.add({
			targets: this.predator,
			x: 12200,
			ease: 'Linear',
			duration: 1800,
			repeat: -1,
			yoyo: true,
			//onRepeat: growSnowman
			onRepeat : function() {
           		gameState.Predator.flipX=true;
       		 	gameStatePredator.destruyeLaser=false;
       		 	gameStatePredator.nuevoLaser=true;


           		atacar();


			}     ,
			onYoyo : function() {
      
           		gameState.Predator.flipX=false;
           		//atacar();
        		gameState.Predator.anims.play('predator_walk',true);
        		gameStatePredator.destruyeLaser=true;
       		 	gameStatePredator.nuevoLaser=false;



      }       

		});

        //End Predator
    
        //=================END ENEMIES=============================
        //=================IDE VIDA===============================
        var pos_ini_x=player.x;
        var pos_ini_y=50;
        var espacio=0;
    
        this.lives = this.add.group();
        if(gameState.vida==0){

    		this.scene.stop('LVL_1_Scene');
			this.scene.start('GameOver_Scene1');
    
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
    //=============================START COLISIONES ===============================================
     
        //COLISIONES ENTRE MAPA Y JUGADORES
        this.capaMapa.setCollisionByProperty({Suelo:true});
        capaTrampas.setCollisionByProperty({Suelo:true});
        capaAgua.setCollisionByProperty({muerte:true});
    
        this.physics.add.collider(player, this.capaMapa);
    
        this.physics.add.collider(this.player2, this.capaMapa);
        //ENEMIGO-CAPA
        this.physics.add.collider(this.enemy1,this.capaMapa);
        
        this.physics.add.collider(this.enemy_cubo,this.capaMapa);
        this.physics.add.collider(this.predator,this.capaMapa);

        
        //Agua/Lava - Jugador
        this.physics.add.collider(player,capaAgua,()=>
            {
                perder_vida(this.lives);
                this.physics.pause();
                this.scene.restart();
            });
    //===========================================
        this.physics.add.collider(player, capaTrampas,()=>{
            perder_vida(this.lives);
            this.physics.pause();
            this.scene.restart();
        });
    
    
        //COLISIONES CONTRA ENEMIGOS
        this.physics.add.collider(player, this.enemy_cubo,()=>{
            perder_vida(this.lives);
            this.physics.pause();
            this.scene.restart();   
        } );
        this.physics.add.collider(player,this.spike,() => {
            perder_vida(this.lives);
            this.physics.pause();
            this.scene.restart();
        });
        this.physics.add.collider(player,this.predator,() => {
            gameStatePredator.vida=20;
            perder_vida(this.lives);
            this.physics.pause();
            this.scene.restart();
        });
 
       this.physics.add.collider(player, gameState.predator_laser,() => {
       	       perder_vida(this.lives);
            this.physics.pause();
            this.scene.restart();
        });
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
                //Predator
            this.physics.add.overlap(this.bala, this.predator, () => {
                this.bala.disableBody(true, true);  
                this.bala.visible = false;
                  gameStatePredator.vida-=1;
                if(gameStatePredator.vida>0){
            gameStatePredator.vidaText.setText(`x: ${gameStatePredator.vida}`);

                }else{
            gameStatePredator.vidaText.setText(`Muerto`);

                }
            //gameStatePredator.vidaText = this.add.text(12390, 1080, `x: ${gameStatePredator.vida}`, { fontSize: '30px', fill: '#000000' });

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
            //Enemigo azul
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
            //end enemy azul
            //Start PREDATOR 
          this.anims.create(
            {
                key:'morirPredator',
                frames: this.anims.generateFrameNumbers('predator_morir',{start: 0, end: 5}),
                frameRate: 5,
                repeat: 0
            });
          this.anims.create(
            {
                key:'predatorDispara',
                frames: this.anims.generateFrameNumbers('predator_shoot',{start: 0, end: 5}),
                frameRate: 3,
                repeat: 0
            });
            this.anims.create(
            {
                key:'predatorQ',
                frames: this.anims.generateFrameNumbers('predator_quieto',{start: 0, end: 0}),
                frameRate: 1,
                repeat: -1
            });
            this.anims.create(
            {
                key:'predator_walk',
                frames: this.anims.generateFrameNumbers('predator_walk',{start: 0, end: 6}),
                frameRate: 3,
                repeat: -1
            });            

            //End Predator animation
        this.predator.anims.play('predator_walk',true);

    
    //============================END OTRAS ANIMACIONES /ENEMIGOS/OBJETOS======================
        var bonus = this.mapa.addTilesetImage("bonusFly","bonusFly");
        this.capaBonusFly = this.mapa.createDynamicLayer("Bonus",bonus,0,0);
        this.capaBonusFly.setCollisionByProperty({Vuelo:true});
        this.capaBonusFly.setTileIndexCallback(157,hitBonus,this); 
        this.physics.add.collider(player,this.capaBonusFly);
        gameState.secondsText = this.add.text(520,16,"Bonus: None",{fontSize: "16px",fill: "#00000"});
        gameState.secondsText.setScrollFactor(0);
        seconds = setInterval(countSeconds,1000);
        

    }
     update(time,dt)
    {
        if(player.y>=2500){
            perder_vida(this.lives);
            this.physics.pause();
            this.scene.restart();
        }
        if(player.x<=25){
            player.x=25
        }
        if(player.y<=50){
            player.y=50
        }          

       this.physics.add.collider(player, gameState.predator_laser,() => {
        	gameState.predator_laser.destroy();

       	perder_vida(this.lives);
            this.physics.pause();
            this.scene.restart();
        });
        this.physics.add.collider(player, gameState.predator_laser1,() => {
        	gameState.predator_laser.destroy();

       	perder_vida(this.lives);
            this.physics.pause();
            this.scene.restart();
        });
        this.physics.add.collider(player, gameState.predator_laser2,() => {
        	gameState.predator_laser.destroy();

       	perder_vida(this.lives);
            this.physics.pause();
            this.scene.restart();
        });
        this.physics.add.collider(player, gameState.predator_laser3,() => {
        	gameState.predator_laser.destroy();

       	perder_vida(this.lives);
            this.physics.pause();
            this.scene.restart();
        });
        this.physics.add.collider(player, gameState.predator_laser4,() => {
        gameState.predator_laser.destroy();
       	perder_vida(this.lives);
            this.physics.pause();
            this.scene.restart();
        }); 
        this.physics.add.collider(player, gameState.predator_laser5,() => {
            gameState.predator_laser.destroy();
               perder_vida(this.lives);
                this.physics.pause();
                this.scene.restart();
            });              
/*
       if((gameState.predator_laser.x<=player.x+32 &&gameState.predator_laser.x>=player.x)&&player.y>=1525){
        	   perder_vida(this.lives);
            this.physics.pause();
            this.scene.restart();
        }*/
 

        var inicio_fin_mapa=12673;
        var fin_fin_mapa=12806;

        this.distancia = this.spike.x-player.x;
        if(this.distancia <= 850 && this.spike.body.onFloor())
        {
            this.spike.angle += 10;
            //gameState.incredible.play();
            
        }
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
            player.body.setVelocityY(-600);        
            player.anims.play('salta',true);
        }
        /*if(player.y>2000){
            perder_vida(this.lives);
            this.scene.restart();   
        }*/
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

        if(gameStatePredator.laser==true){

    		gameState.predator_laser.x -= (gameState.speed1 * dt);
        }
        if(gameStatePredator.destruyeLaser==true){

        	gameState.predator_laser.destroy();

        }else if(gameStatePredator.nuevoLaser==true){
             var random_altura=Math.floor((Math.random() * 3) + 1);
             var altura_laser;
             if(random_altura==1){
                altura_laser=gameState.Predator.y+45;
             }
             if(random_altura==2){
                altura_laser=gameState.Predator.y-75;
             }
             if(random_altura==3){
                altura_laser=gameState.Predator.y;
             }
             if(gameStatePredator.vivo==true && player.x>=inicio_fin_mapa && player.x<=fin_fin_mapa+50){
                gameState.predator_laser = this.physics.add.image((gameState.Predator.x+50),(altura_laser), 'predator_laser').setOrigin(0).setScale(0.1 );
                gameState.predator_laser1 = this.physics.add.image((gameState.Predator.x+50),(altura_laser+50), 'predator_laser').setOrigin(0).setScale(0.1 );
                gameState.predator_laser2 = this.physics.add.image((gameState.Predator.x+50),(altura_laser-150), 'predator_laser').setOrigin(0).setScale(0.1 );
                gameState.predator_laser3 = this.physics.add.image((gameState.Predator.x+50),(altura_laser-100), 'predator_laser').setOrigin(0).setScale(0.1 );
                gameState.predator_laser4 = this.physics.add.image((gameState.Predator.x+50),(altura_laser-220), 'predator_laser').setOrigin(0).setScale(0.1 );
                gameState.predator_laser5 = this.physics.add.image((gameState.Predator.x+50),(altura_laser-260), 'predator_laser').setOrigin(0).setScale(0.1 );

             }else{
                gameState.predator_laser = this.physics.add.image((gameState.Predator.x-350),(altura_laser), 'predator_laser').setOrigin(0).setScale(0.1 );
                gameState.predator_laser1 = this.physics.add.image((gameState.Predator.x+50),(altura_laser+550), 'predator_laser').setOrigin(0).setScale(0.1 );
                gameState.predator_laser2 = this.physics.add.image((gameState.Predator.x+50),(altura_laser+550), 'predator_laser').setOrigin(0).setScale(0.1 );
                gameState.predator_laser3 = this.physics.add.image((gameState.Predator.x+50),(altura_laser+550), 'predator_laser').setOrigin(0).setScale(0.1 );
                gameState.predator_laser4 = this.physics.add.image((gameState.Predator.x+50),(altura_laser+550), 'predator_laser').setOrigin(0).setScale(0.1 );
                gameState.predator_laser5 = this.physics.add.image((gameState.Predator.x+50),(altura_laser+550), 'predator_laser').setOrigin(0).setScale(0.1 );
             }
        gameState.predator_laser.body.allowGravity = false;

       		 	gameStatePredator.nuevoLaser=false;

        }
        

        //Animacion predator de caminar
        //Cuanto quitamos las vidas al predator
        if(gameStatePredator.vida<=0){
                gameStatePredator.vivo=false;
                this.predator.anims.play('morirPredator',true);
                this.predator.setSize(1,1);
                this.predator.y+=16;
                gameStatePredator.nuevoLaser=false;
                socket.emit("Predator-muere");
                gameStatePredator.cantidad=false;


        }
        if(gameStatePredator.vivo==true && player.x>=inicio_fin_mapa && player.x<=fin_fin_mapa+50){
            gameState.Predator.flipX = false;
            gameState.predator_laser1.x +=20;
            gameState.predator_laser1.setAngle(180);

            gameState.predator_laser2.x +=20;
            gameState.predator_laser2.setAngle(180);

            gameState.predator_laser3.x +=20;
            gameState.predator_laser3.setAngle(180);

            gameState.predator_laser4.x +=20;
            gameState.predator_laser4.setAngle(180);

            gameState.predator_laser5.x +=20;
            gameState.predator_laser5.setAngle(180);

            gameState.predator_laser.x +=20;
            gameState.predator_laser.setAngle(180);
        }
    
        //Legamos a la meta luego de matar al predator
        if(gameStatePredator.vivo==false && (player.x>=inicio_fin_mapa && player.x<=fin_fin_mapa)){
            socket.emit("Meta");
        }else{
            socket.emit("No-Meta");


        }
        if(gameStatePredator.vivo==false && (player.x>=inicio_fin_mapa && player.x<=fin_fin_mapa)&&gameState.metaP2==true&&(this.player2.x>=inicio_fin_mapa && this.player2.x<=fin_fin_mapa)){
            gameStatePredator.vida=20;     
            gameState.vida=6;
            gameStatePredator.vivo=true;     
            this.scene.stop('LVL_1_Scene');
            this.scene.start('LVL_2_Scene');
        }

        if(gameState.bonus != "fly")
        {
            if (cursors.up.isDown && player.body.onFloor())
            {
                socket.emit("Jugador-Moviendose-top");
                player.body.setVelocityY(-400);        
            }   
        }
        else
        {
            if(cursors.up.isDown)
            {
                socket.emit("Jugador-Moviendose-top");
                
                player.body.setVelocityY(-400);
            }
        }
        if(((new Date().getTime()-this.start) > 5000) && gameState.bonus == "fly")
        {
            noBonus();
            clearInterval(seconds);
        }

    }
 
}

    ///======================================Funciones================================
//Reproduce la musica de fondo
function reproducir_music(){
    gameState.incredible=this.sound.add("musica_fondo");
    gameState.incredible.play()
}
//Recoje las monedas 
function hitCoin(sprite,tile)
    {
        this.capaMonedas.removeTileAt(tile.x,tile.y);
        gameState.score+= 20;
        gameState.scoreText.setText(`Score: ${gameState.score}`);
        return false;
    }

//Se encarga de hacer la resta de las vidas al jugador, que el contador se actualice y lo muestre en pantalla   
function perder_vida(lives){
    gameState.vida-=1;
            gameStateDino.vida=35;
            gameStateDino.vivo=true;

    gameState.scoreText.setText(`Score: ${gameState.score}`);
    gameStatePredator.vida=20;   
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
function atacar(){
    gameState.Predator.flipX = true;
    gameStatePredator.laser=true;
    gameState.Predator.anims.play('predatorDispara',true);
}


function hitBonus(sprite,tile)
{
    this.capaBonusFly.removeTileAt(tile.x,tile.y);
    gameState.bonus = "fly";
    this.start = new Date().getTime();
    return false;
}
function noBonus()
{
    gameState.bonus = "";
    clearInterval(countSeconds);
    gameState.segundos = 5;
    gameState.secondsText.setText("Bonus: None");
}
function countSeconds()
{
    if(gameState.bonus == "fly")
    {
        gameState.segundos--;
        gameState.secondsText.setText("Bonus: Fly "+gameState.segundos);
    }
}