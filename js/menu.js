var menuState = {

	create: function() {

		var fondo = game.add.tileSprite(0, 0, 800, 600, 'fondo');

		var nameLabel = game.add.text(145, 15, 'The Kidnaped', {
			font: '80px Arial',
			fill: '#fff',
			stroke: '#000',
			strokeThickness: 10
		});

		var startLabel = game.add.text(150, game.world.height-650, 'Presione la barra espaciadora para empezar', {
			font: '25px Arial',
			fill: '#ffffff',
			stroke: '#000',
			strokeThickness: 10
		});

		var Swkey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		Swkey.onDown.addOnce(menuState.start, this);

		var start = game.add.button(260 , game.world.height-750, 'boton', menuState.start, this, 2, 1, 0);
		start.scale.setTo(0.8);
		var ins = game.add.button(510 , game.world.height-760, 'ayuda', menuState.ins, this, 2, 1, 0);
		ins.scale.setTo(0.8);
	},

	start: function() {
		game.state.start('play');
	},
	ins: function() {
		game.state.start('ins');
	}
};
