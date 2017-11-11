var game = new Phaser.Game(800, 1200, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('forest', 'assets/forest.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.spritesheet('demon', 'assets/demon.png',80,70);
    game.load.spritesheet('coin', 'assets/coin.png',40,45);
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('boss','assets/boss.png',80,70);
    game.load.spritesheet('boss','assets/boss.png',80,70);
    game.load.spritesheet('rock','assets/rock.png',50,50);

   // game.world.setBounds(0,0,600,1000);
}
var player;
var boss;
var platforms;
var cursors;
var coins;
var score = 0;
var scoreText;
var rocas;
var roca;
var Sw, Sw2 = true;
var demon;
var demons;
var flag = false;
var Interval, Interval2 = false;
var focus = false;

function create() {
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //  A simple background for our game
    game.add.sprite(0, 0, 'forest');
    //  The platforms group contains the ground and the 2 ledges we can jump on



    focus = setInterval(checkFocus, 200);

   /* demons=game.add.group();
    demons.enableBody = true;
    demon=demons.create(0, 0, 'demon');
    demon.body.gravity.y = 300;
    demon.body.bounce.y = 0;
    demon.animations.add('left',[0,1,2],10,true);
    demon.animations.add('right',[3,4,5],10,true);
    demon.animations.add('dead',[6,7],10,false);
    demon.animations.play('right');
    demon.collideWorldBounds=true;*/
    //demon.body.velocity.x=100;
    var Sum = 0;
    demons = game.add.group();
    demons.enableBody = true;

   for (var i = 0; i < 4; i++) {
        demon = demons.create(360, game.world.height -(325+Sum), 'demon');
        demon.body.gravity.y = 300;
        demon.body.bounce.y = 0;
        demon.animations.add('left',[0,1,2],10,true);
        demon.animations.add('right',[3,4,5],10,true);
        demon.animations.add('dead',[6,7],10,false);
        Sum = Sum +250;
       
   }
  
     Interval2 = window.setInterval(Dmove,3000);
   
    


    platforms = game.add.group();
    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;
    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);
    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
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

        ledge = platforms.create(300, game.world.height -(250*i),'ground');
        ledge.body.immovable = true;
        ledge.scale.setTo(0.5,0.5);

    }


    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');
    boss =game.add.sprite(360,10,'boss');
    //  We need to enable physics on the player
    game.physics.arcade.enable(player);
    game.physics.arcade.enable(boss);
    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    boss.body.bounce.y = 0;
    boss.body.collideWorldBounds = true;
    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    boss.animations.add('right', [5, 6, 7, 8,9], 20, false);
    boss.animations.add('left', [0, 1, 2, 3,4], 20, false);
    boss.body.immovable = true;

    //  Finally some stars to collect
    coins = game.add.group();
    //  We will enable physics for any star that is created in this group
    coins.enableBody = true;
    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++){
        //  Create a star inside of the 'stars' group
        var coin = coins.create(i * 70, 80, 'coin');
        //  Let gravity do its thing
        coin.collideWorldBounds=true;
        coin.body.gravity.y = 300;
        //  This just gives each star a slightly random bounce value
        coin.body.bounce.y = 0.7 + Math.random() * 0.2;
        //create the animation from the sprite and turn on}
        coin.animations.add('rotate',[0,1,2,3,4,5],10,true);
        coin.animations.play('rotate');
    }
    rocas = game.add.group();
    rocas.enableBody = true;
    game.physics.arcade.enable(rocas);
    //  The score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    //boss move;
    Interval = window.setInterval(Bmove,3000);
    Bmove();
    

    //game.camera.follow(player);
  }

  function update() {
      //  Collide the player and the coins with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(rocas,platforms);
    game.physics.arcade.collide(boss, platforms);
    game.physics.arcade.collide(coins, platforms);
    game.physics.arcade.collide(demons, platforms);
    game.physics.arcade.collide(rocas, rocas);
    //  Checks to see if the player overlaps with any of the coins, if he does call the collectcoin function
    game.physics.arcade.overlap(player, coins, collectcoin, null, this);
    game.physics.arcade.overlap(player, rocas, killR, null, this);
    game.physics.arcade.overlap(player, boss,kill,null,this);
    game.physics.arcade.overlap(player, demons,kill,null,this);
    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    if (cursors.left.isDown){
        //  Move to the left
        player.body.velocity.x = -150;
        player.animations.play('left');
    }
    else if (cursors.right.isDown){
        //  Move to the right
        player.body.velocity.x = 150;
        player.animations.play('right');
    }else{
        //  Stand still
        player.animations.stop();
        player.frame = 4;
    }
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)    {
        player.body.velocity.y = -350;
    }
}

function collectcoin (player, coin) {
    // Removes the coin from the screen
    coin.kill();
    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score
}
function rebound(roca1, roca2){
  roca1.body.velocity.x=-roca1.body.velocity.x;
  roca2.body.velocity.x=-roca2.body.velocity.x;
}
function Bmove (){
   if (Sw) {
     boss.animations.play('right');
     roca= rocas.create(boss.x+80, boss.y, 'rock');
     roca.body.velocity.x=150;
     Sw = false;
   }else{
     boss.animations.play('left');
     roca= rocas.create(boss.x, boss.y, 'rock');
     roca.body.velocity.x=-150;
     Sw = true;
   }
   //roca.events.onOutOfBounds.add(rocaout, this);
   roca.body.gravity.y=150;
   roca.body.setCircle(17.05);
   roca.body.bounce.setTo(1, 0.1);
   roca.body.collideWorldBounds = true;

}

function Dmove(){
    if (Sw2) {
        demon.body.velocity.x = 20;
        demon.animations.play('right');
        Sw2 = false;
    }else{
        demon.body.velocity.x = -20;
        demon.animations.play('left');
        Sw2 = true;
    }
}

function killR(player, enemy){
    player.kill();
    enemy.kill();
/*    life--;
    lifeText.text = 'life: '+ life;
    if (life>0){
  */  player.reset(32, game.world.height - 150,0);
  //}
}
function kill(player, enemy){
    player.kill();
/*    life--;
    lifeText.text = 'life: '+ life;
    if (life>0){
  */  player.reset(32, game.world.height - 150,0);
  //}
}
function render () {
    if(roca!=null)game.debug.body(roca);
    if(demon!=null)game.debug.body(demon);
    game.debug.body(boss);
    game.debug.body(player);
}
function reset() {
    clearInterval(Interval); // stops launching barrels
    clearInterval(focus);
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


