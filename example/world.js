var createGame = require('voxel-engine');
var createTerrain = require('voxel-perlin-terrain');

var game = createGame({
  generateVoxelChunk: createTerrain({scaleFactor:10}),
  chunkDistance: 2,
  materials: ['brick', ['grass', 'dirt', 'grass_dirt'], 'plank', 'obsidian'],
  texturePath: 'textures/'
});
var container = document.body;
game.appendTo(container);

// create a player
var createPlayer = require('voxel-player')(game);
var shama = createPlayer('textures/shama.png');
shama.yaw.position.set(0, 10, 0);
shama.possess();

// create the virus
var virus = require('../')({
  game: game,
  material: 4,
});
game.on('fire', virus.infect.bind(virus));
game.on('tick', virus.tick.bind(virus));
