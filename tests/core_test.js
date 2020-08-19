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
        "prefix": "kube"
      }
      expect(core.stackName(ctpl, "vpc")).to.eqls('kube-vpc');
    });

    it(`should return correct stack name`, () => {
      const ctpl = {
        "prefix": function() {}
      }
      expect(core.stackName(ctpl, "vpc")).to.eqls('vpc');
    });

    it(`should return correct stack name`, () => {
      const ctpl = {
        "prefix": ""
      }
      expect(core.stackName(ctpl, "vpc")).to.eqls('vpc');
    });

    it(`should return correct stack name`, () => {
      const ctpl = {
        "prefix": "eco-stg"
      }
      expect(core.stackName(ctpl, "infra/vpc")).to.eqls('eco-stg-infra-vpc');
    });

  })

});
