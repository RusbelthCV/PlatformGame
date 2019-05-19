var cursors = undefined;
var fondo;
var map;
var layer;
var player;
var sound;
var tilset;
const gameText = 
{
    vidas:4
};
var config = 
{
    type: Phaser.CANVAS,
    width: 1500,
    height: 1200,
    physics:
    {
        default: 'arcade',
        arcade:{
            gravity:{y: 300},
            debug:true
        }
    },
    scene: [GameOver_Scene, LVL_1_Scene]
};
var game = new Phaser.Game(config);
const gameState = { 
    vida: 6 ,
    mov_enemigo1: "izq", //Indica la direccion del movimiento del enemigo1
    score: 0
};
var bullets;
var bulletTime=0;
var coins;

function reproducir_music(){
    gameState.incredible=this.sound.add("musica_fondo");
    gameState.incredible.play()
}

