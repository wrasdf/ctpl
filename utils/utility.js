'use strict';

const join = require('path').join,
      fs = require('fs-extra'),
      shell = require('shelljs'),
      yaml = require('js-yaml')

function exec(script) {
  return shell.exec(script);
}

function rmdir(directory) {
  return shell.rm('-rf', directory);
}

function yamlParser(filePath) {
  return yaml.load(readfile(filePath), 'utf8') || {}
}

function keyParser(keypair) {
  const results = {}
  const pairArr = keypair.split('=')
  if (pairArr[1]) {
    const keyArr = pairArr[0].split('.')
    keyArr.reduce(
      (accumulator, currentValue, index) => {
        accumulator[currentValue] = {}
        if (index === keyArr.length-1) {
          accumulator[currentValue] = pairArr[1]
        }
        return accumulator[currentValue]
      }
      , results
    )
  }
  return results
}

function readdir(dir) {
  return fs.readdirSync(dir).map(f => join(dir, f))
}

function readfile(path) {
  return fs.readFileSync(path, 'utf8');
}

function writeFile(path, content) {
  return fs.outputFileSync(path, content, 'utf8');
}

module.exports = {
  yamlParser,
  keyParser,
  exec,
  rmdir,
  readdir,
  readfile,
  writeFile
}
