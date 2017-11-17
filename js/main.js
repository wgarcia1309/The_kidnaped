var player,boss, princesa;
var platforms,coins,rocas,demons,deads;
var roca,demon,muror,murod;
var cursors;
var scoreText,scoreLife;
var score =0,life=3;
var Sw, Sw2 = true;
var flag = false;
var Interval, Interval2 = false;
var focus = false;
var mainAudio;
var mainState = {
    create:function () {
        mainAudio = game.add.audio('smain');
		    mainAudio.play();
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.sprite(0, 0, 'castle');
        focus = setInterval(checkFocus, 200);
        var Sum = 0;
        platforms = game.add.group();
        rocas = game.add.group();
        demons = game.add.group();
        murosd = game.add.group();
        murosr = game.add.group();
        coins = game.add.group();
        platforms.enableBody = true;
        rocas.enableBody = true;
        demons.enableBody = true;
        coins.enableBody = true;
        murosd.enableBody=true;
        murosr.enableBody=true;
        for (var i = 0; i < 4; i++) {
            demon = demons.create(360,game.world.height -(325+Sum), 'demon');
            demon.body.gravity.y = 300;
            demon.body.bounce.y = 0;
            demon.body.bounce.x = 1;
            demon.animations.add('left',[0,1,2],10,true);
            demon.animations.add('right',[3,4,5],10,true);
            demon.animations.add('dead',[6,7],10,false);
            //monedas al lado izquierdo de los esbirros
            if (i%2==0) {
              makeCoin(300,325+Sum);
            }
            //monedas lado derecho de los esbirros
            if (i%2==1) {
              makeCoin(460,325+Sum);
            }
            var d= Math.random()*10;
            if(d>5){
              d= -60-Math.random()*40;
              demon.body.velocity.x =d;
              demon.animations.play("left");
            }else{
              d= 60+Math.random()*40;
              demon.body.velocity.x = d;
              demon.animations.play("right");
            }
            Sum = Sum +250;
       }
       //Creacion del suelo
        platf(0,64,2,2);
        //Creacion de plataformas
        platf(360,game.world.height-80,0.2,0.5);
        //Plataforma de la princesa
        platf(600,1000,0.5,0.5);
        platf(0,1000,0.5,0.5);
        for (var i = 1; i<5; i++) {
            if (i==4) {
              platf(0,200*i,0.5,0.5);
              platf(600,200*i,0.5,0.5);
              platf(300,235*i,0.5,0.5);
            }else{
              platf(0,200*i,0.5,0.5);
              platf(600,200*i,0.5,0.5);
              platf(300,250*i,0.5,0.5);
            }

            //monedas en las plataformas sin esbirros (izquierda)
            if (i%2==1 || i ==4) {
              makeCoin(60,260*i);
            }
            //monedas en las plataformas sin esbirros (derecha)
            if (i==1) {
              makeCoin(700,260*2);
              makeCoin(700,970);
              makeCoin(700, 100);
            }
            //Creacion de muros que regresan a los enemigos
            murod = murosd.create(270, game.world.height -(250*i)-30, '');
            murod = murosd.create(500, game.world.height -(250*i)-30, '');

        }
        //Creacion del Jugador y del jefe;
        player = game.add.sprite(32, game.world.height - 100, 'dude');
        princesa = game.add.sprite(700, game.world.height -1150, 'princesa');
        boss =game.add.sprite(360,10,'boss');
        game.physics.arcade.enable(player);
        game.physics.arcade.enable(princesa);
        game.physics.arcade.enable(boss);
        princesa.body.bounce.y=0.2;
        princesa.body.gravity.y=300;
        player.body.gravity.y = 400;
        princesa.body.collideWorldBounds=true;
        player.body.collideWorldBounds = true;
        boss.body.bounce.y = 0;
        boss.body.collideWorldBounds = true;
        player.animations.add('left', [0, 1, 2, 3, 4], 10, true);
        player.animations.add('right', [6, 7, 8, 9, 10], 10, true);
        boss.animations.add('right', [5, 6, 7, 8,9], 20, false);
        boss.animations.add('left', [0, 1, 2, 3,4], 20, false);
        boss.body.immovable = true;
        muror = murosr.create(0, game.world.height - 120, '');
        muror = murosr.create(799, game.world.height - 120, '');
        cursors = game.input.keyboard.createCursorKeys();
        Bmove();
        Interval = window.setInterval(Bmove,3000);
        scoreText = game.add.text(100, game.world.height, 'Score: '+score, {fontSize: '32px', fill: '#fff' });
        scoreLife = game.add.text(500, 16, 'Life: '+life, {fontSize: '32px', fill: '#fff' });
        game.camera.follow(player);
        scoreText.fixedToCamera = true;
        scoreText.cameraOffset.setTo(10, 0);
        scoreText.setShadow(3, 3, 'rgba(0,0,0,1)', 5);
        scoreLife.fixedToCamera = true;
        scoreLife.cameraOffset.setTo(10, 30);
        scoreLife.setShadow(3, 3, 'rgba(0,0,0,1)', 5);
      },
    update:function () {
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(rocas,platforms);
        game.physics.arcade.collide(boss, platforms);
        game.physics.arcade.collide(coins, platforms);
        game.physics.arcade.collide(demons, platforms);
        game.physics.arcade.collide(rocas, rocas);
        game.physics.arcade.collide(princesa, platforms);

        game.physics.arcade.overlap(demons, murosd,regresar, null, this);
        game.physics.arcade.overlap(rocas, murosr, remover, null, this);
        game.physics.arcade.overlap(player, coins, collectcoin, null, this);
        game.physics.arcade.overlap(player, rocas, loseG, null, this);
        game.physics.arcade.overlap(player, boss,loseG, null, this);
        game.physics.arcade.overlap(player, demons,loseG, null, this);
        game.physics.arcade.overlap(player, princesa,winG,null, this);

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
    },
    win:function (){
      game.state.start('win');
    },
    lose:function (){
      game.state.start('lose');
    }
  };
    function collectcoin (player, coin) {
        mainAudio.pause();
        var  sound= game.add.audio('scoin');
        sound.play();
        mainAudio.resume();
        coin.kill();
        score += 10;
        scoreText.text = 'Score: ' + score;
    }
    function winG(){
        if (score >=100) {
            reset();
            mainState.win();
        }
    }
    function loseG(player,enemy){
        mainAudio.pause();
        if(life>1){
            life--;
            scoreLife.text = 'Life: ' + life;
            player.reset(32, game.world.height - 100);
        }else{
        reset();
        mainState.lose();
      }
      var  sound= game.add.audio('sperder');
      sound.play();
      mainAudio.resume();
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
       roca.body.bounce.setTo(1, 0);
       roca.body.collideWorldBounds = true;
       roca.animations.add('rotate', [0, 1, 2], 10, true);
       roca.animations.play("rotate");
    }

    function reset() {
        life=3;
        score=0;
        clearInterval(Interval); // stops launching barrels
        clearInterval(focus);
    }
    function remover(roca){
        roca.kill();
    }
    function makeCoin(x,y){
      coin = coins.create(x,game.world.height -y, 'coin');
      coin.collideWorldBounds=true;
      coin.body.gravity.y = 300;
      coin.body.bounce.y = 0.1;
      coin.scale.setTo(0.7,0.7);
      coin.animations.add('rotate',[0,1,2,3,4,5],10,true);
      coin.animations.play('rotate');
    }
    function platf(x,y,x1,x2){
      var ground = platforms.create(x, game.world.height - y, 'ground');
      ground.scale.setTo(x1, x2);
      ground.body.immovable = true;
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
