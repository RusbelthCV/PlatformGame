class GameOver_Scene extends Phaser.Scene {
	constructor() {
		super({ key: 'GameOver_Scene' })
	}

	create() {
		this.add.text(95, 250, 'Click to Start!', { fontSize: '30px', fill: 'red' });
		this.input.on('pointerdown', () => {
			this.scene.stop('GameOver_Scene')
			this.scene.start('LVL_1_Scene')
		})
	}
}