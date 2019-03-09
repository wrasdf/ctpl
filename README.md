# Ctpl

Ctpl is the AWS CloudFormation‎ Template Runner.

## What's inside the Docker image

- node:11.9.0-alpine
- ctpl:v0.1.2
- awscli

## Synopsis

```
Usage: ctpl [options] [command]

Options:
  -v, --version             output the version number
  -n, --name [value]        AWS CloundFormation Stack Name
  -c, --components [value]  AWS CloundFormation Components (default: [])
  -p, --parameters [value]  Parameters File (yaml|yml) (default: [])
  -k, --keyPairs [value]    Key=Value Parameter (default: [])
  -h, --help                output usage information

Commands:
  compile                   Compile AWS CloudFormation Component template.
  validate                  Validate AWS CloudFormation Component template.
  apply                     Apply AWS CloudFormation Component template.
  delete                    Delete AWS CloudFormation Component stack.
```

## Quick start

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
