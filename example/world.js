var createGame = require('voxel-engine');
var createTerrain = require('voxel-perlin-terrain');

var game = createGame({
  generateChunks: false,
  chunkDistance: 2,
  materials: [['grass', 'dirt', 'grass_dirt'], 'brick', 'plank', 'obsidian', 'redwool', 'bluewool'],
  texturePath: 'textures/'
});
var container = document.body;
game.appendTo(container);

// create the terrain
var terrain = createTerrain('virus', 0, 5);
game.voxels.on('missingChunk', function(p) {
  var voxels = terrain(p, 32);
  var chunk = {
    position: p,
    dims: [32, 32, 32],
    voxels: voxels
  };
  game.showChunk(chunk);
});

game.paused = false;

// create a player
var createPlayer = require('voxel-player')(game);
var shama = createPlayer('textures/shama.png');
shama.yaw.position.set(0, 15, 0);
shama.possess();

// create the virus
var virus = require('../')({
  game: game,
  material: 'redwool',
});
game.on('fire', function() {
  var vec = game.cameraVector();
  var pos = game.cameraPosition();
  virus.infect(game.raycast(pos, vec, 100).voxel);
});
game.on('tick', virus.tick.bind(virus));

var toWater = require('./water');

// add a toolbar
var toolbar = require('toolbar')('.bar-tab');
var toVirus = false;
toolbar.on('select', function(item) {
  if (item === 'water') {
    toVirus = toWater(virus, 'bluewool');
  } else if (toVirus) {
    toVirus(virus);
    toVirus = false;
  }
});
