import Phaser from "phaser";
import logoImg from "../assets/logo.png";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001";

class playGame extends Phaser.Scene {
  constructor() {
    super({ key: "playGame" });
    this.score = 0;
    this.pass = 0;
    this.PosX1 = 50;
    this.PosY1 = 450;
    this.PosX2 = 740;
    this.PosY2 = 450;
    this.gameOver = false;
    this.socket = socketIOClient(ENDPOINT);
  }

  client() {
    const _this = this;
    this.socket.on("FromAPI", (data) => {
      _this.id = data.id;
      _this.PosX1 = data.posX1; //50
      _this.PosY1 = data.posY1; //450
      _this.PosX2 = data.posX2; //740
      _this.PosY2 = data.posY2; //450
    });
  }

  preload() {
    this.client();

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
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    //fundo
    this.add.image(400, 300, "sky");

    //portas
    // this.door = this.physics.add.staticGroup();
    // this.door.create(375, 70, "door").setScale(2).refreshBody();
    // this.door.create(435, 70, "door").setScale(2).refreshBody();

    //plataformas
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, "ground").setScale(2).refreshBody();
    this.platforms.create(400, 400, "ground").setScale(0.8, 0.5).refreshBody();
    this.platforms.create(50, 250, "ground").setScale(0.3, 1).refreshBody();
    this.platforms.create(750, 250, "ground").setScale(0.3, 1).refreshBody();
    this.platforms.create(400, 100, "ground").setScale(0.6, 0.5).refreshBody();

    console.log("id: " + this.id);

    //player1
    this.player = this.physics.add.sprite(this.PosX1, this.PosY1, "dude");
    console.log("player1: " + this.player.x + " " + this.player.y);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms);
    this.player.setTint(0x00ffff);

    //player2
    this.player2 = this.physics.add.sprite(this.PosX2, this.PosY2, "dude");
    console.log("player2: " + this.player2.x + " " + this.player2.y);
    this.player2.setBounce(0.2);
    this.player2.setCollideWorldBounds(true);
    this.physics.add.collider(this.player2, this.platforms);
    this.player2.setTint(0xff0000);

    //portas
    this.door = this.physics.add.staticGroup();
    this.physics.add.collider(
      this.player,
      this.door,
      this.colideDoor,
      null,
      this
    );
    this.physics.add.collider(
      this.player2,
      this.door,
      this.colideDoorAgain,
      null,
      this
    );
    this.door.create(400, 60, "door").setScale(2).refreshBody();
    // this.door.create(435, 70, "door").setScale(2).refreshBody();

    //blocos mortais
    this.danger1 = this.physics.add.staticGroup();
    this.physics.add.collider(
      this.player,
      this.danger1,
      this.colideBlock,
      null,
      this
    );
    this.danger1.create(200, 530, "danger1").setScale(0.5, 0.75).refreshBody();
    this.danger1.create(750, 230, "danger1").setScale(0.3, 0.5).refreshBody();

    this.danger2 = this.physics.add.staticGroup();
    this.physics.add.collider(
      this.player2,
      this.danger2,
      this.colideBlock,
      null,
      this
    );
    this.danger2.create(580, 530, "danger2").setScale(0.5, 0.75).refreshBody();
    this.danger2.create(50, 230, "danger2").setScale(0.3, 0.5).refreshBody();

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
    this.stars = this.physics.add.group();
    this.stars.create(200, 290, "star");
    this.stars.create(600, 290, "star");
    this.stars.create(70, 100, "star");
    this.stars.create(730, 100, "star");
    this.stars.create(300, 300, "star");
    this.stars.create(500, 300, "star");

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

    this.physics.add.overlap(
      this.player2,
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
    /*this.bombs = this.physics.add.group();

    this.physics.add.collider(this.bombs, this.platforms);

    this.physics.add.collider(
      this.player,
      this.bombs,
      this.hitBomb,
      null,
      this
    );

    this.physics.add.collider(
      this.player2,
      this.bombs,
      this.hitBomb,
      null,
      this
    );
    */
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

    if (this.keyA.isDown) {
      this.player2.setVelocityX(-160);

      this.player2.anims.play("left", true);
    } else if (this.keyD.isDown) {
      this.player2.setVelocityX(160);

      this.player2.anims.play("right", true);
    } else {
      this.player2.setVelocityX(0);

      this.player2.anims.play("turn");
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }

    if (this.keyW.isDown && this.player2.body.touching.down) {
      this.player2.setVelocityY(-330);
    }

    //var dan1 = this.danger1.create(200, 530, "danger1").setScale(0.5, 0.75).refreshBody();;
    //dan1.setCollideWorldBounds(true);

    this.checkPass();

    let playersPos = [
      this.player.x,
      this.player.y,
      this.player2.x,
      this.player2.y,
    ];

    // this.socket.emit("hey", playersPos);
    // console.log("playersPos: " + playersPos);
  }

  collectStar(player, star) {
    star.disableBody(true, true);

    this.score += 10;
    this.scoreText.setText("Score: " + this.score);

    // if (this.stars.countActive(true) === 0) {
    //   this.stars.children.iterate(function (child) {
    //     child.enableBody(true, child.x, 0, true, true);
    //   });

    // var x =
    //   player.x < 400
    //     ? Phaser.Math.Between(400, 800)
    //     : Phaser.Math.Between(0, 400);

    // var bomb = this.bombs.create(x, 16, "bomb");
    // bomb.setBounce(1);
    // bomb.setCollideWorldBounds(true);
    // bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    //}
  }

  hitBomb() {
    this.physics.pause();
    this.player.setTint(0xff00ff);
    this.player2.setTint(0xff00ff);
    this.player.anims.play("turn");

    this.gameOver = true;
  }

  colideBlock() {
    this.physics.pause();
    this.player.setTint(0xff00ff);
    this.player2.setTint(0xff00ff);
    this.player.anims.play("turn");

    this.gameOver = true;
  }

  colideDoor() {
    //var collider = Game.scene.physics.add.collider(Game.player, layer);
    if (this.score >= 60) {
      //this.physics.pause();
      this.player.setTint(0xfff000);
      //this.player2.setTint(0xfff000);
      this.player.anims.play("turn");
      this.player.disableBody(true, true);
      //this.player2.anims.play("turn");
      //this.gameOver = true;
      this.pass += 1;
    } else {
      //desativar colisão
      //Game.door.body.enableBody=false;
      //collider.active = false;
    }
  }

  colideDoorAgain() {
    if (this.score >= 60) {
      this.player2.setTint(0xfff000);
      this.player2.anims.play("turn");
      this.player2.disableBody(true, true);
      this.pass += 1;
    } else {
    }
  }

  checkPass() {
    if (this.pass === 2) {
      //this.physics.pause();
      //this.door.disableBody(true,true);
      this.gameOver = true;
    }
  }
}

export default playGame;
