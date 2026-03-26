pipeline {
    agent any
 
    environment {
        APP_NAME = 'taskflow'
    }
 
    stages {
        stage('Checkout') {
            steps {
                echo ' Fetching source code...'
                checkout scm
            }
        }
 
        stage('Cleanup') {
            steps {
                echo '🧹 Cleaning up old containers...'
                sh '''
                    docker compose down --remove-orphans 2>/dev/null || true
                    docker rm -f taskflow-frontend taskflow-api taskflow-mysql 2>/dev/null || true
                '''
            }
        }
 
        stage('Build Images') {
            steps {
                echo ' Building Docker images...'
                // شلنا الـ -f عشان نمنع الـ flag error
                sh 'docker compose build --no-cache'
            }
        }
 
        stage('Deploy') {
            steps {
                echo ' Starting containers...'
                sh 'docker compose up -d'
            }
        }
 
        stage('Health Check') {
            steps {
                echo ' Verifying that the application is running...'
                sh '''
                    sleep 10
                    docker compose ps
                    docker ps | grep taskflow
                '''
            }
        }
    }
 
    post {
        success {
            echo " ✅ Build #${BUILD_NUMBER} succeeded! Application is live."
        }
        failure {
            echo " ❌ Build #${BUILD_NUMBER} failed! Cleaning up..."
            sh 'docker compose down 2>/dev/null || true'
        }
    }
}