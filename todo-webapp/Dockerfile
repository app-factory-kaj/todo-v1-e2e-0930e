FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/templates/default.conf.tmpl
COPY nginx/15-aep-api-proxy.sh /docker-entrypoint.d/15-aep-api-proxy.sh
RUN chmod +x /docker-entrypoint.d/15-aep-api-proxy.sh
# Run as the image's built-in non-root user: a runAsNonRoot admission policy
# rejects a container whose image defaults to root, and everything nginx
# writes at runtime now lives under /tmp (nginx.conf, 15-aep-api-proxy.sh).
USER nginx
EXPOSE 9090
CMD ["nginx", "-g", "daemon off;"]
