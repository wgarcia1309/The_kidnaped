var game = new Phaser.Game(800, 1200, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
function preload() {
    game.load.image('forest', 'assets/forest.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.spritesheet('demon', 'assets/demon.png',64,70);
    game.load.spritesheet('coin', 'assets/coin.png',40,45);
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('boss','assets/boss.png',80,70);
    game.load.spritesheet('rock','assets/rock.png',25,25);
    game.world.setBounds(0,0,800,1200);
}
//Jugador enemigo
var player,boss;
//Grupos
var platforms,coins,rocas,demons,deads;
var roca,demon,muror,murod;
var cursors;
var score = 0,life = 3;
var scoreText,lifeText;
var Sw, Sw2 = true;
var flag = false;
var Interval, Interval2 = false;
var focus = false;
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //se añade el fondo
    game.add.sprite(0, 0, 'forest');
    focus = setInterval(checkFocus, 200);
    var Sum = 0;
    //Se crean los grupos
    platforms = game.add.group();
    rocas = game.add.group();
    demons = game.add.group();
    murosd = game.add.group();
    murosr = game.add.group();
    coins = game.add.group();
    //Habilita fisicas
    platforms.enableBody = true;
    rocas.enableBody = true;
    demons.enableBody = true;
    coins.enableBody = true;
    murosd.enableBody=true;
    murosr.enableBody=true;
    //Creacion de demonios
    for (var i = 0; i < 4; i++) {
        demon = demons.create(360,game.world.height -(325+Sum), 'demon');
        var d= Math.random()*10;
        demon.body.gravity.y = 300;
        demon.body.bounce.y = 0;
        demon.body.bounce.x = 1;
        demon.animations.add('left',[0,1,2],10,true);
        demon.animations.add('right',[3,4,5],10,true);
        demon.animations.add('dead',[6,7],10,false);
        if(d>5){
          demon.body.velocity.x = -100;
          demon.animations.play("left");
        }else{
          demon.body.velocity.x = 100;
          demon.animations.play("right");
        }
        Sum = Sum +250;
   }
   //Creacion del suelo
    var ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;
    //Creacion de plataformas
    ledge = platforms.create(360, 80, 'ground');
    ledge.body.immovable = true;
    ledge.scale.setTo(0.2,0.5);
    for (var i = 1; i<5; i++) {
        var ledge = platforms.create(0, game.world.height -(200*i), 'ground');
        ledge.body.immovable = true;
        ledge.scale.setTo(0.5,0.5);
        ledge = platforms.create(600, game.world.height -(200*i) ,'ground');
        ledge.body.immovable = true;
        ledge.scale.setTo(0.5,0.5);
        //Creacion de muros que regresan a los enemigos
        murod = murosd.create(270, game.world.height -(250*i)-30, '');
        murod = murosd.create(500, game.world.height -(250*i)-30, '');
        ledge = platforms.create(300, game.world.height -(250*i),'ground');
        ledge.body.immovable = true;
        ledge.scale.setTo(0.5,0.5);
    }
    //Creacion del Jugador y del jefe;
    player = game.add.sprite(32, game.world.height - 150, 'dude');
    boss =game.add.sprite(360,10,'boss');
    game.physics.arcade.enable(player);
    game.physics.arcade.enable(boss);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    boss.body.bounce.y = 0;
    boss.body.collideWorldBounds = true;
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    boss.animations.add('right', [5, 6, 7, 8,9], 20, false);
    boss.animations.add('left', [0, 1, 2, 3,4], 20, false);
    boss.body.immovable = true;

    for (var i = 0; i < 12; i++){
        var coin = coins.create(i * 70, 80, 'coin');
        coin.collideWorldBounds=true;
        coin.body.gravity.y = 300;
        coin.body.bounce.y = 0.1;
        coin.animations.add('rotate',[0,1,2,3,4,5],10,true);
        coin.animations.play('rotate');
    }
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#fff' });
    lifeText = game.add.text(650, 16, 'Vidas: 3', { fontSize: '32px', fill: '#fff' });
    muror = murosr.create(0, game.world.height - 120, '');
    muror = murosr.create(799, game.world.height - 120, '');
    cursors = game.input.keyboard.createCursorKeys();
    Bmove();
    Interval = window.setInterval(Bmove,3000);
    game.camera.follow(player);
  }

  function update() {
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(rocas,platforms);
    game.physics.arcade.collide(boss, platforms);
    game.physics.arcade.collide(coins, platforms);
    game.physics.arcade.collide(demons, platforms);
    game.physics.arcade.collide(rocas, rocas);

    game.physics.arcade.overlap(demons, murosd,regresar, null, this);
    game.physics.arcade.overlap(rocas, murosr, remover, null, this);
    game.physics.arcade.overlap(player, coins, collectcoin, null, this);
    game.physics.arcade.overlap(player, rocas, kill, null, this);
    game.physics.arcade.overlap(player, boss,kill,null,this);
    game.physics.arcade.overlap(player, demons,kill,null,this);
    player.body.velocity.x = 0;
    if (cursors.left.isDown){
        player.body.velocity.x = -150;
        player.animations.play('left');
    }
    else if (cursors.right.isDown){
        player.body.velocity.x = 150;
        player.animations.play('right');
    }else{
        player.animations.stop();
        player.frame = 4;
    }
    if (cursors.up.isDown && player.body.touching.down)    {
        player.body.velocity.y = -350;
    }
}

function collectcoin (player, coin) {
    coin.kill();
    score += 10;
    scoreText.text = 'Score: ' + score
}
function Bmove (){
   if (Sw) {
     boss.animations.play('right');
     roca= rocas.create(boss.x+80, boss.y, 'rock');
     roca.body.velocity.x=150+ Math.random() * 150;
     Sw = false;
   }else{
     boss.animations.play('left');
     roca= rocas.create(boss.x, boss.y, 'rock');
     roca.body.velocity.x=-150- Math.random() * 150;
     Sw = true;
   }
   game.physics.enable(roca, Phaser.Physics.ARCADE);
   roca.body.gravity.y=300;
   roca.body.setCircle(12);
   roca.body.bounce.setTo(1, 0.7);
   roca.body.collideWorldBounds = true;
   roca.animations.add('rotate', [0, 1, 2], 10, true);
   roca.animations.play("rotate");
}
function kill(player, enemy){
    player.kill();
    life--;
    lifeText.text = 'Life: '+ life;
    if (life>0){
    player.reset(32, game.world.height - 150,0);
    }
}
function render () {
    if(roca!=null)game.debug.body(roca);
    if(demon!=null)game.debug.body(demon);
    if(muror!=null)game.debug.body(muror);
    if(murod!=null)game.debug.body(murod);
    game.debug.body(boss);
    game.debug.body(player);
}
function reset() {
    clearInterval(Interval); // stops launching barrels
    clearInterval(focus);
}
function remover(roca){
    roca.kill();
}
function regresar(demon){
  var temp=demon.body.velocity.x;
  if(temp>0){
    demon.animations.play('left');
  }else{
    demon.animations.play('right');
  }
  demon.body.velocity.x=-temp;
}
function checkFocus(){
     if (!document.hasFocus()) {
            clearInterval(Interval);
            flag = true;
     }else{
        if (flag) {
            Interval = window.setInterval(Bmove, 3000);
            flag = false;
        }
     }
}
