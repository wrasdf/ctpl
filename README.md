# Ctpl

Ctpl is a tool for processing AWS CloudFormation‎ Template.

## What's inside the Docker image

- node:11.9.0-alpine
- awscli

## Synopsis

```
Usage: ctpl [options] [command]

Options:
  -v, --version             output the version number
  -c, --components [value]  CloudFormation‎ components (default: [])
  -p, --parameters [value]  parameters file (yaml|yml) (default: [])
  -k, --keyPairs [value]    Key=Value Parameter (default: [])
  -t, --template <file>     template file
  -o, --output <file>       output file
  -h, --help                output usage information

Commands:
  compile                   Compile AWS CloudFormation‎ Component Templates.
  validate                  Validate AWS CloudFormation‎ Component templates.
  apply                     Run AWS CloudFormation‎ Component templates into AWS.
  delete                    Delete AWS CloudFormation‎ Component templates from AWS.
  render                    Generate template
```
