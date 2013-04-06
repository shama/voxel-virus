var isArray = require('util').isArray;

function Virus(opts) {
  if (!(this instanceof Virus)) return new Virus(opts || {});
  if (opts.THREE) opts = {game:opts};
  this.game      = opts.game;
  this.material  = opts.material  || 0;
  this.rate      = opts.rate      || 3000;
  this.virulence = opts.virulence || 0.5;
  this.decay     = opts.decay     || 10;
  this.how       = opts.how       || defaultHow;
  this.infected  = [];
  this.elapsed   = 0;
  if (typeof this.material === 'string') {
    this.material = this.game.materials.find(this.material);
  }
}
module.exports = Virus;

Virus.prototype.infect = function(block, level) {
  var game = this.game;
  if (typeof level !== 'number') {
    level = 0;
  }
  if (!isArray(block)) {
    var vec = game.cameraVector();
    var pos = game.cameraPosition();
    block = game.raycast(pos, vec, 100).voxel;
  }
  if (level >= this.decay || !block || game.getBlock(block) === 0) return;
  if (this.material !== false) game.setBlock(block, this.material);
  this.infected.push([this.elapsed + this.rate, block, level]);
};

Virus.prototype.around = function(block) {
  var self = this;
  var size = this.game.cubeSize;
  var around = [];
  [
    [0, 1, 0], [0, -1, 0],
    [1, 0, 0], [-1, 0, 0],
    [0, 0, 1], [0, 0, -1],
  ].forEach(function(p) {
    if (Math.random() >= self.virulence) return;
    around.push([block[0] + (p[0] * size), block[1] + (p[1] * size), block[2] + (p[2] * size)]);
  });
  return around;
};

Virus.prototype.tick = function(dt) {
  var self = this;
  self.infected = self.infected.filter(function(b) {
    if (self.elapsed < b[0]) return true;
    process.nextTick(function() {
      self.how.call(self, b[1], b[2]);
    });
    return false;
  });
  self.elapsed += dt;
};

function defaultHow(block, level) {
  var self = this;
  if (self.decay > 0) level++;
  self.game.setBlock(block, 0);
  self.around(block).forEach(function(b) {
    self.infect(b, level);
  });
}
