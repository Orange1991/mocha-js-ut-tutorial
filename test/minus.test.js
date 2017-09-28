const assert = require('assert');
const minus = require('../src/minus');

describe('Test add() function', () => {
  it('should equals to 1 by minusing 1 from 2', () => {
    assert.strictEqual(minus(2, 1), 1);
  });
});
