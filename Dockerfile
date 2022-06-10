FROM node:18-alpine as dev

RUN apk --update add --no-cache libstdc++ libgcc python3 py3-pip bash \
  && pip3 install --upgrade pip \
  && pip3 install awscli cfn-flip \
  && rm -rf /var/cache/apk/*

WORKDIR /app

COPY package.json *yarn* /app/
RUN yarn install
COPY . /app/


FROM node:18-alpine as release

RUN apk --update add --no-cache libstdc++ libgcc python3 py3-pip bash \
  && pip3 install --upgrade pip \
  && pip3 install awscli cfn-flip \
  && rm -rf /var/cache/apk/*

WORKDIR /app

COPY package.json *yarn* /app/
RUN yarn install
COPY . /app/
RUN chmod +x ctpl && \
    cp ctpl /usr/local/bin/ && \
    cp -r utils /usr/local/bin/ && \
    cp -r node_modules /usr/local/bin/

ENTRYPOINT ["ctpl"]
