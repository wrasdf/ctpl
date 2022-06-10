# Ctpl 
Ctpl is the AWS CloudFormation‎ Template Runner.

## What's inside the Docker image
- node:18-alpine
- ctpl
- awscli

## Synopsis
```
Usage: ctpl [options] [command]

Options:
  -s, --prefix [value]      AWS CloudFormation StackName prefix
  -c, --components [value]  AWS CloudFormation Components (default: [])
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
- Compile AWS CloudFormation component templates

```
docker run --rm -v $(pwd):/app -v ~/.aws:/root/.aws -w /app ikerry/ctpl:latest compile \
  -p "envs/dev.yaml" \
  -k "VPC.Name=cluster" \
  -c "infra/vpc"
```

- Validate AWS CloudFormation component templates

```
docker run --rm -v $(pwd):/app -v ~/.aws:/root/.aws -w /app ikerry/ctpl:latest validate \
  -p "envs/dev.yaml" \
  -k "VPC.Name=cluster" \
  -c "infra/vpc"
```

- Apply AWS CloudFormation component templates

```
docker run --rm -v $(pwd):/app -v ~/.aws:/root/.aws -w /app ikerry/ctpl:latest apply \
  -p "envs/dev.yaml" \
  -k "VPC.Name=cluster" \
  -c "infra/vpc"
```

- Delete AWS CloudFormation component templates

```
docker run --rm -v $(pwd):/app -v ~/.aws:/root/.aws -w /app ikerry/ctpl:latest delete \
  -p "envs/dev.yaml" \
  -k "VPC.Name=cluster" \
  -c "infra/vpc"
```
