const assert = require('assert');
const add = require('../src/add');

describe('Test add() function', () => {
  it('should equals to 2 by adding 1 to 1', () => {
    assert.strictEqual(add(1, 1), 2);
  });
  it('should equals to 0 by adding -1 to 1', () => {
    assert.strictEqual(add(-1, 1), 0);
  });
});
