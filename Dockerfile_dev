FROM node:lts-slim as build-stage
WORKDIR /app
COPY package.json .npmrc ./
RUN yarn
COPY . ./
RUN yarn affected:build
RUN yarn affected:publish
RUN yarn upgrade
RUN yarn build -- -c dev

# Based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:stable-alpine
# Copy dist directory
COPY --from=build-stage /app/dist/apps/next-hcm-demo-web/ /usr/share/nginx/html
# Copy default nginx configuration
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
