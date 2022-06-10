'use strict';

const parser = require('./parser'),
      utils = require('./utility'),
      Mustache = require('mustache'),
      aws = require('./aws'),
      buildPath = '_cfns_build'

function cfnCompile(ctpl) {
  const params = parser.getParameters(ctpl),
        components = ctpl.opts().components,
        prefix = ctpl.opts().prefix

  // Clean build folder
  utils.rmdir(buildPath)
  components.map(component => {
    const file = `${process.cwd()}/cfns/${component}.yaml`
    const fileContent = utils.readfile(file)
    utils.writeFile(file.replace(/cfns/, buildPath), Mustache.render(fileContent, params))
  })
}

function stackName(ctpl, name) {
  const newName = `${name.replace(/\//, '-')}`
  return ((typeof ctpl.prefix === "function") || !ctpl.prefix) ? `${newName}` : `${ctpl.prefix}-${newName}`
}

function cfnValidate(ctpl) {
  cfnCompile(ctpl)
  ctpl.components.map(component => {
    const file = `${process.cwd()}/${buildPath}/${component}.yaml`
    utils.exec(`aws cloudformation validate-template --template-body file://${file}`)
  })
}

function cfnApply(ctpl) {
  cfnCompile(ctpl)
  ctpl.components.map(component => {
    const file = `${process.cwd()}/${buildPath}/${component}.yaml`
    const name = stackName(ctpl, component)
    aws.deployCFNStack(name, file)
  })
}

function cfnDelete(ctpl) {
  cfnCompile(ctpl)
  ctpl.components.map(component => {
    const name = stackName(ctpl, component)
    aws.deleteCFNStack(name)
  })
}

module.exports = {
  cfnCompile,
  cfnValidate,
  cfnApply,
  cfnDelete,
  stackName
}
