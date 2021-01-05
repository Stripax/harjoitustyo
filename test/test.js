var assert = require('assert')


// ---------- SERVER TESTS ----------

describe('Server tests', function() {
  describe('1 equals 1', function() {
    it('should return true since 1 equals 1', function() {
      assert.strictEqual(NaN, NaN, "test failed")
    })
  })
})



// ---------- CLIENT TESTS ----------

describe('Client tests', function() {
  describe('test description', function() {
    it('test should do something here', function() {
      assert.ok(25, "something something")
    })
  })
})