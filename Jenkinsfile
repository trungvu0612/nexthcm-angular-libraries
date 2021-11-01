pipeline {
  agent {
    label 'server20'
  }
  environment {
    ENVIRONMENT = 'dev'
    PROJECT_NAME = 'hrms'
    SERVICE_NAME = 'next-hcm-demo-web'
    NAMESPACE = 'bv-hcm-dev'
    K8S_FILE = 'kubernetes_dev.yml'
  }
  stages {
    stage('Build and publish libraries') {
      steps {
        sh 'yarn upgrade'
        sh 'yarn'
        sh 'yarn run-many:build'
        sh 'yarn run-many:publish'
      }
    }
    stage('Build') {
      stages {
        stage('Build web') {
          steps {
            sh 'yarn upgrade'
            sh 'yarn build -c ${ENVIRONMENT}'
          }
        }
        stage('Docker push') {
          steps {
            sh 'docker build -f Dockerfile --network=host --rm=true -t docker-host.banvien.com.vn/${PROJECT_NAME}/${ENVIRONMENT}/${SERVICE_NAME}:latest .'
            sh "docker push docker-host.banvien.com.vn/${PROJECT_NAME}/${ENVIRONMENT}/${SERVICE_NAME}:latest"
            sh "docker rmi docker-host.banvien.com.vn/${PROJECT_NAME}/${ENVIRONMENT}/${SERVICE_NAME}:latest"
          }
        }
      }
    }
    stage('Deploy') {
      agent {
        label 'server20'
      }
      stages {
        stage('Un-deploy old build') {
          steps {
            script {
              try {
                sh "kubectl delete -f ${K8S_FILE} -n ${NAMESPACE}"
              } catch (err) {
                echo 'No old deployment'
              }
            }
          }
        }
        stage('Deploy') {
          steps {
            sh "kubectl apply -f ${K8S_FILE} -n ${NAMESPACE}"
          }
        }
      }
    }
  }
}
