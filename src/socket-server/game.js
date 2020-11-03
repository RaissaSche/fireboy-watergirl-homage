import playGame from "../../src/phaser/scene"

var game = new Phaser.Game(16*32, 600, Phaser.AUTO, document.getElementById('phaser'));
game.state.add('phaser',playGame);
game.state.start('playGame');
var Game = {};

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

//preload
// Game.preload = function() {
//     game.load.tilemap('map', 'assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON);
//     game.load.spritesheet('tileset', 'assets/map/tilesheet.png',32,32);
//     game.load.image('sprite','assets/sprites/sprite.png'); // this will be the sprite of the players
// };

//create
// Game.create = function(){
//     Game.playerMap = {};//mapa vazio
//     var map = game.add.tilemap('map');
//     map.addTilesetImage('tilesheet', 'tileset'); // tilesheet is the key of the tileset in map's JSON file
//     var layer;
//     for(var i = 0; i < map.layers.length; i++) {
//         layer = map.createLayer(i);
//     }
//     layer.inputEnabled = true; // Allows clicking on the map
//     Client.askNewPlayer();//indica q jogador foi iniciado
// };

Game.addNewPlayer = function(id,x,y){//adiciona sprite na posição xy e armazena sprite correspondente em matriz declarada em game.create conforme id fornecido
    Game.playerMap[id] = game.add.sprite(x,y,'sprite');
};

Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};