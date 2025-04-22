pipeline {
    agent any

    stages {
        stage('Clone Repo') {
            steps {
                git 'https://github.com/MrJi421/Tech_Logs.git'
            }
        }

        stage('Build') {
            steps {
                echo "Running build step..."
                // your build commands here
            }
        }

        stage('Test') {
            steps {
                echo "Running tests..."
                // your test commands here
            }
        }
    }
}
