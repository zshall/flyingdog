game.module(
    'game.assets'
)
.require(
    'engine.audio'
)
.body(function() {

// Sprites
game.addAsset('player1.png');
game.addAsset('player2.png');
game.addAsset('logo2.png');
game.addAsset('logo1.png');
game.addAsset('cloud4.png');
game.addAsset('cloud3.png');
game.addAsset('cloud2.png');
game.addAsset('cloud1.png');
game.addAsset('ground.png');
game.addAsset('bushes.png');
game.addAsset('parallax3.png');
game.addAsset('parallax2.png');
game.addAsset('parallax1.png');
game.addAsset('particle.png');
game.addAsset('particle2.png');
game.addAsset('bar.png');
game.addAsset('gameover.png');
game.addAsset('new.png');
game.addAsset('restart.png');
game.addAsset('madewithpanda.png');

// Font
game.addAsset('font.fnt');

// Sounds
game.addAudio('sound/explosion.m4a', 'explosion');
game.addAudio('sound/jump.m4a', 'jump');
game.addAudio('sound/score.m4a', 'score');
game.addAudio('sound/highscore.m4a', 'highscore');
game.addAudio('sound/music.m4a', 'music');

});