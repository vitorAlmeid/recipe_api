FROM mhart/alpine-node:14

RUN apk add --no-cache make gcc g++ python git

ARG project_home=/install
# ARG production_flag=--production
ENV NODE_PATH=$project_home/node_modules:$project_home/

RUN mkdir -p $project_home &&\
    adduser -u 1000 -g 1000 user -D

WORKDIR $project_home

COPY package*.json ./
RUN npm i -g npm &&\
    npm install $production_flag &&\
    npm cache clean --force &&\
    chown -R user:user $project_home/*

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=1024"

EXPOSE 8000

CMD ["npm", "start"]