'use strict';

const parser = require('./parser'),
      utils = require('./utility'),
      Mustache = require('mustache'),
      aws = require('./aws'),
      buildPath = '_cfns_build'

function cfnCompile(cliObj) {

  const params = parser.getParameters(cliObj),
        components = cliObj.components
  // Clean build folder
  utils.rmdir(buildPath)
  components.map(component => utils.mkdir(`${process.cwd()}/${buildPath}/`))

  components.map(component => {
    const file = `${process.cwd()}/cfns/${component}.yaml`
    const fileContent = utils.readfile(file)
    utils.appendFile(file.replace(/cfns/, buildPath), Mustache.render(fileContent, params))
  })

}

function cfnValidate(cliObj) {
  cfnCompile(cliObj)
  cliObj.components.map(component => {
    const file = `${process.cwd()}/${buildPath}/${component}.yaml`
    utils.exec(`aws cloudformation validate-template --template-body file://${file}`)
  })
}

function stackName(cliObj) {
  return (typeof cliObj.name === "function") ? `${component}-stack` : `${cliObj.name}-${component}-stack`
}

function cfnApply(cliObj) {
  cfnCompile(cliObj)
  cliObj.components.map(component => {
    const file = `${process.cwd()}/${buildPath}/${component}.yaml`
    const name = stackName(cliObj)
    aws.deployCFNStack(name, file)
  })
}

function cfnDelete(cliObj) {
  cfnCompile(cliObj)
  cliObj.components.map(component => {
    const name = stackName(cliObj)
    utils.exec(`aws cloudformation delete-stack --stack-name ${name}`)
  })
}

function tplRender(cliObj) {
  const fileContent = utils.readfile(cliObj.template),
        params = parser.getParameters(cliObj)
  utils.appendFile(cliObj.output, Mustache.render(fileContent, params))
}

module.exports = {
  cfnCompile,
  cfnValidate,
  cfnApply,
  cfnDelete,
  tplRender
}
