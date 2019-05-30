var cursors = undefined;
var fondo;
var map;
var layer;
var player;
var sound;
var seconds;
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
            debug:true
        }
    },
    scene: [LVL_1_Scene,LVL_2_Scene,GameOver_Scene1,GameOver_Scene2]
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
const gameStateDino={
    vida:35,
    vivo:true,
    Fuego:false,
    disparo:0,
    nuevoFuego:false,destruyeFuego:false,animacion:true
}
var bullets;
var bulletTime=0;
var coins;