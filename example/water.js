// Turns virus into water
module.exports = function(water, material) {
  var old = {
    material: water.material,
    rate: water.rate,
    decay: water.decay,
    how: water.how
  };
  function toNormal(virus) {
    Object.keys(old).forEach(function(k) {
      virus[k] = old[k];
    });
  }

  water.material = material;
  water.rate = 300;
  water.decay = 30;
  water.how = function(block, level) {
    var self = this;
    if (self.decay > 0) level++;

    var size = self.game.cubeSize;
    var around = [];

    // if air is below just flow down
    var down = [block[0], block[1] - size, block[2]];
    if (self.game.getBlock(down) === 0) {
      self.infect(down, level);
    } else {
      // if air is on sides and water not below = flow sideways
      [ [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1] ].forEach(function(p) {
        var side = [block[0] + (p[0] * size), block[1], block[2] + (p[2] * size)];
        if (self.game.getBlock(side) !== 0) return;
        var below = [side[0], side[1] - size, side[2]];
        if (self.game.getBlock(below) === self.material) return;
        self.infect(side, level);
      });
    }
  };

  return toNormal;
};