'use strict';

const parser = require('./parser'),
      utils = require('./utility'),
      Mustache = require('mustache'),
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

function cfnApply(cliObj) {
  cfnCompile(cliObj)
  cliObj.components.map(component => {
    const file = `${process.cwd()}/${buildPath}/${component}.yaml`
    const name = (typeof cliObj.name === "function") ? `${component}-stack` : `${cliObj.name}-${component}-stack`
    const deadStatus = ['CREATE_FAILED', 'ROLLBACK_COMPLETE']
    const status = utils.exec(`aws cloudformation describe-stacks --stack-name ${name}`, {silent: true})
    if (status != "") {
      JSON.parse(status.stdout).Stacks
      .filter(stack => stack.StackName === name )
      .map(stack => {
        if (deadStatus.indexOf(stack.StackStatus) !== -1){
          utils.exec(`aws cloudformation delete-stack --stack-name ${name}`)
        }
      })
    }
// kube-vpc-stack/933f98a0-427b-11e9-9a23-0af0093ead5a is in DELETE_IN_PROGRESS state and can not be updated.
// An error occurred (ValidationError) when calling the DescribeStacks operation: Stack with id kube-vpc-stack does not exist
    // TODO wait for

    utils.exec(`aws cloudformation deploy --stack-name ${name} --template-file ${file}`)
  })
}

function cfnDelete(cliObj) {
  cfnCompile(cliObj)
  cliObj.components.map(component => {
    const name = (typeof cliObj.name === "function") ? `${component}-stack` : `${cliObj.name}-${component}-stack`
    utils.exec(`aws cloudformation delete-stack --stack-name ${name}`)
  })
}

module.exports = {
  cfnCompile,
  cfnValidate,
  cfnApply,
  cfnDelete
}
