var cursors = undefined;
var fondo;
var map;
var player;
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


function preload()
{
	
    
	this.load.tilemapTiledJSON("mapa","./assets/MapaLVL1.json");
    this.load.image('mapita','assets/spritesheet_ground.png');
    this.load.image('mapitaElement','assets/spritesheet_tiles.png');

    this.load.image('fondo','./assets/Fondo_arboles_verde.png');

    this.load.spritesheet('personaje','assets/personaje.png',{frameWidth: 34,frameHeight:34});
}
function create()
{
    map = this.add.tilemap('mapa');
	var tileSet = map.addTilesetImage("spritesheet_ground","mapita");
	var tileSet2 = map.addTilesetImage("spritesheet_tiles","mapitaElement");

    fondo = this.add.image(320,360,'fondo');
    fondo.setScale(3);

	cursors = this.input.keyboard.createCursorKeys();

	player = this.physics.add.sprite(40,60,'personaje');
	player.setScale(2);
    player.setSize(14,14);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
	//    this.cameras.main.startFollow(player);
	    this.cameras.main.startFollow(player);


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
    var solidos = map.createDynamicLayer("Ground",tileSet,0,0);
    var elementos = map.createDynamicLayer("Agua_elementos",tileSet2,0,0);

    //player.setCollideWorldBounds(true);
    player.body.bounce.set(0.3);
    solidos.setCollisionByProperty({Solido:true});
    this.physics.add.collider(player,solidos);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		
    
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
}