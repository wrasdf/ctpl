'use strict';

const utils = require('./utility'),
      path = require('path'),
      supportList = ["yaml", "yml"],
      merge = require('deepmerge')

function componentReader(component, componentsList){
  componentsList.push(component);
  return componentsList
}

function parameterReader(filePath, fileList) {
  if (_isInSupportList(filePath, supportList)) {
    fileList.push(filePath);
  }
  return fileList
}

function keyReader(keypair, keyslist) {
  keyslist.push(keypair)
  return keyslist;
}

function getParameters(cliObj) {
  const opts = cliObj.opts()
  console.log(opts)
  const fileParams = _parameterBuilder(opts.parameters)
  const keyParams = _keyBuilder(opts.keyPairs)
  return merge(fileParams, keyParams)
}

function _getFileExtenionName(filePath) {
  return path.extname(filePath).replace(`\.`, ``).toLowerCase();
}

function _isInSupportList(filePath, list) {
  return list.indexOf(_getFileExtenionName(filePath)) >= 0
}

function _parameterBuilder(files) {
  if (!files) {
    return {}
  }
  return files.filter(file => _isInSupportList(file, supportList))
    .map(file => utils.yamlParser(file))
    .reduce((accumulator, currentValue) => merge(accumulator, currentValue), {})
}

function _keyBuilder(keypairs) {
  if (!keypairs) {
    return {}
  }
  return keypairs.map(keypair => utils.keyParser(keypair))
    .reduce((accumulator, currentValue) => merge(accumulator, currentValue), {})
}

module.exports = {
  componentReader,
  parameterReader,
  keyReader,
  getParameters,
  _isInSupportList,
  _getFileExtenionName,
  _parameterBuilder,
  _keyBuilder
}
