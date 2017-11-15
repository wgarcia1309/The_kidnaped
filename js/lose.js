var loseState = {
	
	create: function() {

		var titulol = game.add.tileSprite(0, 0, 800, 600, 'lose');

		var winLabel = game.add.text(40, 50, 'There is another'+ '\n'+ 'chance for everyone', {
			font: '80px Arial', 
			fill: '#ffffff',
			stroke: '#000',
			strokeThickness: 10
		});

		var startLabel = game.add.text(80, game.world.height-650, 'Press the Spacebar key to restart', {
			font: '25px Arial',
			fill: '#ffffff',
			stroke: '#000',
			strokeThickness: 10
		});

		mainAudio.stop();
		mainAudio = game.add.audio('die');
		mainAudio.play();

		var wkey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		wkey.onDown.addOnce(this.restart, this);
	},

	restart: function() {
		game.state.start('play');
	}

};