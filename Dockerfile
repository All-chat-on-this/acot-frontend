# 前端构建阶段
FROM node:20 AS builder
WORKDIR /app
COPY . .

# ===== 使用 Nginx 部署 =====
FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# 替换默认 Nginx 配置（可选）
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80