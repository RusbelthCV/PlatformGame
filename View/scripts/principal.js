var cursors = undefined;
var fondo;
var map;
var player;
var vidaP;
var config = 
{
	type: Phaser.CANVAS,
	width: 1500,
	height: 800,
	parent: "bloque",
	physics:
	{
		default: 'arcade',
		arcade:{
			gravity:{y: 300},
			debug:true
		}
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};
const game = new Phaser.Game(config);
const gameState = { 
	vida: 6 ,
	mov_enemigo1: "izq" //Indica la direccion del movimiento del enemigo1
	


};

function preload()
{
  	this.load.audio('musica_fondo', './assets/SariaSong.mp3');
  	this.load.tilemapTiledJSON("mapa","./assets/MapaLVL1.json");
    this.load.image('mapita','assets/spritesheet_ground.png');
    this.load.image('mapitaElement','assets/spritesheet_tiles.png');
    this.load.image('fondo','./assets/Fondo_arboles_verde.png');
    this.load.spritesheet('personaje','assets/personaje.png',{frameWidth: 34,frameHeight:34});
    this.load.spritesheet('enemy1','assets/enemigos/enemigo1/PNG/Idle/frame-1.png',{frameWidth: 14,frameHeight:714});
    this.load.image('heart', 'assets/1vida.png');
    this.load.spritesheet('heartP', 'assets/1vida.png',{frameWidth: 32,frameHeight:32});



}
function create()
{
	


	gameState.incredible=this.sound.add("musica_fondo");
      	gameState.incredible.play()

//=========================AÑADIR ELEMENTOS=====================

    map = this.add.tilemap('mapa');
	var tileSet = map.addTilesetImage("spritesheet_ground","mapita");
	var tileSet2 = map.addTilesetImage("spritesheet_tiles","mapitaElement");
    fondo = this.add.image(320,360,'fondo');
    fondo.setScale(3);
	cursors = this.input.keyboard.createCursorKeys();

	//======================JUGADOR PRINCIPAL=======================

	player = this.physics.add.sprite(40,60,'personaje');
	//player.setScale(2);
    player.setSize(12);

	//=================END JUGADOR PRINCIPAL=======================

	//=================START ENEMIES=============================

	enemy1 = this.physics.add.sprite(620,320,'enemy1');
	enemy1.setScale(0.08);
	function mover_enemigo(){
		var inicio_plataforma=630;
		var fin_plataforma=30;
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
	    // gameState.incredible.stop();
	  //  gameState.vida-=1;
//        gameState.vidaText.setText(`Vida: ${gameState.vida}`)
	    mov_enemigo1.destroy();
	    this.physics.pause();
	    this.add.text(180, 250, 'Game Over', { fontSize: '15px', fill: '#000000' });
	    this.add.text(152, 270, 'Click to Restart', { fontSize: '15px', fill: '#000000' });
	    
		//======EVENTO RESTAR GAME=====
	    this.input.on('pointerup', () =>{
	      	//gameState.incredible.stop();
	    	this.scene.restart();	

	    });
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
    for(var i=0;i<gameState.vida;i++){
	this.lives.create(pos_ini_x+espacio,  pos_ini_y, 'heartP').setScrollFactor(0);
	espacio+=35;
    }
	gameState.vidaText = this.add.text(16, 16, `Vida: ${gameState.vida}`, { fontSize: '15px', fill: '#000000' });
	gameState.vidaText.setScrollFactor(0);


	
	//==================END VIDA=================================


    //===========START CAMARA========================
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player);
    //============END CAMARA========================


//============================END AÑADIR ELEMENTOS ===============================================

//================================ANIMACIONES JUGADOR PRINCIPAL==============================
 this.anims.create(
    {
        key:'jump',
        frames: this.anims.generateFrameNumbers('personaje',{start: 12, end: 14}),
        frameRate: 10,
        repeat: -1
    });
	this.anims.create(
	{
		key:'left',
		frames: this.anims.generateFrameNumbers('personaje',{start: 8, end: 12}),
		frameRate: 22,
		repeat: -1
	});
	this.anims.create(
	{
		key:'right',
		frames: this.anims.generateFrameNumbers('personaje',{start: 8, end: 12}),
		frameRate: 22,
		repeat: -1
	});
	this.anims.create(
	{
		key:'stop',
		frames: this.anims.generateFrameNumbers('personaje',{start: 0, end: 0}),
		frameRate: 1,
		repeat: -1
	})
//============================END ANIMACIONES JUGADOR PRINCIPAL==============================

//=============================START COLISIONES ===============================================
    var solidos = map.createDynamicLayer(0,tileSet,0,0);
    var elementos = map.createDynamicLayer("Agua_elementos",tileSet2,0,0);
    player.body.bounce.set(0.3);
    solidos.setCollisionByProperty({Solido:true});
    this.physics.add.collider(player,solidos);
    this.physics.add.collider(player,enemy1);
    this.physics.add.collider(enemy1,solidos);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		
//==========================END COLISIONES ======================================================
   
}
function collisiomHandler()
{
	game.stage.backgroundColor = 0xff0000;
}
function update(time,dt)
{

	var factor = dt/1000;
	if(cursors.left.isDown)
	{
		player.x-=200*factor;

		player.anims.play('left',true);
		if(cursors.up.isDown )
    {
    	this.canJump=false;
        player.y += -300*factor;
      player.setVelocityY(-11);
        player.anims.play('jump',true);
    }
	}
	else if(cursors.right.isDown)
	{
		player.x +=200*factor;
		player.anims.play('right',true);
		if(cursors.up.isDown )
    {
    	this.canJump=false
        player.y += -300*factor;
      player.setVelocityY(-11);
        player.anims.play('jump',true);
    }
	}else if(cursors.up.isDown)
    {
    	this.canJump=false;
        player.y += -300*factor;
      player.setVelocityY(-11);
        player.anims.play('jump',true);
    }
	else
	{
		player.anims.play('stop',true);	
	}
	if(player.y>2000){
		perder_vida(this.lives);
	    	this.scene.restart();	


	}
}

///Funciones
function perder_vida(lives){
	    // gameState.incredible.stop();
	    gameState.vida-=1;
        gameState.vidaText.setText(`Vida: ${gameState.vida}`)
	var array_live=lives.getChildren();
	var invader = Phaser.Utils.Array.RemoveAt(array_live,array_live.length-1);
	if (invader)
	{
	    gameState.incredible.stop();
		invader.destroy();
	}
}



function reproducir_music(){
	gameState.incredible=this.sound.add("musica_fondo");
	gameState.incredible.play()
}