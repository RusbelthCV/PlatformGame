var cursors = undefined;
var cielo;
var map;
var player;
var config = 
{
	type: Phaser.CANVAS,
	width: 820,
	height: 740,
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
var juego = new Phaser.Game(config);


function preload()
{
	
    
	this.load.tilemapTiledJSON("mapa","./assets/mapaCol.json");
    this.load.image('mapita','assets/Tiles_32x32.png');
    this.load.image('fondo','./assets/cielo.png');

    this.load.spritesheet('personaje','assets/personaje.png',{frameWidth: 34,frameHeight:34});
}
function create()
{
	
    map = this.add.tilemap('mapa');
	var tileSet = map.addTilesetImage("tilesMap","mapita");
    cielo = this.add.image(320,360,'fondo');

	cursors = this.input.keyboard.createCursorKeys();

	player = this.physics.add.sprite(20,40,'personaje');

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
    var solidos = map.createDynamicLayer("Solido",tileSet,0,0);
    player.setCollideWorldBounds(true);
    player.body.bounce.set(0.3);
    solidos.setCollisionByProperty({Solido:true});
    this.physics.add.collider(player,solidos);
    
    player.setSize(10,0);
}
function collisiomHandler()
{
	juego.stage.backgroundColor = 0xff0000;
}
function update(time,dt)
{
	var factor = dt/1000;
	if(cursors.left.isDown)
	{
		player.x-=100*factor;
		player.anims.play('left',true);
	}
	else if(cursors.right.isDown)
	{
		player.x += 100*factor;
		player.anims.play('right',true);
	}
	else
	{
		player.anims.play('stop',true);	
	}
}