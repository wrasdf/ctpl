'use strict';

const AWS = require('aws-sdk'),
      utils = require('./utility'),
      cfn = new AWS.CloudFormation({
        'apiVersion': '2010-05-15',
        "region": 'ap-southeast-2'
      })

function createCFNStack(name, cfnFile, callback) {
  console.log(`Craete CFN ${name}`)
  return cfn.createStack({
    'StackName': name,
    'TemplateBody': utils.readfile(cfnFile),
    'Capabilities': [ 'CAPABILITY_IAM', 'CAPABILITY_NAMED_IAM' ]
  }, (err, data) => {
    if (err) {
      console.log(err, err.stack);
    }else {
      console.log(data)
      if (callback) {
        return callback(data)
      }
    }
  })
}

function deleteCFNStack(name, callback) {
  console.log(`Delete CFN ${name}`)
  cfn.deleteStack({
    'StackName': name
  }, (err, data) => {
    if (err) {
      console.log(err, err.stack);
    }else {
      console.log(data)
      if (callback) {
        return callback(data)
      }
    }
  })
}

function updateCFNStack(name, cfnFile, callback) {
  console.log(`Update CFN ${name}`)
  cfn.updateStack({
    'StackName': name,
    'TemplateBody': utils.readfile(cfnFile),
    'Capabilities': [ 'CAPABILITY_IAM', 'CAPABILITY_NAMED_IAM' ]
  }, (err, data) => {
    if (err) {
      console.log(err, err.stack);
    }else {
      console.log(data)
      if (callback) {
        return callback(data)
      }
    }
  })
}

function getCFNStack(name, callback) {
  cfn.listStacks({}, (err, data) => {
    if (err) {
      console.log(err, err.stack);
    }else {
      callback(data.StackSummaries.filter(stack => {
        return stack.StackName === name && stack.StackStatus !== 'DELETE_COMPLETE'
      }))
    }
  })
}

function waitCFNStack(name, callback) {

  console.log(`Wait For Deleting CFN ${name} ...`)
  const waitInterval = setInterval(() => {
    getCFNStack(name, stacks => {
      if (stacks.length === 0 || /^.*COMPLETE.*$/g.test(stacks[0].StackStatus)) {
        clearInterval(waitInterval)
        return callback()
      }
    })
  }, 500)

}

function isStackInProcess(name, callback) {

  getCFNStack(name, stacks => {
    if (/^.*IN_PROGRESS.*$/g.test(stacks[0].StackStatus)) {
      return callback(true, stacks[0])
    }
    return callback(false, stacks[0] ? stacks[0]: {})
  })

}

function deployCFNStack(name, cfnFile) {

  const deadStatus = ['CREATE_FAILED', 'ROLLBACK_COMPLETE']
  getCFNStack(name, stacks => {

    if (stacks.length === 0) {
      return createCFNStack(name, cfnFile)
    }

    const currentStack = stacks[0]
    if (deadStatus.indexOf(currentStack.StackStatus) !== -1) {
      return deleteCFNStack(name, () => {
        waitCFNStack(name, () => createCFNStack(name, cfnFile))
      })
    }

    isStackInProcess(name, (inProcess, stack) => {
      if (inProcess) {
        return console.log(`CFN ${stack.StackName} still ${stack.StackStatus}`)
      }
      updateCFNStack(name, cfnFile)
    })

  })

}

module.exports = {
  deployCFNStack
}
