const mocha = require('mocha'),
      expect = require("chai").expect,
      rewire = require("rewire"),
      parser = rewire('../utils/parser')


describe('parser functions', () => {

  describe(`componentReader`, () => {
    it(`should return correct order of components`, () => {
      let clist = ["c"]
      parser.componentReader("a", clist)
      expect(clist).to.eql(["c", "a"])
    });
  })

  describe(`parameterReader`, () => {
    it(`should return correct order of parameter files`, () => {
      let plist = ["files/t1.yaml"]
      parser.parameterReader("files/t2.yaml", plist)
      expect(plist).to.eql(["files/t1.yaml", "files/t2.yaml"])
    });

    it(`should only return support parameter files`, () => {
      let plist = ["files/t1.yaml"]
      parser.parameterReader("files/t2.yaml", plist)
      parser.parameterReader("files/t3.json", plist)
      expect(plist).to.eql(["files/t1.yaml", "files/t2.yaml"])
    });

  })

  describe(`keyReader`, () => {
    it(`should return correct order of keypair strings`, () => {
      let keyList = ["name.version='v0.0.1'"]
      parser.componentReader("name.repo='ctpl'", keyList)
      expect(keyList).to.eql(["name.version='v0.0.1'", "name.repo='ctpl'"])
    });
  })

  describe(`getParameters`, () => {

    it(`should return correct parameters`, () => {
      const mock_ctpl = {
        parameters:[],
        keyPairs: []
      }
      parser.__set__({
        _parameterBuilder: () => {
          return {
            "VPC": {
              "Version": "v0.0.1",
              "Name": "Kubernetes",
              "CidrBlock": "192.168.0.0/16"
            }
          }
        },
        _keyBuilder: () => {
          return {
            "VPC": {
              "Version": "v0.0.3"
            }
          }
        }
      })

      expect(parser.getParameters(mock_ctpl)).to.eql({
        "VPC": {
          "Version": "v0.0.3",
          "Name": "Kubernetes",
          "CidrBlock": "192.168.0.0/16"
        }
      })

    })

  })

  describe(`_getFileExtenionName`, () => {
    it(`should return correct file extention`, () => {
      expect(parser._getFileExtenionName(`params1.yaml`)).to.equal('yaml');
      expect(parser._getFileExtenionName(`params1.json`)).to.equal('json');
      expect(parser._getFileExtenionName(`params1.yml`)).to.equal('yml');
    });
  })

  describe(`_isInSupportList`, () => {

    it(`should return correct boolean`, () => {
      expect(parser._isInSupportList(`params1.yaml`, ['yaml'])).to.equal(true);
      expect(parser._isInSupportList(`params1.yml`, ['yaml', 'yml'])).to.equal(true);
    });

    it(`should return false boolean`, () => {
      expect(parser._isInSupportList(`params1.yaml`, ['yml'])).to.equal(false);
      expect(parser._isInSupportList(`params1.yml`, ['yaml', 'json'])).to.equal(false);
      expect(parser._isInSupportList(`params1.yml`, [])).to.equal(false);
    });
  })

  describe(`_parameterBuilder`, () => {

    it(`should return correct parameters objects`, async () => {
      let list = [`${__dirname}/files/params1.yaml`, `${__dirname}/files/params2.yaml`]
      const results = parser._parameterBuilder(list)
      expect(results).to.eql({
        "app": {
          "name": "ntpl",
          "namespace": "kube-system",
          "version": "v1.0.1",
          "logtail":{
            "app": "tail-name",
            "component": "kube-logging"
          }
        }
      })
    })

    it(`should return empty object`, async () => {
      const results = parser._parameterBuilder([])
      expect(results).to.eql({})
    })

    it(`should ignore not support params file`, async () => {
      let list = [`${__dirname}/files/params1.yaml`, `${__dirname}/files/params2.yaml`, `${__dirname}/files/text.json`]
      const results = parser._parameterBuilder(list)
      expect(results.app.name).to.eql("ntpl")
    })

  })

  describe(`_keyBuilder`, () => {
    it(`should return correct parameters objects`, async () => {
      const results = parser._keyBuilder(["name=Cluster", "version=v0.1.2", "cluster=kubernetes"])
      expect(results).to.eql({
        "name": "Cluster",
        "version": "v0.1.2",
        "cluster": "kubernetes"
      })
    })

    it(`should return empty object`, async () => {
      const results = parser._keyBuilder([])
      expect(results).to.eql({})
    })

    it(`should return correct parameters objects with hierarchy`, async () => {
      const results = parser._keyBuilder(["app.name=Cluster", "version=v0.1.2", "cluster=kubernetes"])
      expect(results).to.eql({
        "app": {
          "name": "Cluster"
        },
        "version": "v0.1.2",
        "cluster": "kubernetes"
      })
    })
  })

});
