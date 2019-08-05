FROM node:12-alpine

RUN apk --update add bash curl jq python3 \
  && rm -rf /var/cache/apk/*
RUN pip3 install --upgrade pip && pip3 install awscli==1.16.116 cfn-flip==1.1.0

WORKDIR /app

COPY package.json *yarn* /app/
RUN yarn install
COPY . /app/
RUN chmod +x ctpl && \
    cp ctpl /usr/local/bin/ && \
    cp -r utils /usr/local/bin/ && \
    cp -r node_modules /usr/local/bin/

ENTRYPOINT ["ctpl"]
