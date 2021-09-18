pipeline {
  agent {
    label 'server15'
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
      agent {
        label 'server15'
      }
      steps {
        sh 'yarn upgrade'
        sh 'yarn'
        sh 'yarn affected:build'
        sh 'yarn affected:publish'
      }
    }
    stage('Build web') {
      agent {
        label 'server15'
      }
      steps {
        sh 'yarn upgrade'
        sh 'yarn build -- -c dev'
      }
    }
    stage('Docker push') {
      agent {
        label 'server15'
      }
      steps {
        sh 'docker build -f Dockerfile --network=host --rm=true -t docker-host.banvien.com.vn/${PROJECT_NAME}/${ENVIRONMENT}/${SERVICE_NAME}:latest .'
        sh 'docker push docker-host.banvien.com.vn/${PROJECT_NAME}/${ENVIRONMENT}/${SERVICE_NAME}:latest'
        sh 'docker rmi docker-host.banvien.com.vn/${PROJECT_NAME}/${ENVIRONMENT}/${SERVICE_NAME}:latest'
      }
    }
    stage('Un-deploy old build') {
      agent {
        label 'server20'
      }
      steps {
        script {
          try {
            sh 'kubectl delete -f ${K8S_FILE} -n ${NAMESPACE}'
          } catch (err) {
            echo 'No old deployment'
          }
        }
      }
    }
    stage('Deploy') {
      agent {
        label 'server20'
      }
      steps {
        sh 'kubectl apply -f ${K8S_FILE} -n ${NAMESPACE}'
      }
    }
  }
}
