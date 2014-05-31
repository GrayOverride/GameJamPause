
﻿var game = new Phaser.Game(1800, 720, Phaser.AUTO, 'gamediv');

var player;
var direction_x = 1;
var platforms;
var fireposts;
var cursors;

var stars;
var zombies;
var bullets;
var explosions;
var score = 0;
var time = 0
var scoreText;
var soundeffects_humm;
var soundeffects_blaster1;
var soundeffects_explosion1;
var firepostCooldown = 0;
﻿var hummCooldown = 0;
var button;
var text;
var startText;
var music;

var MusicButtonUp;
var MusicButtonDown;
var MusicButtonPause;
var MusicButtonPlay;




//Keyboard
var key;
var fireButton;
var bulletTime = 0;

//GameStates
var menu_state = {

    preload: function(){
            
            game.load.image('button', '/assets/sprites/ui/menubutton.png');
            game.load.image('spacetile', '/assets/sprites/ambient/spacetile.png');
            game.load.image('galax', '/assets/sprites/ambient/galax.png');
            game.load.image('menu', '/assets/sprites/ui/menu.png');





    },
    create: function(){



    menu_bg_tile = game.add.tileSprite(0, 0, game.stage.bounds.width, game.stage.bounds.height, 'spacetile');
    paragalax = game.add.sprite(300, 0, 'galax');
    menu_bg = game.add.sprite(game.world.width/2 - 440, 300, 'menu');

    
    button = game.add.button(game.world.width/2 - 370, 360, 'button', start_game);
    button.scale.x = 0.50;
    
    startText = game.add.text(game.world.width/2 - 370, 370, 'Start Game');
    startText.font = 'emulogic';
    startText.fontSize = 14;
    startText.fontWeight = 'bold';
    text = game.add.text(game.world.width/2 - 600, 260, 'Welcome to pacosaga!');
    text.font = 'emulogic';
    text.fontSize = 32;
    text.fontWeight = 'bold';
    text.fill = 'steelblue';
    text.setShadow(0, 0, 'rgba(0, 0, 0, 0.5)', 0);
    },
    update: function(){
    
    }


};
var game_state = {

preload: function()  {

    game.load.image('sky', '/assets/sprites/ambient/sky.png');
    game.load.image('star', '/assets/sprites/objects/star.png');
    game.load.spritesheet('dude', '/assets/sprites/characters/enemies/pacorocketeer.png', 301, 203);
    game.load.spritesheet('tinydudeIdle', '/assets/sprites/characters/player/pacoIdle.png', 64, 64);
    game.load.audio('humm', '/assets/sfx/characters/humm.ogg');
    game.load.audio('blaster_1', '/assets/sfx/weapon/blaster_1.ogg');
    game.load.audio('explosion_1', '/assets/sfx/weapon/explosion.ogg');
    game.load.image('blaster1', '/assets/sprites/particles/blaster_1.png');
    game.load.image('firepost', '/assets/sprites/objects/firepost.png');
    game.load.spritesheet('kaboom', '/assets/sprites/particles/explode.png', 128, 128);
    game.load.image('spacetile', '/assets/sprites/ambient/spacetile.png');
    game.load.image('broken', '/assets/sprites/ambient/broken.png');
    game.load.image('rocketjockey', '/assets/sprites/characters/enemies/rocketjockey.png');
    game.load.image('button', '/assets/sprites/ui/menubutton.png');
    game.load.image('playbutton', '/assets/sprites/ui/play_1.png');
    game.load.image('plusbutton', '/assets/sprites/ui/plus_1.png');
    game.load.image('minusbutton', '/assets/sprites/ui/minus_1.png');
    game.load.image('pausebutton', '/assets/sprites/ui/pause_1.png');



    game.load.audio('01', ['assets/music/thrustSequence.ogg']);


},


create: function() {



    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    



    //  A simple background for our game
    bgtile = game.add.tileSprite(0, 0, game.stage.bounds.width, game.stage.bounds.height, 'spacetile');
    parabroken = game.add.sprite(300, 0, 'broken');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();
    fireposts = game.add.group();
    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;
    fireposts.enableBody = true;
    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(0, 0);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges

    // The player and its settings
    player = game.add.sprite(50, game.world.height - 300, 'tinydudeIdle');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    //player.body.bounce.y = 0.2;
    //player.body.gravity.y = 10;
    player.body.collideWorldBounds = false;

    player.animations.add('walking', [0, 1, 2, 3], 7, true);
            player.anchor.setTo(.5, 1);
    player.animations.add('idle', [0], 7, true);
            player.anchor.setTo(.5, 1);
     player.animations.add('firing', [6, 7], 7, true);
            

    //  Finally some stars to collect
    stars = game.add.group();
    stars.enableBody = true;

    zombies = game.add.group();
    zombies.enableBody = true;
    zombies.physicsBodyType = Phaser.Physics.ARCADE;


    //  The score
    scoreText = game.add.text(16, 16, 'Score: 0', {fill: '#fff' });
    scoreText.font = 'emulogic';
    scoreText.fontSize = 20;
    
    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    key = Phaser.Keyboard;
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // Sound
    soundeffects_humm = game.add.audio('humm');
    soundeffects_blaster1 = game.add.audio('blaster_1');
    soundeffects_explosion1 = game.add.audio('explosion_1');

    //Bullets
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(50, 'blaster1');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);

    //Explosions
    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(setupExplosion, this);

        //here be music dragons
    music = game.add.audio('01');
    //uncomment render for sexy sound debug
    //render();
    music.volume = 0.1;
    music.play();
    MusicButtonUp = game.add.button(game.world.width/2 +380, game.world.height/2 - 360, 'plusbutton', increseMusic);
    //MusicButtonPause = game.add.button(game.world.width/2 +200, game.world.height/2 - 360, 'pausebutton', increseMusic);
    //MusicButtonPlay = game.add.button(game.world.width/2 +260, game.world.height/2 - 360, 'playbutton', increseMusic);
    MusicButtonDown = game.add.button(game.world.width/2 +320 ,game.world.height/2 - 360, 'minusbutton', decreseMusic);

},


