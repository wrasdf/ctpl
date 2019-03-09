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
    utils.exec(`echo cfn validate ${file}`)
  })
}

function cfnApply(cliObj) {
  cfnCompile(cliObj)
  cliObj.components.map(component => {
    const file = `${process.cwd()}/${buildPath}/${component}.yaml`
    utils.exec(`echo cfn apply ${file}`)
  })
}

function cfnDelete(cliObj) {
  cfnCompile(cliObj)
  cliObj.components.map(component => {
    const file = `${process.cwd()}/${buildPath}/${component}.yaml`
    utils.exec(`echo cfn delete ${file}`)
  })
}



module.exports = {
  cfnCompile,
  cfnValidate,
  cfnApply,
  cfnDelete
}
