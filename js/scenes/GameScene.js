import { CTS } from "../CTS.js";

export class GameScene extends Phaser.Scene {

    //fields
    hasKey;
    controlsOFF;
    gameOver;
    inAnimation;
    readingComputer;
    constructor() {
        super({
            key: CTS.SCENES.GAME
        });
        this.hasKey = false;
        this.controlsOFF = false;
        this.gameOver = false;
        this.inAnimation = false;
        this.readingComputer = false;
    }

    create() {
        this.fullScreen = this.add.text(960, 80, 'I reccomend pressing F11 for a better experience', { fontSize: '24px', fill: '#41FF00', backgroundColor: '#3b4566', padding: 10, fontFamily: 'Cascadia Code' }).setOrigin(1, 1);
        this.fullScreen.setDepth(1);
        //Create Platforms background and items in the level
        this.platforms = this.physics.add.staticGroup();
        this.createLevel(this);
        //arrowKeys
        this.createArrowKeys()

        //player
        this.player = this.physics.add.sprite(10, 620, 'finn').setScale(2);
        //objects 
        this.createObjects();
        //animations
        this.createAnimations();
        //collissions and overlaps
        this.createColliders();
        //tweens
        this.createTweens();
    }

    update() {
        if (window.screenTop && window.screenY) {
            this.fullScreen.visible = false;
        }
        if (this.gameOver || this.controlsOFF) {
            return;
        }
        if (this.ladder.body.touching.none && !this.ladder.body.wasTouching.none) {
            this.climbing = false;
        }
        if (this.computer.body.touching.none && this.readComputerText != null) {
            this.readComputerText.visible = false;
        }
        //movement left right and jump
        this.movePlayer();
        //arrowKeys image
        this.updateKeysImage();
    }
    movePlayer() {
        //left, right and idle
        if (this.climbing || this.inAnimation || this.readingComputer) {
            return;
        }
        if (this.cursors.left.isDown || this.cursors.a.isDown) {
            this.run(-1);
            this.player.anims.play('run', true);
            this.player.setFlipX(true);
        } else if (this.cursors.right.isDown || this.cursors.d.isDown) {
            this.run(1);
            this.player.anims.play('run', true);
            this.player.resetFlip();
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('idle', true);
        }
        //jumping
        if ((this.cursors.up.isDown || this.cursors.w.isDown) && this.player.body.blocked.down && !this.climbing) {
            this.player.setVelocityY(-450);
        }

        //jump and fall animations
        if (this.player.body.velocity.y != 0 && !this.climbing) {
            this.player.anims.play('jump');
        }
    }
    updateKeysImage() {
        if (this.cursors.up.isDown || this.cursors.w.isDown) {
            this.up.setTexture('wP');
            this.up.x = 203;
            this.up.y = 203;
        } else {
            this.up.setTexture('w');
            this.up.x = 200;
            this.up.y = 200;
        }
        if (this.cursors.down.isDown || this.cursors.s.isDown) {
            this.down.setTexture('sP');
            this.down.x = 203;
            this.down.y = 263;
        } else {
            this.down.setTexture('s');
            this.down.x = 200;
            this.down.y = 260;
        }
        if (this.cursors.left.isDown || this.cursors.a.isDown) {
            this.left.setTexture('aP')
            this.left.x = 143;
            this.left.y = 263;
        } else {
            this.left.setTexture('a');
            this.left.x = 140;
            this.left.y = 260;
        }
        if (this.cursors.right.isDown || this.cursors.d.isDown) {
            this.right.setTexture('dP');
            this.right.x = 263;
            this.right.y = 263;
        } else {
            this.right.setTexture('d');
            this.right.x = 260;
            this.right.y = 260;
        }
    }
    run(direction) {
        this.player.setVelocityX(200 * direction);
    }

    openDoor(player, door) {
        if (this.hasKey == true && this.player.body.blocked.down) {
            this.house.setFrame(1)
            this.player.setVelocityX = 0;
            this.player.setImmovable = true;
            this.player.visible = false;
            this.gameOver = true;
            this.finishGame();
        }
    }

