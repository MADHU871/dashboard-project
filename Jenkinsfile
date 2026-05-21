pipeline {
    agent any

    stages {

        stage('Git Clone') {
            steps {
                git 'https://github.com/MADHU871/dashboard-project.git'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t dashboard-app .'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {

                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                }
            }
        }

        stage('Docker Push') {
            steps {
                sh 'docker tag dashboard-app YOUR_DOCKER_USERNAME/dashboard-app:latest'
                sh 'docker push YOUR_DOCKER_USERNAME/dashboard-app:latest'
            }
        }
    }
}