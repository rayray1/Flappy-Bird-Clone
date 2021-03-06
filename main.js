// main function
const mainState = {
  preload: function () {
    game.load.audio('jump', 'assets/jump.wav');
    game.load.image('bird', 'assets/flapbird.png');
    game.load.image('pipe', 'assets/pipe.png');

  },

  // setup game, sprites
  create: function () {
    this.jumpSound = game.add.audio('jump');
    game.stage.backgroundColor = '#71c5cf';
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.bird = game.add.sprite(100, 245, 'bird');
    this.pipes = game.add.group();
    game.physics.arcade.enable(this.bird);
    game.input.onDown.add(this.jump, this);
    this.bird.body.gravity.y = 1000;
    this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
    this.bird.anchor.setTo(-0.2, 0.5);

    const spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.jump, this);

    // score
    this.score = 0;
    this.labelScore = game.add.text(20, 20, "0", {font: "30px Arial", fill: "ffffff"});
  },

  // update
  update: function () {
    if(this.bird.y < 0 || this.bird.y > 490)
        this.restartGame();
    if(this.birdangle < 20)
        this.bird.angle =+ 1;

    // restart game on collision
    game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
  },

  // make bird jump
  jump: function () {
    if(this.bird.alive == false)
        return;
    this.bird.body.velocity.y = -350;
    const animation = game.add.tween(this.bird).to({angle: -20}, 100).start();
    this.jumpSound.play()
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

  // hitpipe
  hitPipe: function () {
    if(this.bird.alive == false)
        return;
    this.bird.alive == false;
    game.time.events.remove(this.timer);
    this.pipes.forEach(function (p) {
        p.body.velocity.x = 0;
    }, this);
  },

  // restart game
  restartGame: function () {
    game.state.start('main');
  }
};

// initialize Phaser
const game = new Phaser.Game(400, 490, Phaser.AUTO, 'flap');

// add mainstate
game.state.add('main', mainState);

// start state
game.state.start('main');
