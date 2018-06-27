// main function
const mainState = {
  preload: function () {
    game.load.image('bird', 'img/bird.png')
    game.load.image('pipe', 'img/pipe.png')

  },

  // called after preload - setup game, sprites
  create: function () {
    game.stage.backgroundColor = '#71c5cf'
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.bird = game.add.sprite(100, 245, 'bird');
    this.pipes = game.add.group();
    game.physics.arcade.enable(this.bird);
    this.bird.body.gravity.y = 1000;
    this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

    const spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.jump, this);

    //score
    this.score = 0;
    this.labelScore = game.add.text(20, 20, "0", {font: "30px Arial", fill: "ffffff"});
  },

  // called 60 times per second - contains game logic
  update: function () {
    if(this.bird.y < 0 || this.bird.y > 490)
        this.restartGame();

    // restart game on collision
    game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);
  },

  // make bird jump
  jump: function () {
    this.bird.body.velocity.y = -350;
  },

  // add pipe
  addOnePipe: function (x, y) {
    const pipe = game.add.sprite(x ,y, 'pipe');
    this.pipes.add(pipe);
    game.physics.arcade.enable(pipe);
    pipe.body.velocity.x = -200;
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
  },

  // add row of pipes
  addRowOfPipes: function () {
    var hole = Math.floor(Math.random() * 5) + 1;
    for (var i = 0; i < 8; i++) {
      if(i != hole && i != hole + 1 )
          this.addOnePipe(400, i * 60 + 10)
  }
  this.score += 1;
  this.labelScore.text = this.score;
  },

  // restart game
  restartGame: function () {
    game.state.start('main');
  }
};

// initialize Phaser
const game = new Phaser.Game(400, 490);

// add mainstate
game.state.add('main', mainState);

// start state
game.state.start('main');
