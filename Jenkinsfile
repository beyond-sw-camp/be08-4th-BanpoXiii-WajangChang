pipeline {
    agent any
    tools {
        git 'Default'
        nodejs 'node22'
    }
    environment {
        DOCKER_IMAGE_NAME = 'cloudyong/banpoxiii-web'
        DOCKER_IMAGE_TAG = "${env.BUILD_NUMBER}"
        REMOTE_DIRECTORY = '/path/to/remote/directory' // 원격 서버의 작업 디렉토리
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                    credentialsId: 'github-ssh', 
                    url: 'git@github.com:beyond-sw-camp/be08-4th-BanpoXiii-WajangChang.git'
            }
        }
        stage('Build') {
            steps {
                sh 'node --version'
                sh 'npm install'
                sh 'npm run build'
                sh 'ls dist'
            }
        }
        stage('Docker Image Build & Push') {
            steps {
                script() {
                    echo "DockerImageTag: ${DOCKER_IMAGE_TAG}"
                    
                    sh 'docker logout'
                    
                    withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                    }
                    
                    withEnv(["DOCKER_IMAGE_TAG=${DOCKER_IMAGE_TAG}"]) {
                        sh 'docker build --no-cache -t ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} ./'
                        sh 'docker image inspect ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}'
                        sh 'docker push ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}'
                    }
                    sh 'docker logout'
                }
            }
        }
        stage('Deploy to Ec2') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'ec2-banpoxiii-web-endpoint', variable: 'REMOTE_SERVER_NAME')]) {
                        echo "REMOTE_SERVER_NAME: ${REMOTE_SERVER_NAME}"
                        sshPublisher(
                            failOnError: true,
                            publishers: [
                                sshPublisherDesc(
                                    configName: "${REMOTE_SERVER_NAME}",
                                    verbose: true,
                                    transfers: [
                                        sshTransfer(
                                            execCommand: """
                                                docker pull ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}
                                                docker container rm -f banpoxiii-web || true
                                                docker run -d --name banpoxiii-web -p 30021:80 ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}
                                            """
                                        )
                                    ]
                                )
                            ]
                        )
                    }
                }
            }
        }
    }
    post {
        success {
            script() {

            withCredentials([string(credentialsId: 'discord-noti', variable: 'DISCORD')]) {
                echo "DISCORD: ${DISCORD}"
                discordSend description: """
                제목 : "배포 테스트중"
                결과 : ${currentBuild.result}
                실행 시간 : ${currentBuild.duration / 1000}s
                """,
                result: currentBuild.currentResult,
                title: "${env.JOB_NAME} : ${currentBuild.displayName} 성공", 
                webhookURL: "${DISCORD}"
            }
            }
        }

        failure {
            script() {

                withCredentials([string(credentialsId: 'discord-noti', variable: 'DISCORD')]) {
                    echo "DISCORD: ${DISCORD}"
                    discordSend description: """
                    제목 : "우리꺼 테스트중"
                    결과 : ${currentBuild.result}
                    실행 시간 : ${currentBuild.duration / 1000}s
                    """,
                    result: currentBuild.currentResult,
                    title: "${env.JOB_NAME} : ${currentBuild.displayName} 실패", 
                    webhookURL: "${DISCORD}"
                }
            }
        }
    }
}