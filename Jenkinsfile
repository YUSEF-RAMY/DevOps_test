pipeline {
    agent any
 
    environment {
        // مش هنحتاج الـ COMPOSE_FILE هنا عشان هنعتمد على الـ default name
        APP_NAME = 'taskflow'
    }
 
    stages {
        stage('Checkout') {
            steps {
                // الكلمة دي هتأكد لنا إن الكاش اتمسح وجينكنز قرأ الجديد
                echo '🚀 Fetching NEW Source Code...' 
                deleteDir() // بيمسح أي ملفات قديمة عشان يضمن إن الـ build نظيف
                checkout scm
            }
        }
 
        stage('Cleanup') {
            steps {
                echo '🧹 Cleaning up old containers...'
                // استخدمنا docker-compose بالشرطة وجربنا نشيل الـ flags اللي بتعمل مشاكل
                sh 'docker compose down || true'
            }
        }
 
        stage('Build Images') {
            steps {
                echo '🏗️ Building Fresh Docker Images...'
                // استخدمنا المسار الكامل والشرطة عشان نهرب من أي لغبطة
                sh 'docker-compose build'
            }
        }
 
        stage('Deploy') {
            steps {
                echo '🚢 Deploying Containers...'
                sh 'docker compose up -d'
            }
        }
 
        stage('Health Check') {
            steps {
                echo '🔍 Verifying Application Status...'
                sh '''
                    sleep 10
                    docker compose ps
                '''
            }
        }
    }
 
    post {
        success {
            echo "✅ Build #${BUILD_NUMBER} SUCCESS! Application is live."
            // شيلنا الـ down من هنا عشان الـ App ميفصلش لو نجح
        }
        failure {
            echo "❌ Build #${BUILD_NUMBER} FAILED! Cleaning up..."
            sh 'docker compose down || true'
        }
    }
}