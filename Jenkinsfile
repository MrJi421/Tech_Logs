pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout([ 
                    $class: 'GitSCM', 
                    branches: [[name: '*/main']], 
                    extensions: [], 
                    userRemoteConfigs: [[ 
                        url: 'https://github.com/MrJi421/Tech_Logs.git', 
                        credentialsId: 'techlogs' 
                    ]] 
                ])
            }
        }

        stage('Build') {
            steps {
                echo 'Building Docker Compose services...'
                // bat 'docker-compose -p techlogs build'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Skipping tests for now...'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying the application using Docker Compose...'
                // bat 'docker-compose -p techlogs up -d'
            }
        }
    }
}
