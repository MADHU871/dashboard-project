pipeline {

    agent any

    environment {
        IMAGE_NAME = "mad0008271/dashboard-project"
        CONTAINER_NAME = "dashboard-container"
    }

    triggers {
        githubPush()
    }

    stages {

        stage('GitHub Checkout') {
            steps {
                git branch: 'main',
                url: 'https://github.com/MADHU871/dashboard-project.git'
            }
        }

        stage('Docker Version') {
            steps {
                sh 'docker --version'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t $IMAGE_NAME:latest .'
            }
        }

        stage('Docker Images') {
            steps {
                sh 'docker images'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    sh '''
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    '''
                }
            }
        }

        stage('Docker Push') {
            steps {
                sh 'docker push $IMAGE_NAME:latest'
            }
        }

        stage('Docker Pull') {
            steps {
                sh 'docker pull $IMAGE_NAME:latest'
            }
        }

        stage('Docker Run') {
            steps {
                sh '''
                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true

                docker run -d \
                --name $CONTAINER_NAME \
                -p 3000:3000 \
                $IMAGE_NAME:latest
                '''
            }
        }

        stage('Docker PS') {
            steps {
                sh 'docker ps -a'
            }
        }

        stage('Docker Logs') {
            steps {
                sh 'docker logs $CONTAINER_NAME || true'
            }
        }

        stage('Docker Copy') {
            steps {
                sh '''
                docker cp $CONTAINER_NAME:/app/package.json .
                '''
            }
        }

        stage('Docker Error Finder') {
            steps {
                sh '''
                docker inspect $CONTAINER_NAME
                '''
            }
        }

        stage('Azure Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'azure-creds',
                    usernameVariable: 'AZ_USER',
                    passwordVariable: 'AZ_PASS'
                )]) {

                    sh '''
                    az login -u $AZ_USER -p $AZ_PASS
                    '''
                }
            }
        }

        stage('Azure Resource Group') {
            steps {
                sh '''
                az group create \
                --name dashboard-group \
                --location centralindia
                '''
            }
        }

        stage('Azure App Service Plan') {
            steps {
                sh '''
                az appservice plan create \
                --name dashboard-plan \
                --resource-group dashboard-group \
                --is-linux \
                --sku B1
                '''
            }
        }

        stage('Azure Web App Create') {
            steps {
                sh '''
                az webapp create \
                --resource-group dashboard-group \
                --plan dashboard-plan \
                --name dashboard-project-app \
                --deployment-container-image-name $IMAGE_NAME:latest
                '''
            }
        }

        stage('Azure Container Config') {
            steps {
                sh '''
                az webapp config container set \
                --name dashboard-project-app \
                --resource-group dashboard-group \
                --docker-custom-image-name $IMAGE_NAME:latest
                '''
            }
        }

        stage('Azure Restart') {
            steps {
                sh '''
                az webapp restart \
                --name dashboard-project-app \
                --resource-group dashboard-group
                '''
            }
        }

        stage('Automation Complete') {
            steps {
                echo 'CI/CD Pipeline Completed Successfully'
            }
        }
    }

    post {

        success {
            echo 'Build Success'
        }

        failure {
            echo 'Build Failed'
        }

        always {
            sh 'docker ps -a'
        }
    }
}