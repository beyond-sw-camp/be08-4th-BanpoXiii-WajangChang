pipeline {
    agent any
    tools {
        git 'Default'
        nodejs 'node22'
    }
    environment {
        DOCKER_IMAGE_NAME = 'cloudyong/banpoxiii-web'
    }

    stages {
        stage('Checkout') {
            steps {
                // Github에서 소스코드를 체크아웃하는 단계
                git branch: 'main', 
                    credentialsId: 'github-ssh', 
                    url: 'git@github.com:beyond-sw-camp/be08-4th-BanpoXiii-WajangChang.git'
            }
        }
        
        stage('Build') {
            steps {
                sh 'node --version'
                sh 'npm install'
                
                // Vite 환경 변수 설정 (Jenkins Credentials 사용)
                withCredentials([string(credentialsId: 'banpoxiii-backend-url', variable: 'VITE_PUBLIC_SERVER_URL')]) {
                    sh 'npm run build'
                }

                sh 'ls dist'
            }
        }

        stage('Docker Image Build & Push') {
            steps {
                script {
                    def dockerImageTag = "${env.BUILD_NUMBER}"
                    echo "DockerImageTag: ${dockerImageTag}"
                    
                    // DockerHub 로그인
                    withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                    }

                    // 환경 변수 설정 및 Docker 이미지 빌드
                    withEnv(["DOCKER_IMAGE_TAG=${dockerImageTag}"]) {
                        sh 'docker build --no-cache -t ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} ./'
                        sh 'docker image inspect ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}'
                        sh 'docker push ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}'
                    }
                    
                    // DockerHub 로그아웃
                    sh 'docker logout'
                }
            }
        }
    }

    post {
        success {
            withCredentials([string(credentialsId: 'discord-noti', variable: 'DISCORD')]) {
                discordSend description: """
                제목 : "우리꺼 테스트중"
                결과 : ${currentBuild.result}
                실행 시간 : ${currentBuild.duration / 1000}s
                """,
                result: currentBuild.currentResult,
                title: "${env.JOB_NAME} : ${currentBuild.displayName} 성공", 
                webhookURL: "${DISCORD}"
            }
        }

        failure {
            withCredentials​⬤