update: function() {
    if (game.time.now > firepostCooldown) {
        createLedge();
        createStar();
        createEnemyOne();
        firepostCooldown = game.time.now + Math.floor((Math.random() * 1000 )+400);
    }
    if (game.time.now > hummCooldown) {
        soundeffects_humm.play('');
        hummCooldown = game.time.now + Math.floor((Math.random() * 1000) + 400);
    }
    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.collide(player, zombies);
    game.physics.startSystem(Phaser.Physics.ARCADE);


    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    game.physics.arcade.overlap(bullets, stars, collisionHandler, null, this);
    game.physics.arcade.overlap(bullets, zombies, enemyHandler, null, this);
    game.physics.arcade.overlap(player, zombies, restart_game, null, this);


    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -300;
        direction_x = 1;
        player.scale.x = direction_x;
        player.animations.play('walking');
    }
     if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 300;
        direction_x = 1;
        player.scale.x = direction_x;
        player.animations.play('walking');
    }    
    if (cursors.up.isDown)
    {
        //  Move up
        player.body.velocity.y = -300;
        direction_y = 1;
        player.scale.y = direction_y;
        player.animations.play('walking');
    }
   if (cursors.down.isDown)
    {
        //  Move down
        player.body.velocity.y = 300;
        direction_y = 1;
        player.scale.y = direction_y;
        player.animations.play('walking');
    }

    else
    {
        //  Stand still
      player.animations.play('walking');
    }
    
    //  Allow the player to jump if they are touching the ground.
    // if (cursors.up.isDown && player.body.touching.down)
    // {
    //     player.body.velocity.y = -350;
    //     soundeffects_humm.play('');
    // }
    if (game.input.keyboard.isDown(key.SPACEBAR)) {
        player.animations.play('walking');

        fireBullet(player);
    }
    bgtile.tilePosition.x -= 1;

    if (player.body.position.x < -100 || player.body.position.x > 750) {
        restart_game();
    }
   
}
};

game.state.add('menu', menu_state);
game.state.add('game', game_state);  
game.state.start('menu'); 


 function restart_game() {
    music.stop();
    this.score = 0;
     this.game.state.start('menu');

    }

 function start_game() {
     this.score = 0;
     this.game.state.start('game');
    }
function fireBullet () {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime)
    {
        //  Grab the first bullet we can from the pool
        var bullet = bullets.getFirstExists(false);

        if (bullet) {
            //  And fire it
            bullet.reset(player.x+25*direction_x, player.y -26);
            bullet.body.velocity.x = direction_x * 800;
            bulletTime = game.time.now + 400;
            bullet.lifespan = game.width / (bullet.body.velocity.x / 1000);
            soundeffects_blaster1.play('',0,0.10,false,true);
        }
    }

}
function createLedge()
    {
        //  Create a star inside of the 'stars' group
        //var ledge = platforms.create(1000, ((Math.random() * 450)+400) , 'ground');
        //ledge.body.velocity.x = -400; 
        //ledge.body.immovable = true;
        //ledge.body.gravity.y = 5;
        //var firepost = fireposts.create(1000, game.world.height - 134, 'firepost');
        //firepost.body.velocity.x = -400;
        //firepost.body.immovable = true;

    }
function resetBullet (bullet) {

    //  Called if the bullet goes out of the screen
    bullet.kill();

}

function createEnemyOne()
    {
        var randx = Math.floor((Math.random() * -550)-100)
        var zombie = zombies.create(1400, game.world.height+randx, 'rocketjockey');
        zombie.body.velocity.x = -650;
    }

function createStar()
    {
        var randx = Math.floor((Math.random() * -550)-100)
    //  Here we'll create 12 of them evenly spaced apart
        //  Create a star inside of the 'stars' group
        var star = stars.create(1400, game.world.height+randx, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 0;
        star.body.velocity.x = -400;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }
function collectStar (player, star) {
    
    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

}
function collisionHandler (bullet, star) {

    //  When a bullet hits an alien we kill them both
    bullet.kill();
    star.kill();
    var explosion = explosions.getFirstExists(false);
    explosion.reset(star.body.x, star.body.y);
    explosion.play('kaboom', 30, false, true);
    soundeffects_explosion1.play('',0,0.2,false,true);
    //  Increase the score
    score += 10;
    scoreText.text = 'Score: ' + score;

}
function setupExplosion (explosion) {
     explosion.anchor.x = 0.5;
    explosion.anchor.y = 0.5;
    explosion.animations.add('kaboom');

}
function enemyHandler (bullet, zombie) {

    //  When a bullet hits an alien we kill them both
    bullet.kill();
    zombie.kill();
    var explosion = explosions.getFirstExists(false);
    explosion.reset(zombie.body.x, zombie.body.y);
    explosion.play('kaboom', 30, false, true);
    soundeffects_explosion1.play('',0,0.2,false,true);
    //  Increase the score
    score += 20;
    scoreText.text = 'Score: ' + score;
}

function render() {

    game.debug.soundInfo(music, 20, 32);

}

function increseMusic(){
music.volume += 0.1;

}
function decreseMusic(){
music.volume -= 0.1;
}


