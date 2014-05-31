<<<<<<< HEAD
﻿var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gamediv', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('sky', '/assets/sky.png');
    game.load.image('ground', '/assets/platform.png');
    game.load.image('star', '/assets/star.png');
    game.load.spritesheet('dude', '/assets/pacorocketeer.png', 301, 203);
    game.load.audio('humm', '/assets/humm.ogg');
    game.load.audio('blaster_1', '/assets/blaster_1.ogg');
    game.load.audio('explosion_1', '/assets/explosion.ogg');
    game.load.image('blaster1', '/assets/blaster_1.png');
    game.load.spritesheet('kaboom', '/assets/explode.png', 128, 128);

}

var player;
var direction_x = 1;
var platforms;
var cursors;

var stars;
var bullets;
var explosions;
var score = 0;
var scoreText;
var soundeffects_humm;
var soundeffects_blaster1;
var soundeffects_explosion1;

//Keyboard
var key;
var fireButton;
var bulletTime = 0;

function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');
    

    //  The platforms group contains the ground and the 2 ledges we can jump on
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
    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('walking', [0, 1, 2], 10, true);
            player.anchor.setTo(.5, 1);

    //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 300;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    //  The score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

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
    bullets.createMultiple(30, 'blaster1');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);

    //Explosions
    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(setupExplosion, this);
}
function setupExplosion (explosion) {

    explosion.anchor.x = 0.5;
    explosion.anchor.y = 0.5;
    explosion.animations.add('kaboom');

}

function update() {

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.startSystem(Phaser.Physics.ARCADE);


    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    game.physics.arcade.overlap(bullets, stars, collisionHandler, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;
        direction_x = -1;
        player.scale.x = direction_x;
        player.animations.play('walking');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;
        direction_x = 1;
        player.scale.x = direction_x;
        player.animations.play('walking');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
        soundeffects_humm.play('');
    }
    if (game.input.keyboard.isDown(key.SPACEBAR)) {
        fireBullet(player);
    }

}
function fireBullet () {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime)
    {
        //  Grab the first bullet we can from the pool
        var bullet = bullets.getFirstExists(false);

        if (bullet) {
            //  And fire it
            bullet.reset(player.x +180*direction_x, player.y -110);
            bullet.body.velocity.x = direction_x * 800;
            bulletTime = game.time.now + 400;
            soundeffects_blaster1.play('');
        }
    }

}

function resetBullet (bullet) {

    //  Called if the bullet goes out of the screen
    bullet.kill();

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
    soundeffects_explosion1.play('');
    //  Increase the score
    score += 10;
    scoreText.text = 'Score: ' + score;

=======
﻿var game = new Phaser.Game(1800, 600, Phaser.AUTO, 'gamediv', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('sky', '/assets/sky.png');
    game.load.image('ground', '/assets/platform.png');
    game.load.image('star', '/assets/star.png');
    game.load.spritesheet('dude', '/assets/pacorocketeer.png', 301, 203);
    game.load.audio('humm', '/assets/humm.ogg');

}

var player;
var platforms;
var cursors;

var stars;
var score = 0;
var scoreText;
var soundeffects_humm;



function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    bgtile = game.add.tileSprite(0, 0, game.stage.bounds.width, game.cache.getImage('sky').height, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    //ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    //ground.body.immovable = true;

    //  Now let's create two ledges
    setInterval(function(){createLedge()}, 500);
    function createLedge()
    {
        //  Create a star inside of the 'stars' group
        var ledge = platforms.create(1000, ((Math.random() * 450)+400) , 'ground');
        ledge.body.velocity.x = -400; 
        ledge.body.immovable = true;
        ledge.body.gravity.y = 5;
    
    }

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('walking', [0, 1, 2], 10, true);
            player.anchor.setTo(.5, 1);

    //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 300;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    //  The score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();

    // Sound
    soundeffect_humm = game.add.audio('humm');


}

function update() {


    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;
        player.scale.x = -1;
        player.animations.play('walking');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;
        player.scale.x = 1;
        player.animations.play('walking');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
        soundeffect_humm.play('');
    }
bgtile.tilePosition.x -= 1;

    if (player.body.inWorld == false)
    {
        
        restart_game();
    }
    function restart_game(){  
    create();
    }
}

function collectStar (player, star) {
    
    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

>>>>>>> f00cfc429944d79b752fc62fc6e674e22888121b
}