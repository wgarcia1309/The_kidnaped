var loadState = {

  preload:function () {

		var loadingLabel = game.add.text(80, 150, 'Loading...', {
			font: '30px Courier',
			fill: '#ffffff'
		});

        game.load.audio('smain', 'sounds/main.mp3');
        game.load.audio('scoin','sounds/coin.wav');
        game.load.audio('sganar','sounds/Ganar.wav');
        game.load.audio('sperder','sounds/perder.wav');
        game.load.image('back','assets/back.png');
        game.load.image('inst','assets/intructions.png');
        game.load.image('forest', 'assets/forest.png');
        game.load.image('boton', 'assets/boton.png');
        game.load.image('ayuda', 'assets/ayuda.png');
        game.load.image('fondo', 'assets/fondo.png');
        game.load.image('ground', 'assets/piso.png');
        game.load.spritesheet('demon', 'assets/demon.png',64,70);
        game.load.spritesheet('coin', 'assets/coin.png',40,45);
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        game.load.spritesheet('boss','assets/boss.png',80,70);
        game.load.spritesheet('rock','assets/rock.png',25,25);
        game.world.setBounds(0,0,800,1200);

	},

	create: function() {
		game.state.start('menu');
	}

};
