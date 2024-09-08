pipeline {
    agent any
    tools {
      git 'Default'
      nodejs 'node22'
    }
    environment {
        DOCKER_IMAGE_NAME = 'wajangchang/banpoxiii-web'
    }

    stages {
        stage('Checkout') {
            steps {
                // Github에서 소스코드를 체크아웃 하는 단계
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
                container('docker') {

                    script() {
                        def dockerImageTag = "${env.BUILD_NUMBER}"
                        echo "DockerImageTag: ${dockerImageTag}"
                        
                        sh 'docker logout'

                        // widthCredentials()
                        // - 파이프라인에서 자격 증명을 사용할 수 있는 블록을 생성한다.
                        // - 블록이 끝나면 자격 증명은 제거 된다.
                        // usernamePassword()
                        // - 자격 증명 중 사용자 이름과 비밀 번호를 가져온다.
                        // - credentialsId: 자격 증명을 식별할 수 있는 식별자를 작성한다.
                        // - usernameVariable은 자격 증명에서 가져온 사용자 이름을 지칭하는 환경 변수의 이름을 작성한다.
                        // - passwordVariable은 자격 증명에서 가져온 비밀번호를 저장하는 환경 변수의 이름을 작성한다.
                        withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                            sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                        }

                        // 파이프라인에서 환경 변수를 설정하고 사용할 수 있는 블록을 생성한다.
                        withEnv(["DOCKER_IMAGE_TAG=${dockerImageTag}"]) {

                        sh 'docker build --no-cache -t ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} ./'
                        sh 'docker image inspect ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}'
                        sh 'docker push ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}'
                        }
                        sh 'docker logout'
                    }
                    
                }
            }
        }

        // stage('Deployment') {
        //     steps {
        //         container('kubectl') {

        //             script() {
        //                 def isDeploy = input(
        //                     id: 'deploy',
        //                     message: '배포하시겠습니까?',
        //                     parameters: [
        //                         [$class: 'BooleanParameterDefinition', defaultValue: false, description: '', name: '배포를 하려면 체크해 주세요.']
        //                     ]
        //                 )
                        
        //             }

        //             sh 'kubectl version'
        //             sh 'kubectl get po'

        //             script {
        //                 def dockerImageTag = "${env.BUILD_NUMBER}"
        //                 echo "DockerImageTag: ${dockerImageTag}"
        //                 withEnv(["DockerImageTag=${dockerImageTag}"]) {
        //                     sh 'kubectl set image deploy department-deploy department=${DOCKER_IMAGE_NAME}:${DockerImageTag} -n default'
        //                 }
        //             }
        //         }
        //     }
        // }

    }
    post{
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
            withCredentials([string(credentialsId: 'discord-noti', variable: 'DISCORD')]) {
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