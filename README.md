# Ctpl [![CircleCI](https://circleci.com/gh/wrasdf/ctpl/tree/master.svg?style=svg)](https://circleci.com/gh/wrasdf/ctpl/tree/master)

Ctpl is the AWS CloudFormation‎ Template Runner.

## What's inside the Docker image

- node:11.9.0-alpine
- ctpl
- awscli

## Synopsis

```
Usage: ctpl [options] [command]

Options:
  -s, --prefix [value]      AWS CloudFormation StackName prefix)
  -c, --components [value]  AWS CloudFormation Components (default: [])
  -p, --parameters [value]  Parameters File (yaml|yml) (default: [])
  -k, --keyPairs [value]    Key=Value Parameter (default: [])
  -t, --template <file>     template file
  -o, --output <file>       output file
  -h, --help                output usage information

Commands:
  compile                   Compile AWS CloudFormation Component template.
  validate                  Validate AWS CloudFormation Component template.
  apply                     Apply AWS CloudFormation Component template.
  delete                    Delete AWS CloudFormation Component stack.
```

## Quick start

- Render templates with params

```
docker run --rm -v $(pwd):/app -v ~/.aws:/root/.aws -w /app ikerry/ctpl:latest render \
  -p "envs/dev.yaml" \
  -k "VPC.Name=cluster" \
  -t "cfns/vpc.yaml" \
  -o "test.yaml"
```

- Validate AWS CloudFormation component templates

```
docker run --rm -v $(pwd):/app -v ~/.aws:/root/.aws -w /app ikerry/ctpl:latest validate \
  -p "envs/default.yaml" \
  -p "envs/dev.yaml" \
  -k "VPC.Name=cluster" \
  -c "vpc"
```

- Apply AWS CloudFormation component templates

```
docker run --rm -v $(pwd):/app -v ~/.aws:/root/.aws -w /app ikerry/ctpl:latest apply \
  -n "kube" \
  -p "envs/default.yaml" \
  -p "envs/dev.yaml" \
  -k "VPC.Name=cluster" \
  -c "vpc"
```
