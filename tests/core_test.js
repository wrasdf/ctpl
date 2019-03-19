const mocha = require('mocha'),
      expect = require("chai").expect,
      rewire = require("rewire"),
      core = rewire('../utils/core'),
      sinon = require('sinon')


describe('core functions', () => {

  describe(`cfnValidate`, () => {
    it(`cfnCompile should be called`, () => {
      const cfnCompileStub = sinon.stub().returns("");
      core.__set__({
        cfnCompile: cfnCompileStub
      })
      core.cfnValidate({
        components: []
      })
      expect(cfnCompileStub.calledOnce).to.be.true;
    });
  })

  describe(`cfnApply`, () => {
    it(`cfnCompile should be called`, () => {
      const cfnCompileStub = sinon.stub().returns("");
      core.__set__({
        cfnCompile: cfnCompileStub
      })
      core.cfnApply({
        components: []
      })
      expect(cfnCompileStub.calledOnce).to.be.true;
    });
  })

  describe(`cfnDelete`, () => {
    it(`cfnCompile should be called`, () => {
      const cfnCompileStub = sinon.stub().returns("");
      core.__set__({
        cfnCompile: cfnCompileStub
      })
      core.cfnDelete({
        components: []
      })
      expect(cfnCompileStub.calledOnce).to.be.true;
    });
  })

  describe(`stackName`, () => {
    it(`should return correct stack name`, () => {
      const ctpl = {
        "name": "kube"
      }
      expect(core.stackName(ctpl, "vpc")).to.eqls('kube-vpc');
    });

    it(`should return correct stack name`, () => {
      const ctpl = {
        "name": function() {}
      }
      expect(core.stackName(ctpl, "vpc")).to.eqls('vpc');
    });

    it(`should return correct stack name`, () => {
      const ctpl = {
        "name": ""
      }
      expect(core.stackName(ctpl, "vpc")).to.eqls('vpc');
    });

  })

});
