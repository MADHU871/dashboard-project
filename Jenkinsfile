pipeline {

    agent any

    environment {

        IMAGE_NAME = "mad0008271/dashboard-project"
        CONTAINER_NAME = "dashboard-container"

        RESOURCE_GROUP = "dashboard-group"
        APP_SERVICE_PLAN = "dashboard-plan"
        WEB_APP_NAME = "dashboard-project-app-123"

        TENANT_ID = "f4b81dce-44c2-4160-9157-9abe26a93676"
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

                sh '''
                docker build -t $IMAGE_NAME:latest .
                '''
            }
        }

        stage('Docker Images') {

            steps {

                sh '''
                docker images
                '''
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

                sh '''
                docker push $IMAGE_NAME:latest
                '''
            }
        }

        stage('Docker Pull') {

            steps {

                sh '''
                docker pull $IMAGE_NAME:latest
                '''
            }
        }

        stage('Docker Run') {

            steps {

                sh '''
                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true

                docker run -d \
                --name $CONTAINER_NAME \
                -p 3000:80 \
                $IMAGE_NAME:latest
                '''
            }
        }

        stage('Docker PS') {

            steps {

                sh '''
                docker ps -a
                '''
            }
        }

        stage('Docker Logs') {

            steps {

                sh '''
                docker logs $CONTAINER_NAME || true
                '''
            }
        }

        stage('Docker Copy') {

            steps {

                sh '''
                docker cp $CONTAINER_NAME:/usr/share/nginx/html .
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
                    credentialsId: 'azure-service-principal',
                    usernameVariable: 'AZURE_CLIENT_ID',
                    passwordVariable: 'AZURE_CLIENT_SECRET'
                )]) {

                    sh '''
                    az login --service-principal \
                    --username $AZURE_CLIENT_ID \
                    --password $AZURE_CLIENT_SECRET \
                    --tenant $TENANT_ID
                    '''
                }
            }
        }

        stage('Azure Resource Group') {

            steps {

                sh '''
                az group create \
                --name $RESOURCE_GROUP \
                --location centralindia
                '''
            }
        }

        stage('Azure App Service Plan') {

            steps {

                sh '''
                az appservice plan create \
                --name $APP_SERVICE_PLAN \
                --resource-group $RESOURCE_GROUP \
                --is-linux \
                --sku B1
                '''
            }
        }

        stage('Azure Web App Create') {

            steps {

                sh '''
                az webapp create \
                --resource-group $RESOURCE_GROUP \
                --plan $APP_SERVICE_PLAN \
                --name $WEB_APP_NAME \
                --deployment-container-image-name $IMAGE_NAME:latest
                '''
            }
        }

        stage('Azure Container Config') {

            steps {

                sh '''
                az webapp config container set \
                --name $WEB_APP_NAME \
                --resource-group $RESOURCE_GROUP \
                --docker-custom-image-name $IMAGE_NAME:latest
                '''
            }
        }

        stage('Azure Port Config') {

            steps {

                sh '''
                az webapp config appsettings set \
                --resource-group $RESOURCE_GROUP \
                --name $WEB_APP_NAME \
                --settings WEBSITES_PORT=80
                '''
            }
        }

        stage('Azure Restart') {

            steps {

                sh '''
                az webapp restart \
                --name $WEB_APP_NAME \
                --resource-group $RESOURCE_GROUP
                '''
            }
        }

        stage('Azure URL') {

            steps {

                sh '''
                az webapp browse \
                --name $WEB_APP_NAME \
                --resource-group $RESOURCE_GROUP
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

            sh '''
            docker ps -a
            '''
        }
    }
}