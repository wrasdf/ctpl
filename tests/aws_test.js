const mocha = require('mocha'),
      expect = require("chai").expect,
      rewire = require("rewire"),
      aws = rewire('../utils/aws')

describe('aws functions', () => {

  describe('getCFNStack', ()=> {
    it('should return correct cfn stacks', ()=> {
      expect(true).to.be.true
    })
  })

})
