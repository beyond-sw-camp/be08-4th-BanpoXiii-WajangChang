FROM nginx:stable-alpine3.20
LABEL maintainer="cloudyong <cloudyong3620@gmail.com>"
LABEL version="1.0"
COPY dist /usr/share/nginx/html
# SPA 라우팅 처리를 . 할수. ㅣㅆ도록 기본 설정을 변경한 파일로 교체
COPY default.conf /etc/nginx/conf.d/default.confdo
ENV TZ=Asia/Seoul
EXPOSE 80
# nginx를 실행하는 명령어 작성
CMD [ "nginx", "-g", "daemon off;" ]