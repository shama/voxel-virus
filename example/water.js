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
    [
      [1, 0, 0], [-1, 0, 0],
      [0, 0, 1], [0, 0, -1],
    ].forEach(function(p) {
      var b = [block[0] + (p[0] * size), block[1] + (p[1] * size), block[2] + (p[2] * size)];
      if (self.game.getBlock(b) !== 0) return;
      var down = [block[0], block[1] + (-1 * size), block[2]];
      var downType = self.game.getBlock(down);
      if (downType === 0) {
        around.push(down);
      } else if (downType !== self.material) {
        around.push(b);
      }
    });

    var b = self.game.getBlock([block[0], block[1] + (-1 * size), block[2]]);
    if (b === 0) {
      around.push(b);
    }

    around.forEach(function(b) {
      if (!require('util').isArray(b)) return;
      if (self.game.getBlock(b) !== 0) return;
      self.infect(b, level);
    });
  };

  return toNormal;
};