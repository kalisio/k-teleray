FROM  node:8

MAINTAINER Kalisio <contact@kalisio.xyz>

ENV DEBUG=

RUN mkdir /home/node/.npm-global
ENV PATH=/home/node/.npm-global/bin:$PATH
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

RUN npm install -g @kalisio/krawler@0.5.2 --unsafe

COPY jobfile.js .

CMD krawler --cron "* */10 * * * *" jobfile.js

