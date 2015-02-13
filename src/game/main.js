game.module(
    'game.main'
)
.require(
    'game.assets',
    'game.objects'
)
.body(function() {

game.createScene('Main', {
    backgroundColor: 0x000000,
    //obstacleInterval: 1500,
	obstacleInterval: 2000,
	minObsacleInterval: 1300,
	obstacleDifficultyIncrease: 100,
	obstacleDifficultyInterval: 5,
	obstacleWidth: 500,
	obstacleWidthInterval: 2,
	obstacleWidthDecrease: 50,
	minObstacleWidth: 250,
    gravity: 2000,
    score: 0,
    cloudSpeedFactor: 1,
	difficultyTimer: null,

    init: function() {
        this.world = new game.World(0, this.gravity);
        
        this.addParallax(0, 'parallax1.png', -50);
        this.addParallax(250, 'parallax2.png', -100);
        this.addParallax(450, 'parallax3.png', -200);

        /*this.addCloud(100, 100, 'cloud1.png', -50);
        this.addCloud(300, 50, 'cloud2.png', -30);*/

        this.logo = new game.Logo();

        /*this.addCloud(650, 100, 'cloud3.png', -50);
        this.addCloud(700, 200, 'cloud4.png', -40);*/

        this.addParallax(550, 'bushes.png', -250);
        this.obstacleContainer = new game.Container();
        this.obstacleContainer.addTo(this.stage);
        this.addParallax(700, 'ground.png', -300);

        this.player = new game.Player();
        
        var groundBody = new game.Body({
            position: { x: game.system.width / 2, y: 850 },
            collisionGroup: 0
        });
        var groundShape = new game.Rectangle(game.system.width, 320);
        groundBody.addShape(groundShape);
        this.world.addBody(groundBody);

        this.scoreText = new game.BitmapText(this.score.toString(), { font: 'Pixel' });
        this.scoreText.position.x = game.system.width / 2 - this.scoreText.width / 2;
        this.scoreText.addTo(this.stage);

        /*var text = new game.Sprite('madewithpanda.png', game.system.width / 2, game.system.height - 48, {
            anchor: { x: 0.5, y: 0 }
        }).addTo(this.stage);*/

        game.audio.musicVolume = 0.2;
        game.audio.playMusic('music');
    },

    addObstacle: function() {
        this.addObject(new game.Obstacle(this.obstacleWidth));
    },

    addScore: function() {
        this.score++;
		// increase obstacle interval each time
		if (this.score % this.obstacleDifficultyInterval == 0 && this.obstacleInterval > this.minObsacleInterval) {
			this.obstacleInterval -= this.obstacleDifficultyIncrease;
			this.removeTimer(this.difficultyTimer);
			this.difficultyTimer = this.addTimer(this.obstacleInterval, this.addObstacle.bind(this), true);
		}
		if (this.score % this.obstacleWidthInterval == 0 && this.obstacleWidth > this.minObstacleWidth) {
			this.obstacleWidth -= this.obstacleWidthDecrease;
		}
        this.scoreText.setText(this.score.toString());
        this.scoreText.updateTransform();
        this.scoreText.position.x = game.system.width / 2 - this.scoreText.width / 2;
        game.audio.playSound('score');
    },

    /*addCloud: function(x, y, path, speed) {
        var cloud = new game.Cloud(path, x, y, speed);
        cloud.sprite.addTo(this.stage);
        this.addObject(cloud);
    },*/

    addParallax: function(y, path, speed) {
        var parallax = new game.TilingSprite(path, pandaConfig.system.width, pandaConfig.system.height);
        parallax.position.y = y;
        parallax.speed.x = speed;
        parallax.addTo(this.stage);
        this.addObject(parallax);
    },

    mousedown: function(event) {
        if (this.ended) return;

        // Android double tap fix
        if (game.device.mobile && !event.originalEvent.changedTouches) return;

        if (this.player.body.mass === 0) {
            game.analytics.send('play');
            this.player.body.mass = 1;
            this.logo.remove();
            this.difficultyTimer = this.addTimer(this.obstacleInterval, this.addObstacle.bind(this), true);
        }
        this.player.jump();
    },
  
    keydown: function(key) {
		if (this.ended) {
			if (key === '1') {
				game.system.setScene('Main');
			}
            return;
		}
		
        if (key === 'CTRL') {
            if (this.player.body.mass === 0) {
                game.analytics.send('play');
                this.player.body.mass = 1;
                this.logo.remove();
                this.difficultyTimer = this.addTimer(this.obstacleInterval, this.addObstacle.bind(this), true);
            }
            this.player.jump();
        }
    },

    showScore: function() {
        var box = new game.Sprite('gameover.png', game.system.width / 2, game.system.height / 2, { anchor: { x: 0.5, y: 0.5 }});
        box.addTo(this.stage);

        var highScore = game.storage.get('highScore', 0);
		var initials = game.storage.get('initials', 'AAA');
		var oldInitials = game.storage.get('initials', 'AAA');
		var showNewInitials = false;
        if (this.score > highScore) {
			showNewInitials = true;
			initials = prompt("High score! Please enter your initials", oldInitials);
			initials = initials.substring(0,3).toUpperCase();
			
			game.storage.set('highScore', this.score);
			game.storage.set('initials', initials);
		}

        var highScoreText = new game.BitmapText(highScore.toString() + ', ' + oldInitials, { font: 'Pixel' });
        highScoreText.position.x = 27;
        highScoreText.position.y = 43;
        highScoreText.addTo(box);

        var scoreText = new game.BitmapText('0', { font: 'Pixel' });
        scoreText.position.x = highScoreText.position.x;
        scoreText.position.y = -21;
        scoreText.addTo(box);

        this.restartButton = new game.Sprite('restart.png', game.system.width / 2, game.system.height / 2 + 250, {
            anchor: { x: 0.5, y: 0.5 },
            scale: { x: 0, y: 0 },
            interactive: true,
            buttonMode: true,
            mousedown: function() {
                game.system.setScene('Main');
            }
        });

        if (this.score > 0) {
            var time = Math.min(100, (1 / this.score) * 1000);
            var scoreCounter = 0;
            this.addTimer(time, function() {
                scoreCounter++;
                scoreText.setText(scoreCounter.toString());
				game.audio.playSound('score');
                if (scoreCounter >= game.scene.score) {
                    this.repeat = false;
					var showInitials =  showNewInitials ? (', ' + initials) : '';
					scoreText.setText(game.scene.score + showInitials);
                    if (game.scene.score > highScore) {
                        game.audio.playSound('highscore');
                        var newBox = new game.Sprite('new.png', -235, -4);
                        box.addChild(newBox);
                    }
                    game.scene.showRestartButton();
                }
            }, true);
        }
        else {
            this.showRestartButton();
        }
    },

    showRestartButton: function() {
        this.addTween(this.restartButton.scale, {
            x: 1, y: 1
        }, 200, {
            easing: 'Back.Out'
        }).start();

        this.restartButton.addTo(this.stage);
    },

    gameOver: function() {
        this.cloudSpeedFactor = 0.2;
        this.ended = true;
        this.timers.length = 0;

        var i;
        for (i = 0; i < this.objects.length; i++) {
            if (this.objects[i].tilePosition) this.objects[i].speed.x = 0;
        }
        for (i = 0; i < this.world.bodies.length; i++) {
            this.world.bodies[i].velocity.set(0, 0);
        }

        this.addTimer(500, this.showScore.bind(this));

        game.audio.stopMusic();
        game.audio.playSound('explosion');
    }
});

});
