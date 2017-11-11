var  winW = document.body.offsetWidth;
var winH = document.body.offsetHeight;
var game = new Phaser.Game(winW, 600, Phaser.AUTO, '', { preload: preload, create: create, render: render });
function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('star', 'assets/star.png');
}
var circle;

function create() {
  game.add.sprite(0, 0, 'sky');

    circle = new Phaser.Circle(game.world.centerX, game.world.centerY, 500);
}
function render () {
    game.debug.geom(circle,'#000');
}

function update() {
}
