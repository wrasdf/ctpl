FROM node:11.9.0-alpine

RUN apk --update add bash curl jq python3 \
  && rm -rf /var/cache/apk/*
RUN pip3 install awscli==1.15.53 cfn-flip==1.0.3

WORKDIR /app
