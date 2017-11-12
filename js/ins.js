var insState = {
  create: function() {

		var fondo = game.add.tileSprite(0, 0, 800, 600, 'inst');

		var start = game.add.button(10 , game.world.height-690, 'back', insState.menu, this, 2, 1, 0);
		start.scale.setTo(2);
	},
	menu: function() {
		game.state.start('menu');
	},
}