    finishGame() {
        this.gameOverText = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2, "GAME\nOVER", { font: '100px Cascadia Code', fill: 'red', strokeThickness: 5, backgroundColor: 'black', padding: 1000 }).setOrigin(0.5, 0.5);
        this.gameOverText.setDepth(10);
    }

    getKey(player, key) {
        key.disableBody(true, true);
        this.hasKey = true;

    }

    climbLadder(player, ladder) {
        if (this.cursors.up.isDown && this.player.body.blocked.down && !this.climbing) {
            this.player.y -= 5;
            this.player.x = this.ladder.x;
            this.climbing = true;
        } else if (this.player.body.blocked.down) {
            this.climbing = false;
        }
        if (!this.climbing) {
            return;
        }
        if (this.cursors.up.isDown) {
            this.climb(-1);
        } else if (this.cursors.down.isDown) {
            this.climb(1);
        } else {
            this.player.anims.stop();
            this.player.setVelocityY(0);
        }

    }
    climb(direction) {
        this.player.anims.play('climb', true);
        this.player.setVelocityY(150 * direction);
    }


    //Functions for the computer
    onComputer(player, computer) {
        //Handling text to help the player
        if (this.readComputerText == null) {
            this.readComputerText = this.add.text(this.computer.x, this.computer.y - 130, 'Press S or ↓ to turn ON', { fontSize: '24px', fill: '#41FF00', backgroundColor: '#3b4566', padding: 10, fontFamily: 'Cascadia Code' }).setOrigin(0.5, 0.5);
        } else if (this.inAnimation != true) {
            this.readComputerText.visible = true;
        }

        //Turning on the computer
        if ((Phaser.Input.Keyboard.JustDown(this.cursors.s) || Phaser.Input.Keyboard.JustDown(this.cursors.down)) && this.player.body.blocked.down && this.inAnimation == false) {
            this.player.setVelocityX(0);
            this.readComputer();
        }
    }

    readComputer() {
        if (this.readingComputer == false && this.inAnimation == false) {
            this.walkToComputer = this.tweens.create({
                targets: this.player,
                x: 207,
                duration: 1000,
                ease: 'Linear',
            }).on('complete', () => {
                this.player.resetFlip();
                this.player.anims.play('lookBack', true);
                if (this.computerOn == false) {
                    this.computer.anims.play("computerOn", false);
                    this.computerOn = true;
                } else {
                    this.handleMonitor();
                    this.readingComputer = true;
                    this.inAnimation = false;
                }
            });
            this.readingComputer = true;
            this.inAnimation = true;
            this.walkToComputer.setTimeScale(1 / (Math.abs(this.player.x - 207) / 150));
            this.readComputerText.visible = false;
            this.player.resetFlip();
            if (this.player.x > 207) {
                this.player.toggleFlipX();
            }
            this.player.anims.play('run', true);
            this.walkToComputer.play();
            this.computer.on("animationcomplete", () => {
                this.handleMonitor();
                this.inAnimation = false;
            });
        } else if (this.readingComputer == true && this.inAnimation == false) {
            this.readingComputer = false;
            this.inAnimation = false;
            this.handleMonitor();
        }


        console.log("After Reading computer = " + this.readingComputer);
        console.log("after inAnimation = " + this.inAnimation);

    }

    handleMonitor() {
        var content = ["Hello, thank you for cheking out my little game.",
            "I worked on this project to learn JavaScript,", "and I thought it would be fun to do so by making a simple game.",
            "I know the code for this game is very unorganised and a bit of mess,", "but I just wanted to learn javascript,", "so I didn't spend a lot of time worrying about that.",
            "To complete the game get the key and open the door!", " ",
            "To carry on playing just press S or ↓",
            "Bye!"
        ];
        if (this.computerMessage == null) {
            this.computerMessage = this.add.text(250, 80, content, { font: "20px Cascadia Code", fill: "#41FF00" });
            this.computerMessage.setDepth(3);
        }
        if (this.monitor.scale == 0) {
            this.monitor.setScale(0.67);
            this.computerMessage.visible = true;
        } else {
            this.monitor.setScale(0);
            this.computerMessage.visible = false;
        }
    }


    createObjects() {
        this.monitor = this.physics.add.image(0, 0, 'monitor');
        this.monitor.setScale(0);
        this.monitor.setOrigin(0, 0);
        this.monitor.setDepth(2);
        this.monitor.body.allowGravity = false;
    }

    createLevel() {
        //Background
        this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(4.5);
        //House
        this.house = this.physics.add.image(1050, 520, 'house');
        this.house.body.allowGravity = false;
        this.house.body.setSize(50, 80, true);
        this.house.body.setOffset(52, 157);
        //Ladder
        this.ladder = this.physics.add.image(1075, 577, 'ladder');
        this.ladder.body.allowGravity = false;
        this.ladder.setScale(0.45, 0.5);
        this.ladder.setImmovable(true);
        //Computer
        this.computer = this.physics.add.sprite(250, 550, 'computer');
        this.computer.setScale(0.5);
        this.computer.toggleFlipX();
        this.computer.body.allowGravity = false;
        this.computerOn = false;
        this.physics.add.image()
        this.platforms.create(480, 680, 'ground');
        this.platforms.create(1446, 680, 'ground');
        //key
        this.key = this.physics.add.image(1170, 350, 'key');
        this.key.setDepth(1);
        this.key.setScale(0.05);
        this.key.body.allowGravity = false;
        this.tweens.add({
            targets: this.key,
            y: '+=10',
            ease: 'Linear',
            duration: 800,
            yoyo: true,
            repeat: -1,
        });

    }

    createArrowKeys() {
        this.arrowKeys = this.physics.add.staticGroup();
        this.up = this.arrowKeys.create(200, 200, 'w');
        this.left = this.arrowKeys.create(140, 260, 'a');
        this.down = this.arrowKeys.create(200, 260, 's');
        this.right = this.arrowKeys.create(260, 260, 'd');
        const listOfArrows = [this.up, this.down, this.left, this.right]
        listOfArrows.forEach(arrow => arrow.setScale(0.6));
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.a = this.input.keyboard.addKey('A', true, true);
        this.cursors.s = this.input.keyboard.addKey('S', true, true);
        this.cursors.d = this.input.keyboard.addKey('D', true, true);
        this.cursors.w = this.input.keyboard.addKey('W', true, true);
    }

    createAnimations() {
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('finn', { start: 9, end: 14 }),
            frameRate: 8,
            repeat: -1,
        }, );
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('finn', { start: 0, end: 8 }),
            frameRate: 5,
            repeat: -1,
        });
        this.anims.create({
            key: 'jump',
            frames: [{ key: 'finn', frame: 15 }],
        })
        this.anims.create({
            key: 'die',
            frames: this.anims.generateFrameNumbers('finn', { start: 19, end: 23 }),
            frameRate: 8,
        })
        this.anims.create({
            key: 'hit',
            frames: this.anims.generateFrameNumbers('finn', { start: 17, end: 18 }),
            frameRate: 6,
        });
        this.anims.create({
            key: 'lookBack',
            frames: [{ key: 'finn', frame: 28 }]
        })
        this.anims.create({
            key: 'climb',
            frames: this.anims.generateFrameNumbers('finn', { start: 29, end: 30 }),
            frameRate: 4
        })
        this.anims.create({
            key: 'computerOn',
            frames: this.anims.generateFrameNumbers('computer', { start: 0, end: 10 }),
            frameRate: 5,
        });
    }

    createTweens() {}

    createColliders() {
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.ladder, null, this.checkPlayerY, this);
        this.physics.add.overlap(this.player, this.house, this.openDoor, null, this);
        this.physics.add.overlap(this.player, this.key, this.getKey, null, this);
        this.physics.add.overlap(this.player, this.ladder, this.climbLadder, null, this);
        this.physics.add.overlap(this.player, this.computer, this.onComputer, null, this);
    }

    checkPlayerY() {
        if (this.player.y > this.ladder.y - 50 && !this.climbing) {
            return false;
        } else {
            return true;
        }
    };

}