var juego = new Phaser.Game(100,100,Phaser.AUTO,'bloque');

var map;
var layer;

var estadoPrincipal = {

	preload: function(){
		//Cargar recursos
		this.load.tilemapTiledJSON('mapa','resources/Tiles/map.json');
		this.load.image('tiles','resources/Tiles/Tiles_64x64.png');

	},
	create: function(){
		mapa = this.make.tilemap({key:'mapa'});
		var tileset = map.addTilesetImage('Tiles_32x32','tiles');

		var solidos = mapa.createDynamicLayer('Solidos',tileset,0,0);
		solidos.setCollisionByProperty({solido:true});
	},
	update: function(){
		//Animamos el juego
	}
};

/*juego.state.add('principal',estadoPrincipal);
juego.state.start('principal');*/