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
                script {
                    def dockerImageTag = "${env.BUILD_NUMBER}"
                    echo "DockerImageTag: ${dockerImageTag}"

                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
                        def image = docker.build("${DOCKER_IMAGE_NAME}:${dockerImageTag}", "./")
                        image.push('latest') // Push with 'latest' tag
                        image.push(dockerImageTag) // Push with build number tag
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