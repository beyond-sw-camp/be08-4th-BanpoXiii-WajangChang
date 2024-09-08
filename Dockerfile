# Stage 1: Base Image
FROM nginx:alpine

# Nginx의 기본 설정 파일을 덮어쓰기 위한 설정
COPY nginx.conf /etc/nginx/nginx.conf

# 기존에 준비된 dist 폴더를 Nginx의 웹 루트로 복사
COPY dist /usr/share/nginx/html

# Nginx 포트 공개
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]