class GameOver_Scene1 extends Phaser.Scene {
	constructor() {
		super({ key: 'GameOver_Scene1' })
	}

	preload()
	{
		this.load.image("gameOver","assets/GameOver.png");
	}


	create() {
		

		this.add.image(750,600,"gameOver");
		this.texto = this.add.text(95, 950, 'Click to Start!', { fontSize: '150px', fill: 'white' });
		this.input.on('pointerdown', () => {
            InsertarPuntos();
			this.scene.stop('GameOver_Scene1');
			this.scene.start('LVL_1_Scene');
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
       function InsertarPuntos()
        {
            var obj = creaObjetoAjax();
            var url = "../index.php?section=lobby&puntos="+gameState.score;
            obj.open("GET",url,true);
            obj.onreadystatechange = function()
            {
                
                if(obj.readyState == 4 && obj.status == 200)
                {   
            console.log(url);

                    var coincidencias = obj.responseText;
                }
                else
                {}
            }
            obj.send();
        }   
        function creaObjetoAjax() 
        { 
            var obj;
            if(window.XMLHttpRequest) 
             {
                obj=new XMLHttpRequest();
             }
             else 
             { 
                obj=new ActiveXObject(Microsoft.XMLHTTP);
                 
             }
             return obj;
        }