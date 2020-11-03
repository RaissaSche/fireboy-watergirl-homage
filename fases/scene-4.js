import Phaser from "phaser";
import logoImg from "../assets/logo.png";

class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
    this.platforms;
    this.player;
    this.cursors;
    this.stars;
    this.score = 0;
    this.scoreText;
    this.gameOver = false;
    this.door;
    this.danger1;
    this.danger2;
  }

  preload() {
    this.load.image("logo", logoImg);
    this.load.image("sky", "assets/sky.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image("star", "assets/star.png");
    this.load.image("bomb", "assets/bomb.png");

    this.load.image("door", "assets/door.png");
    this.load.image("danger1", "assets/danger1.png");
    this.load.image("danger2", "assets/danger2.png");

    this.load.spritesheet("dude", "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    //fundo
    this.add.image(400, 300, "sky");

    //portas
    this.door=this.physics.add.staticGroup();
    this.door.create(400, 370, "door").setScale(2).refreshBody();

    //blocos mortais (tentei implementar uma logica d colisão)
    this.danger1=this.physics.add.staticGroup();
    this.danger1.create(650, 530, "danger1").setScale(0.5, 0.75).refreshBody();
    this.danger1.create(200, 530, "danger1").setScale(0.5, 0.75).refreshBody();
    
    //this.danger1.create(300, 390, "danger1").setScale(0.25,0.75).refreshBody();
    // this.physics.add.collider(
    //   this.player,
    //   this.danger1,
    //   this.hitDanger1,
    //   null,
    //   this
    // );
    //this.danger2=this.physics.add.staticGroup();
    //this.danger2.create(300, 390, "danger2").setScale(0.25,0.75).refreshBody();

    //plataformas
    this.platforms = this.physics.add.staticGroup();

    this.platforms.create(400, 568, "ground").setScale(2).refreshBody();

    this.platforms.create(400, 400, "ground").setScale(0.8, 0.5).refreshBody();
    this.platforms.create(50, 250, "ground").setScale(0.3, 1).refreshBody();
    this.platforms.create(750, 250, "ground").setScale(0.3, 1).refreshBody();
    this.platforms.create(400, 100, "ground").setScale(0.6, 0.5).refreshBody();

    //player
    this.player = this.physics.add.sprite(50, 450, "dude");

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms);

    //animações
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    //estrelas
    this.stars = this.physics.add.group({
      key: "star",
      repeat: 4,
      setXY: { x: 100, y: 0, stepX: 150 },
    });
    // this.stars = this.physics.staticGroup();
    // this.stars.create(400, 0, "ground").setScale(2).refreshBody();


    this.stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );

    //pontuação
    this.scoreText = this.add.text(16, 16, "score: 0", {
      fontSize: "32px",
      fill: "#000",
    });

    //bombas
    this.bombs = this.physics.add.group();

    this.physics.add.collider(this.bombs, this.platforms);

    this.physics.add.collider(
      this.player,
      this.bombs,
      this.hitBomb,
      null,
      this
    );
  }

  update() {
    //movimentação
    this.cursors = this.input.keyboard.createCursorKeys();

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);

      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);

      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play("turn");
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }

  collectStar(player, star) {
    star.disableBody(true, true);

    this.score += 10;
    this.scoreText.setText("Score: " + this.score);

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });

      var x =
        player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);

      var bomb = this.bombs.create(x, 16, "bomb");
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
  }

  hitBomb(player, bomb) {
    this.physics.pause();
    this.player.setTint(0xff0000);
    this.player.anims.play("turn");

    this.gameOver = true;
  }

  // hitDanger1(player, danger1) {
  //   this.physics.pause();
  //   this.player.setTint(0xff0000);
  //   this.player.anims.play("turn");

  //   this.gameOver = true;
  // }
}

export default playGame;
