pipeline {
    agent any

    environment {
        PYTHON_VERSION = '3.13.1'
        VENV_NAME = 'venv'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Python Environment') {
            steps {
                bat '''
                    python -m venv %VENV_NAME%
                    call %VENV_NAME%\\Scripts\\activate.bat
                    python -m pip install --upgrade pip
                    pip install -r requirements.txt
                '''
            }
        }

        stage('Run Tests') {
            steps {
                bat '''
                    call %VENV_NAME%\\Scripts\\activate.bat
                    python -m pytest tests/
                '''
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                bat '''
                    echo "Deploying application..."
                    rem Add your deployment commands here
                '''
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
