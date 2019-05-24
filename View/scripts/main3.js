var cursors = undefined;
var fondo;
var map;
var layer;
var player;
var sound;
var tilset;

var config = 
{
    type: Phaser.CANVAS,
    width: 1500,
    height: 1200,
    physics:
    {
        default: 'arcade',
        arcade:{
            gravity:{y: 500},
            debug:false
        }
    },
    scene: [LVL_2_Scene,LVL_1_Scene,GameOver_Scene, ]
};
var game = new Phaser.Game(config);




const gameState = { 
    vida: 6 ,
    mov_enemigo1: "izq", //Indica la direccion del movimiento del enemigo1
    score: 0,
    metaP2:false,
    bonus : "",
    puente:false

};
    
const gameStatePredator = {vida:20,vivo:true,laser:false,nuevoLaser:false,destruyeLaser:false}

var bullets;
var bulletTime=0;
var coins;


