import { CTS } from "../CTS.js";

export class LoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: CTS.SCENES.LOAD
        })
    }
    preload() {
        //this.load.image('background', 'images/level1/background.jpg');
        //wasd Keys
        this.load.image('w', 'images/keys/w.png');
        this.load.image('wP', 'images/keys/wP.png');
        this.load.image('a', 'images/keys/a.png');
        this.load.image('aP', 'images/keys/aP.png');
        this.load.image('s', 'images/keys/s.png');
        this.load.image('sP', 'images/keys/sP.png');
        this.load.image('d', 'images/keys/d.png');
        this.load.image('dP', 'images/keys/dP.png');
        //background and foreground
        this.load.image('background', 'images/level1/background.png')
        this.load.image('ground', 'images/level1/ground.png');
        this.load.image('platform', 'images/level1/grass_4x1.png');
        //in game objects
        this.load.image('coin', 'images/level1/coin.png');
        this.load.image('ladder', 'images/level1/ladder.png');
        this.load.image('key', 'images/key.png');
        //menu
        this.load.image('startButton', 'images/menu/startButton.png');
        this.load.image('levelButton', 'images/menu/levelButton.png');
        this.load.image('contactMe', 'images/menu/contactMe.png');
        this.load.image('menuBg', 'images/menu/chipBackground.jpg');
        //arrow keys
        this.load.image('upNotPressed', 'images/arrowButtons/upNotPressed.png');
        this.load.image('downNotPressed', 'images/arrowButtons/downNotPressed.png');
        this.load.image('leftNotPressed', 'images/arrowButtons/leftNotPressed.png');
        this.load.image('rightNotPressed', 'images/arrowButtons/rightNotPressed.png');
        this.load.image('upPressed', 'images/arrowButtons/upPressed.png');
        this.load.image('downPressed', 'images/arrowButtons/downPressed.png');
        this.load.image('leftPressed', 'images/arrowButtons/leftPressed.png');
        this.load.image('rightPressed', 'images/arrowButtons/rightPressed.png');

        //computer
        this.load.image('monitor', 'images/level1/monitor.png');
        this.load.spritesheet('computer', 'images/level1/computer.png', { frameWidth: 512, frameHeight: 512 });
        //spritesheets
        this.load.spritesheet('door', 'images/level1/door.png', { frameWidth: 70, frameHeight: 93 });
        this.load.spritesheet('player', 'images/FinnSprite.png', { frameWidth: 15, frameHeight: 20, margin: 6, spacing: 17 });
        this.load.spritesheet('finn', 'images/FinnSprite.png', { frameWidth: 15, frameHeight: 20, margin: 6, spacing: 17 });
        this.load.spritesheet('house', 'images/level1/houseSS.png', { frameWidth: 405, frameHeight: 239 });

        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff
            }
        })
        this.load.on('progress', (percent) => {
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
        })
    }
    create() {
        this.scene.start(CTS.SCENES.MENU)
    }
}