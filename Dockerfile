FROM node:16-alpine

ENV NODE_ENV production

WORKDIR /home/node

COPY --chown=node:node . .

RUN apk --no-cache --virtual build-dependencies add \
	python3 \
	make \
	g++ \
	&& npm i

USER node

CMD ["npm", "run", "bot"];