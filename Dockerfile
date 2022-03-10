# Based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:stable-alpine
# Copy dist directory
COPY ./dist/apps/demo-web/ /usr/share/nginx/html
# Copy default nginx configuration
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
