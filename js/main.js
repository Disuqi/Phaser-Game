import { LoadScene } from "./scenes/LoadScene.js";
import { MenuScene } from "./scenes/MenuScene.js";
import { GameScene } from "./scenes/GameScene.js";

const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    scene: [
        LoadScene,
        MenuScene,
        GameScene,
    ],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },

        }
    },
    parent: game,
    render: {
        pixelArt: true,
    },
    scale: {
        parent: 'game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280,
        height: 720,
    }
};

var game = new Phaser.Game(config);