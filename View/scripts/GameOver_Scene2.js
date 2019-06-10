class GameOver_Scene2 extends Phaser.Scene {
	constructor() {
		super({ key: 'GameOver_Scene2' })
	}

	preload()
	{
		this.load.image("gameOver","assets/GameOver.png");
	}


	create() {
		

		this.add.image(750,600,"gameOver");
		this.texto = this.add.text(95, 950, 'Click to Start!', { fontSize: '150px', fill: 'white' });

		this.add.image(750,600,"gameOver");
		this.texto = this.add.text(95, 950, 'Click to Start!', { fontSize: '150px', fill: 'white' });
		this.input.on('pointerdown', () => {
            InsertarPuntos();
			this.scene.stop('GameOver_Scene2');
			this.scene.start('LVL_2_Scene');
		})

	}
	update(time,dt)
	{
		if(time%10==0)
		{
			this.texto.alpha = 0;
		}
		else if(time % 15 == 0)
		{
			this.texto.alpha = 1;
		}
	}
}