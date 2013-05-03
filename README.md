# voxel-virus

Spread a virus in [voxel.js](http://voxeljs.com).

Might make a good base for a fire or water module as well ;)

# example

[View this example](http://shama.github.com/voxel-virus)

```js
// create a virus
var virus = require('voxel-virus')({
  
  // pass a copy of the game
  game: game,

  // which material index of virus
  // can use a material name instead, ie 'obsidian'
  // or false to not change the material
  material: 0,

  // how fast in milliseconds to spread
  rate: 3000,

  // how many iterations before dying
  // set to 0 to never decay (and eventually crash your game)
  decay: 10,

  // how virulent; between 0 and 1
  // 0 wont spread
  // 1 spreads to all surrounding blocks
  virulence: 0.5,

  // how it spreads
  // by default it will remove the block
  // and spread to surrounding blocks
  how: function(block) {
    var self = this;
    if (self.decay > 0) level++;
    self.game.setBlock(block, 0);
    self.around(block).forEach(function(b) {
      self.infect(b, level);
    });
  }
});

// on fire, infect block
game.on('fire', function() {
  var vec = game.cameraVector();
  var pos = game.cameraPosition();
  virus.infect(game.raycast(pos, vec, 100).voxel);
});

// on tick, spread the virus
game.on('tick', virus.tick.bind(virus));
```

# api

## virus.infect([block, level])
Set `block` to position of block `[0, 0, 0]` to infect. `level` is the
current number of iteration the infection is on.

To infect the block you're looking at:

```js
game.on('fire', function() {
  var vec = game.cameraVector();
  var pos = game.cameraPosition();
  virus.infect(game.raycast(pos, vec, 100).voxel);
});
```

## virus.tick(delta)
Push the iterations forward. Needs to be added to the game tick to keep in time
with the game simulation.

```js
game.on('tick', virus.tick.bind(virus));
```

## virus.around(block)
Returns block positions around the given `block`. Uses `virus.virulence` to
randomly *not* select blocks.

```js
var around = virus.around([0, 0, 0]);
// around equals an array of blocks up, down, left, right, front and back
```

## virus.infected
An array of blocks that are currently infected with time or iteration prepended.

```js
virus.infected = [
  [time, block],
  [time, block],
  // ...
];
```

# install

With [npm](https://npmjs.org) do:

```
npm install voxel-virus
```

Use [browserify](http://browserify.org) to `require('voxel-virus')`.

## release history
* 0.2.1 - update for voxel-engine@0.17
* 0.2.0 - infect doesnt default to the block you're looking at 
* 0.1.1 - update for voxel-engine@0.16.3. infect doesnt ignore air voxels.
* 0.1.0 - initial release

## license
Copyright (c) 2013 Kyle Robinson Young<br/>
Licensed under the MIT license.
