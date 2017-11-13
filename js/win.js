var winState = {
	create: function() {

		var titulow = game.add.tileSprite(0, 0, 800, 600, 'win');

		var winLabel = game.add.text(50, 50, 'CONGRATS!', {
			font: '80px Arial', 
			fill: '#ffffff',
			stroke: '#000',
			strokeThickness: 10
		});

		var startLabel = game.add.text(80, game.world.height-650, 'Press the Spacebar key to restart', {
			font: '30px Arial',
			fill: '#ffffff',
			stroke: '#000',
			strokeThickness: 10
		});

		mainAudio.stop();
		mainAudio = game.add.audio('win');
		mainAudio.play();

		var wkey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		wkey.onDown.addOnce(this.restart, this);

	},	

	restart: function() {
		game.state.start('play');
	}
};