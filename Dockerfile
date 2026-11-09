# Sử dụng Node.js Alpine siêu nhẹ và ổn định
FROM node:20-alpine

# Thư mục làm việc trong container
WORKDIR /app

# Copy toàn bộ mã nguồn website và backend vào container
COPY server.js .
COPY index.html .
COPY admin.html .
COPY data ./data
COPY uploads ./uploads

# Cấu hình biến môi trường
ENV PORT=80
ENV NODE_ENV=production

# Mở cổng 80
EXPOSE 80

# Khởi chạy server quản trị và website
CMD ["node", "server.js"]
