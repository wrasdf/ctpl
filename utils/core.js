'use strict';

const parser = require('./parser'),
      utils = require('./utility'),
      Mustache = require('mustache'),
      aws = require('./aws'),
      buildPath = '_cfns_build'

function cfnCompile(ctpl) {

  const params = parser.getParameters(ctpl),
        components = ctpl.components
  // Clean build folder
  utils.rmdir(buildPath)
  components.map(component => utils.mkdir(`${process.cwd()}/${buildPath}/`))

  components.map(component => {
    const file = `${process.cwd()}/cfns/${component}.yaml`
    const fileContent = utils.readfile(file)
    utils.appendFile(file.replace(/cfns/, buildPath), Mustache.render(fileContent, params))
  })

}

function cfnValidate(ctpl) {
  cfnCompile(ctpl)
  ctpl.components.map(component => {
    const file = `${process.cwd()}/${buildPath}/${component}.yaml`
    utils.exec(`aws cloudformation validate-template --template-body file://${file}`)
  })
}

function stackName(ctpl, component) {
  return ((typeof ctpl.name === "function") || !ctpl.name) ? `${component}` : `${ctpl.name}-${component}`
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

function tplRender(ctpl) {
  const fileContent = utils.readfile(ctpl.template),
        params = parser.getParameters(ctpl)
  utils.appendFile(ctpl.output, Mustache.render(fileContent, params))
}

module.exports = {
  cfnCompile,
  cfnValidate,
  cfnApply,
  cfnDelete,
  tplRender,
  stackName
}
